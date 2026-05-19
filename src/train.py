import os
import csv
import tensorflow as tf
from pathlib import Path

from models import (
    build_custom_cnn, build_vgg16, build_resnet50, unfreeze_for_finetune
)
from preprocessing import make_generator_minimal, make_generator_clahe
from evaluate import evaluate_model, append_metrics_csv

DATA_DIR = Path(__file__).parent.parent / 'data' / 'chest_xray' / 'chest_xray'
RESULTS_DIR = Path(__file__).parent.parent / 'results'
FIGURES_DIR = RESULTS_DIR / 'figures'
METRICS_CSV = RESULTS_DIR / 'metrics.csv'

TRAIN_DIR = str(DATA_DIR / 'train')
VAL_DIR   = str(DATA_DIR / 'val')
TEST_DIR  = str(DATA_DIR / 'test')

BATCH_SIZE = 32
EPOCHS_FROZEN = 10
EPOCHS_FINETUNE = 5
EPOCHS_CNN = 20


def get_callbacks(model_name: str, preprocessing: str):
    ckpt_path = str(RESULTS_DIR / f'{model_name}_{preprocessing}_best.keras')
    return [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss', patience=3, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(
            ckpt_path, monitor='val_loss', save_best_only=True),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss', factor=0.5, patience=2, min_lr=1e-7),
    ]


def train_custom_cnn(preprocessing: str = 'minimal'):
    print(f"\n{'='*50}")
    print(f"Custom CNN | önişleme: {preprocessing}")
    print('='*50)

    gen_fn = make_generator_minimal if preprocessing == 'minimal' else make_generator_clahe
    train_gen = gen_fn(TRAIN_DIR, augment=True,  batch_size=BATCH_SIZE)
    val_gen   = gen_fn(VAL_DIR,   augment=False, batch_size=BATCH_SIZE, shuffle=False)
    test_gen  = gen_fn(TEST_DIR,  augment=False, batch_size=BATCH_SIZE, shuffle=False)

    model = build_custom_cnn()
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-3),
        loss='binary_crossentropy',
        metrics=['accuracy'],
    )
    model.summary()

    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS_CNN,
        callbacks=get_callbacks('custom_cnn', preprocessing),
    )

    metrics = evaluate_model(model, test_gen, 'custom_cnn', preprocessing)
    append_metrics_csv(metrics, str(METRICS_CSV))
    _save_history(history, 'custom_cnn', preprocessing)
    return model, history


def train_transfer(model_name: str, preprocessing: str = 'minimal'):
    print(f"\n{'='*50}")
    print(f"{model_name} | önişleme: {preprocessing}")
    print('='*50)

    gen_fn = make_generator_minimal if preprocessing == 'minimal' else make_generator_clahe
    train_gen = gen_fn(TRAIN_DIR, augment=True,  batch_size=BATCH_SIZE)
    val_gen   = gen_fn(VAL_DIR,   augment=False, batch_size=BATCH_SIZE, shuffle=False)
    test_gen  = gen_fn(TEST_DIR,  augment=False, batch_size=BATCH_SIZE, shuffle=False)

    build_fn = build_vgg16 if model_name == 'vgg16' else build_resnet50
    model = build_fn()

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-4),
        loss='binary_crossentropy',
        metrics=['accuracy'],
    )

    print("--- Dondurulmuş eğitim ---")
    history_frozen = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS_FROZEN,
        callbacks=get_callbacks(model_name, preprocessing + '_frozen'),
    )

    print("--- Fine-tune ---")
    unfreeze_for_finetune(model)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),
        loss='binary_crossentropy',
        metrics=['accuracy'],
    )
    history_ft = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS_FINETUNE,
        callbacks=get_callbacks(model_name, preprocessing),
    )

    metrics = evaluate_model(model, test_gen, model_name, preprocessing)
    append_metrics_csv(metrics, str(METRICS_CSV))
    _save_history(history_ft, model_name, preprocessing)
    return model, history_ft


def _save_history(history, model_name: str, preprocessing: str):
    import pandas as pd
    df = pd.DataFrame(history.history)
    df.to_csv(str(RESULTS_DIR / f'history_{model_name}_{preprocessing}.csv'), index=False)


def run_all_experiments():
    os.makedirs(str(RESULTS_DIR), exist_ok=True)
    os.makedirs(str(FIGURES_DIR), exist_ok=True)

    for preprocessing in ['minimal', 'clahe']:
        train_custom_cnn(preprocessing)
        train_transfer('vgg16', preprocessing)
        train_transfer('resnet50', preprocessing)

    print("\nTüm 6 deney tamamlandı.")
    print(f"Metrikler: {METRICS_CSV}")


if __name__ == '__main__':
    run_all_experiments()
