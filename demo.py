"""
Pnömoni Tespiti — Canlı Demo
Çalıştır: python demo.py
Tarayıcıda aç: http://localhost:7860
"""

import sys
import os
import numpy as np
import cv2
from pathlib import Path
import tensorflow as tf
import gradio as gr
import pandas as pd

sys.path.insert(0, str(Path(__file__).parent / 'src'))
from preprocessing import apply_clahe

BASE_DIR    = Path(__file__).parent
RESULTS_DIR = BASE_DIR / 'results'
FIGURES_DIR = RESULTS_DIR / 'figures'
IMG_SIZE    = (224, 224)

# ---------------------------------------------------------------------------
# Model yükleme
# ---------------------------------------------------------------------------
print("Modeller yükleniyor...")

MODELS = {}
model_files = {
    "VGG16 (En İyi — AUC 0.9756)":    RESULTS_DIR / "vgg16_minimal_best.keras",
    "ResNet50 (AUC 0.9453)":           RESULTS_DIR / "resnet50_minimal_best.keras",
    "Custom CNN (AUC 0.9177)":         RESULTS_DIR / "custom_cnn_minimal_best.keras",
}

for name, path in model_files.items():
    if path.exists():
        MODELS[name] = tf.keras.models.load_model(str(path))
        print(f"  ✓ {name}")
    else:
        print(f"  ✗ {name} — dosya bulunamadı: {path}")

# ---------------------------------------------------------------------------
# Metrik tablosu
# ---------------------------------------------------------------------------
METRICS = pd.DataFrame([
    {"Model": "Custom CNN", "Önişleme": "Minimal", "Accuracy": 0.8814, "Precision": 0.8641, "Recall": 0.9615, "F1": 0.9102, "AUC": 0.9177},
    {"Model": "Custom CNN", "Önişleme": "CLAHE",   "Accuracy": 0.8317, "Precision": 0.7950, "Recall": 0.9846, "F1": 0.8797, "AUC": 0.9202},
    {"Model": "VGG16",      "Önişleme": "Minimal", "Accuracy": 0.9119, "Precision": 0.8923, "Recall": 0.9769, "F1": 0.9327, "AUC": 0.9756},
    {"Model": "VGG16",      "Önişleme": "CLAHE",   "Accuracy": 0.9006, "Precision": 0.8850, "Recall": 0.9667, "F1": 0.9240, "AUC": 0.9647},
    {"Model": "ResNet50",   "Önişleme": "Minimal", "Accuracy": 0.8750, "Precision": 0.8594, "Recall": 0.9564, "F1": 0.9053, "AUC": 0.9453},
    {"Model": "ResNet50",   "Önişleme": "CLAHE",   "Accuracy": 0.8766, "Precision": 0.8598, "Recall": 0.9590, "F1": 0.9067, "AUC": 0.9468},
])


# ---------------------------------------------------------------------------
# Tahmin fonksiyonu
# ---------------------------------------------------------------------------
def predict(image, model_name):
    if image is None:
        return "⚠️ Lütfen bir görüntü yükleyin.", None, None, None

    if model_name not in MODELS:
        return "⚠️ Model yüklenemedi.", None, None, None

    model = MODELS[model_name]

    # Ön işleme
    img = cv2.resize(image, IMG_SIZE).astype(np.float32) / 255.0
    img_clahe = apply_clahe(img)

    # Tahmin
    inp = np.expand_dims(img, axis=0)
    prob = float(model.predict(inp, verbose=0)[0][0])

    # Sonuç
    if prob >= 0.5:
        label   = "🔴 PNÖMONİ"
        conf    = prob * 100
        color   = "#FF4B4B"
        detail  = f"Model, bu görüntüde pnömoni işaretleri tespit etti."
    else:
        label   = "🟢 NORMAL"
        conf    = (1 - prob) * 100
        color   = "#21C354"
        detail  = f"Model, bu görüntüyü normal olarak sınıflandırdı."

    result_html = f"""
    <div style="text-align:center; padding:20px; border-radius:12px;
                background:{color}22; border:2px solid {color};">
        <h1 style="color:{color}; margin:0; font-size:2.5em;">{label}</h1>
        <p style="font-size:1.3em; margin:8px 0;">
            <b>Güven: {conf:.1f}%</b>
        </p>
        <p style="color:#555;">{detail}</p>
        <p style="color:#888; font-size:0.85em;">Ham olasılık (Pneumonia): {prob:.4f}</p>
    </div>
    """

    # Görseller: orijinal ve CLAHE
    orig_show  = (img * 255).astype(np.uint8)
    clahe_show = (img_clahe * 255).astype(np.uint8)

    return result_html, orig_show, clahe_show, METRICS


# ---------------------------------------------------------------------------
# Gradio Arayüzü
# ---------------------------------------------------------------------------
with gr.Blocks(
    title="Pnömoni Tespiti Demo",
    theme=gr.themes.Soft(primary_hue="blue"),
    css="""
        .title-box { text-align: center; padding: 16px 0 8px; }
        .title-box h1 { font-size: 2em; color: #065A82; }
        .title-box p  { color: #555; }
    """
) as demo:

    gr.HTML("""
    <div class="title-box">
        <h1>🫁 Göğüs Röntgeninden Pnömoni Tespiti</h1>
        <p>CNN Mimarilerinin ve Önişleme Tekniklerinin Karşılaştırmalı Analizi &nbsp;|&nbsp;
           Derin Öğrenme Projesi 2025–2026</p>
    </div>
    """)

    with gr.Tabs():

        # ---- Tab 1: Canlı Tahmin ----------------------------------------
        with gr.Tab("🔬 Canlı Tahmin"):
            gr.Markdown("### Bir göğüs röntgeni görüntüsü yükleyin")

            with gr.Row():
                with gr.Column(scale=1):
                    img_input = gr.Image(
                        label="X-Ray Görüntüsü",
                        type="numpy",
                        height=300,
                    )
                    model_choice = gr.Dropdown(
                        choices=list(MODELS.keys()),
                        value=list(MODELS.keys())[0],
                        label="Model Seçimi",
                    )
                    predict_btn = gr.Button(
                        "🔍 Tahmin Et",
                        variant="primary",
                        size="lg",
                    )

                with gr.Column(scale=1):
                    result_html = gr.HTML(label="Sonuç")

            gr.Markdown("### Önişleme Karşılaştırması")
            with gr.Row():
                orig_out  = gr.Image(label="Orijinal Görüntü",        height=250)
                clahe_out = gr.Image(label="CLAHE Uygulanmış Görüntü", height=250)

            predict_btn.click(
                fn=predict,
                inputs=[img_input, model_choice],
                outputs=[result_html, orig_out, clahe_out, gr.Dataframe(visible=False)],
            )

            gr.Markdown("""
            > **İpucu:** Test görüntüsü için
            > `data/chest_xray/chest_xray/test/PNEUMONIA/` veya
            > `data/chest_xray/chest_xray/test/NORMAL/` klasöründen bir `.jpeg` dosyası seçin.
            """)

        # ---- Tab 2: Proje Sonuçları -------------------------------------
        with gr.Tab("📊 Proje Sonuçları"):

            gr.Markdown("### 6 Deney Metrik Tablosu")
            gr.Dataframe(
                value=METRICS,
                label="Tüm Deneyler",
                wrap=True,
            )

            gr.Markdown("### Metrik Isı Haritası")
            heatmap_path = str(FIGURES_DIR / "metrics_heatmap.png")
            if os.path.exists(heatmap_path):
                gr.Image(value=heatmap_path, label="Metrik Karşılaştırması", height=350)

            with gr.Row():
                cm_path = str(FIGURES_DIR / "cm_vgg16_minimal.png")
                if os.path.exists(cm_path):
                    gr.Image(value=cm_path, label="Confusion Matrix — VGG16 Minimal", height=320)

                roc_path = str(FIGURES_DIR / "roc_vgg16_minimal.png")
                if os.path.exists(roc_path):
                    gr.Image(value=roc_path, label="ROC Eğrisi — VGG16 Minimal", height=320)

            gr.Markdown("### F1 & AUC Karşılaştırması")
            f1_path = str(FIGURES_DIR / "f1_auc_comparison.png")
            if os.path.exists(f1_path):
                gr.Image(value=f1_path, label="F1 ve AUC — Tüm Modeller", height=320)

            gr.Markdown("### CLAHE Etkisi")
            clahe_path = str(FIGURES_DIR / "clahe_effect.png")
            if os.path.exists(clahe_path):
                gr.Image(value=clahe_path, label="CLAHE ΔF1 Etkisi", height=300)

        # ---- Tab 3: Hakkında -------------------------------------------
        with gr.Tab("ℹ️ Hakkında"):
            gr.Markdown("""
            ## Proje Özeti

            **Veri Seti:** Kaggle Chest X-Ray Images (Kermany 2018) — 5.856 pediatrik görüntü

            **Modeller:**
            | Model | Tür | AUC |
            |---|---|---|
            | VGG16 + Minimal | Transfer Learning | **0.9756** ⭐ |
            | ResNet50 + Minimal | Transfer Learning | 0.9453 |
            | Custom CNN + Minimal | Sıfırdan | 0.9177 |

            **Ana Bulgu:** VGG16 transfer learning, başlangıç seviyesi ekip için
            AUC 0.9756 ile Kermany 2018 baseline (0.968)'e yakın sonuç verdi.

            **CLAHE Bulgusu:** 3 modelden 2'sinde F1 düşürdü → medikal kalite
            görüntülerde ekstra kontrast artırma fayda sağlamadı.

            ## Referanslar
            - Kermany et al. 2018, *Cell*, DOI: 10.1016/j.cell.2018.02.010
            - Stephen et al. 2019, *J. Healthcare Eng.*, DOI: 10.1155/2019/4180949
            - Rajpurkar et al. 2017, CheXNet, arXiv:1711.05225
            - Gamara et al. 2022, *IEEE HNICEM*, DOI: 10.1109/HNICEM57413.2022.10109585

            ## GitHub
            [github.com/gunbaz/pneumonia-detection-cnn](https://github.com/gunbaz/pneumonia-detection-cnn)
            """)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("Demo başlatılıyor...")
    print("Tarayıcıda aç: http://localhost:7860")
    print("="*50 + "\n")
    demo.launch(
        server_name="localhost",
        server_port=7860,
        share=False,
        inbrowser=True,
    )
