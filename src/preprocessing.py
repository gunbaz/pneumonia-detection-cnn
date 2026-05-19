import cv2
import numpy as np
import os
import shutil
from pathlib import Path
from sklearn.model_selection import train_test_split
import tensorflow as tf


IMG_SIZE = (224, 224)


def apply_clahe(img_array: np.ndarray) -> np.ndarray:
    """CLAHE uygula: LAB renk uzayında yalnızca L kanalına."""
    img_uint8 = (img_array * 255).astype(np.uint8)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    lab = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2LAB)
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])
    result = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    return result.astype(np.float32) / 255.0


def load_image(path: str, size=IMG_SIZE) -> np.ndarray:
    img = cv2.imread(path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, size)
    return img.astype(np.float32) / 255.0


def create_stratified_val_split(train_dir: str, val_dir: str, val_ratio: float = 0.10):
    """
    Orijinal 16-görüntülük validation setini atlayıp eğitim setinden
    stratified %10 validation oluşturur.
    """
    classes = ['NORMAL', 'PNEUMONIA']
    all_paths, all_labels = [], []

    for label, cls in enumerate(classes):
        cls_dir = os.path.join(train_dir, cls)
        for fname in os.listdir(cls_dir):
            if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                all_paths.append(os.path.join(cls_dir, fname))
                all_labels.append(label)

    train_paths, new_val_paths, train_labels, val_labels = train_test_split(
        all_paths, all_labels,
        test_size=val_ratio,
        stratify=all_labels,
        random_state=42
    )

    for cls in classes:
        os.makedirs(os.path.join(val_dir, cls), exist_ok=True)

    for path, label in zip(new_val_paths, val_labels):
        cls = classes[label]
        dest = os.path.join(val_dir, cls, os.path.basename(path))
        shutil.copy2(path, dest)

    print(f"Yeni validation seti: {len(new_val_paths)} görüntü")
    print(f"  NORMAL: {val_labels.count(0)}, PNEUMONIA: {val_labels.count(1)}")
    return train_paths, train_labels, new_val_paths, val_labels


def make_generator(directory: str, use_clahe: bool = False,
                   augment: bool = True, batch_size: int = 32,
                   shuffle: bool = True):
    """
    tf.keras ImageDataGenerator ile pipeline.
    use_clahe=True ise preprocessing_function olarak apply_clahe eklenir.
    """
    aug_kwargs = dict(
        rescale=1.0 / 255,
        horizontal_flip=augment,
        rotation_range=15 if augment else 0,
        zoom_range=0.2 if augment else 0,
    )

    if use_clahe:
        def clahe_preprocess(img):
            return apply_clahe(img / 255.0) if img.max() > 1.0 else apply_clahe(img)
        aug_kwargs['rescale'] = None
        aug_kwargs['preprocessing_function'] = clahe_preprocess

    datagen = tf.keras.preprocessing.image.ImageDataGenerator(**{
        k: v for k, v in aug_kwargs.items() if v is not None
    })

    gen = datagen.flow_from_directory(
        directory,
        target_size=IMG_SIZE,
        batch_size=batch_size,
        class_mode='binary',
        shuffle=shuffle,
        seed=42,
    )
    return gen


def make_generator_minimal(directory: str, augment: bool = True,
                            batch_size: int = 32, shuffle: bool = True):
    return make_generator(directory, use_clahe=False,
                          augment=augment, batch_size=batch_size, shuffle=shuffle)


def make_generator_clahe(directory: str, augment: bool = True,
                          batch_size: int = 32, shuffle: bool = True):
    return make_generator(directory, use_clahe=True,
                          augment=augment, batch_size=batch_size, shuffle=shuffle)
