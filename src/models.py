import tensorflow as tf
from tensorflow.keras import layers, models, applications


IMG_SHAPE = (224, 224, 3)


def build_custom_cnn() -> tf.keras.Model:
    """
    Stephen et al. 2019 (JHE) benzeri küçük custom CNN.
    ~500K parametre, sıfırdan eğitilir.
    """
    model = models.Sequential([
        layers.Input(shape=IMG_SHAPE),

        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),

        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),

        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid'),
    ], name='custom_cnn')
    return model


def build_vgg16(fine_tune_layers: int = 4) -> tf.keras.Model:
    """
    ImageNet ön-eğitimli VGG16.
    fine_tune_layers: son kaç bloğun ağırlıkları açılır (fine-tune aşamasında).
    İlk çağrıda tüm base dondurulmuş gelir; fine-tune için unfreeze_for_finetune() çağır.
    """
    base = applications.VGG16(weights='imagenet', include_top=False,
                               input_shape=IMG_SHAPE)
    base.trainable = False

    inputs = tf.keras.Input(shape=IMG_SHAPE)
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)

    model = tf.keras.Model(inputs, outputs, name='vgg16_transfer')
    model._base_model = base
    model._fine_tune_layers = fine_tune_layers
    return model


def build_resnet50(fine_tune_layers: int = 10) -> tf.keras.Model:
    """
    ImageNet ön-eğitimli ResNet50.
    """
    base = applications.ResNet50(weights='imagenet', include_top=False,
                                  input_shape=IMG_SHAPE)
    base.trainable = False

    inputs = tf.keras.Input(shape=IMG_SHAPE)
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)

    model = tf.keras.Model(inputs, outputs, name='resnet50_transfer')
    model._base_model = base
    model._fine_tune_layers = fine_tune_layers
    return model


def unfreeze_for_finetune(model: tf.keras.Model):
    """Transfer learning modelinde son N katmanı fine-tune için açar."""
    base = model._base_model
    n = model._fine_tune_layers
    base.trainable = True
    for layer in base.layers[:-n]:
        layer.trainable = False
    print(f"Fine-tune: son {n} katman açıldı ({base.name})")


def build_hybrid_feature_extractor() -> tf.keras.Model:
    """VGG16 block5_pool çıkışını feature vektörü olarak döndürür (SVM için)."""
    base = applications.VGG16(weights='imagenet', include_top=False,
                               input_shape=IMG_SHAPE)
    base.trainable = False
    pool = layers.GlobalAveragePooling2D()(base.output)
    return tf.keras.Model(inputs=base.input, outputs=pool,
                          name='vgg16_feature_extractor')
