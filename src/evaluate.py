import csv
import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix, roc_curve,
)

FIGURES_DIR = Path(__file__).parent.parent / 'results' / 'figures'


def evaluate_model(model, test_gen, model_name: str, preprocessing: str) -> dict:
    test_gen.reset()
    y_prob = model.predict(test_gen, verbose=1).ravel()
    y_pred = (y_prob >= 0.5).astype(int)
    y_true = test_gen.classes

    metrics = {
        'model': model_name,
        'preprocessing': preprocessing,
        'accuracy':  round(accuracy_score(y_true, y_pred), 4),
        'precision': round(precision_score(y_true, y_pred, zero_division=0), 4),
        'recall':    round(recall_score(y_true, y_pred, zero_division=0), 4),
        'f1':        round(f1_score(y_true, y_pred, zero_division=0), 4),
        'auc':       round(roc_auc_score(y_true, y_prob), 4),
    }

    print(f"\n[{model_name} | {preprocessing}]")
    for k, v in metrics.items():
        print(f"  {k}: {v}")

    _plot_confusion_matrix(y_true, y_pred, model_name, preprocessing)
    _plot_roc_curve(y_true, y_prob, model_name, preprocessing)

    return metrics


def append_metrics_csv(metrics: dict, csv_path: str):
    write_header = not os.path.exists(csv_path)
    with open(csv_path, 'a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=metrics.keys())
        if write_header:
            writer.writeheader()
        writer.writerow(metrics)


def _plot_confusion_matrix(y_true, y_pred, model_name: str, preprocessing: str):
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=['Normal', 'Pneumonia'],
                yticklabels=['Normal', 'Pneumonia'], ax=ax)
    ax.set_xlabel('Tahmin')
    ax.set_ylabel('Gerçek')
    ax.set_title(f'Confusion Matrix\n{model_name} | {preprocessing}')
    fig.tight_layout()
    fname = FIGURES_DIR / f'cm_{model_name}_{preprocessing}.png'
    fig.savefig(str(fname), dpi=150)
    plt.close(fig)
    print(f"  Confusion matrix kaydedildi: {fname}")


def _plot_roc_curve(y_true, y_prob, model_name: str, preprocessing: str):
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    auc = roc_auc_score(y_true, y_prob)
    fig, ax = plt.subplots(figsize=(5, 4))
    ax.plot(fpr, tpr, lw=2, label=f'AUC = {auc:.3f}')
    ax.plot([0, 1], [0, 1], 'k--', lw=1)
    ax.set_xlabel('False Positive Rate')
    ax.set_ylabel('True Positive Rate (Recall)')
    ax.set_title(f'ROC Eğrisi\n{model_name} | {preprocessing}')
    ax.legend(loc='lower right')
    fig.tight_layout()
    fname = FIGURES_DIR / f'roc_{model_name}_{preprocessing}.png'
    fig.savefig(str(fname), dpi=150)
    plt.close(fig)
    print(f"  ROC eğrisi kaydedildi: {fname}")


def plot_training_history(history_csv_path: str, model_name: str, preprocessing: str):
    """history_{model}_{preprocessing}.csv dosyasından loss eğrisi çizer."""
    import pandas as pd
    df = pd.read_csv(history_csv_path)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))

    axes[0].plot(df['loss'], label='Train Loss')
    axes[0].plot(df['val_loss'], label='Val Loss')
    axes[0].set_title('Loss')
    axes[0].set_xlabel('Epoch')
    axes[0].legend()

    axes[1].plot(df['accuracy'], label='Train Acc')
    axes[1].plot(df['val_accuracy'], label='Val Acc')
    axes[1].set_title('Accuracy')
    axes[1].set_xlabel('Epoch')
    axes[1].legend()

    fig.suptitle(f'{model_name} | {preprocessing}')
    fig.tight_layout()
    fname = FIGURES_DIR / f'history_{model_name}_{preprocessing}.png'
    fig.savefig(str(fname), dpi=150)
    plt.close(fig)
    print(f"Loss eğrisi kaydedildi: {fname}")


def print_metrics_table(csv_path: str):
    import pandas as pd
    df = pd.read_csv(csv_path)
    print("\n" + "="*70)
    print("6 DENEY METRİK TABLOSU")
    print("="*70)
    print(df.to_string(index=False))
    print("="*70)
