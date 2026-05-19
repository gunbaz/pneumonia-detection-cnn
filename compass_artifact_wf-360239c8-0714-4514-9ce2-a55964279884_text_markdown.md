# Başlangıç Seviyesi Derin Öğrenme Proje Önerisi: Göğüs Röntgeninden Pnömoni Tespiti (CNN Karşılaştırması + Önişleme Etkisi)

## TL;DR
- **Önerilen konu:** Kaggle "Chest X-Ray Images (Pneumonia)" veri seti üzerinde **iki sınıflı (Normal vs. Pneumonia) görüntü sınıflandırması**; basit bir custom CNN'i transfer learning tabanlı VGG16 ve ResNet50 ile karşılaştırın; ek olarak iki önişleme şeması (basit rescale+augmentation vs. CLAHE kontrast artırma) etkisini ölçün — başlangıç seviyesindeki 2 kişilik ekip için en uygun, en kolay kurulabilen, en iyi dokümante senaryo budur.
- **Veri ve modeller:** 5.856 pediatrik göğüs X-ray görüntüsü (Kermany / Paul Mooney, Kaggle); 3 mimari — (a) sıfırdan yazılmış küçük custom CNN (Stephen et al. 2019 baseline), (b) ImageNet ön-eğitimli VGG16, (c) ImageNet ön-eğitimli ResNet50; opsiyonel hibrit: CNN feature extractor + SVM/Lojistik Regresyon.
- **Metrikler ve teslim:** Accuracy, Precision, Recall, F1-Score, AUC-ROC ve confusion matrix (test setinin dengesiz olması nedeniyle accuracy tek başına yetmez); 5–7 dakikalık sunum için 8 slaytlık net bir akış aşağıda verilmiştir.

## Key Findings (neden bu konu en uygunu)
- **Veri erişimi sıfır sürtünme:** Kaggle'da tek tıkla indirilebilir, klasör yapısı (train/val/test) hazır gelir; Google Colab ücretsiz GPU'sunda dahi makul sürede eğitilir.
- **Mimari karmaşıklığı düşük:** Derste görülen CNN ve MLP bilgisi yeterli; transfer learning Keras/PyTorch'ta 5–10 satır kodla aktive edilir (`tf.keras.applications.VGG16(weights='imagenet', include_top=False)`).
- **Literatür zengin ve ölçütler net:** Kermany 2018 (Cell), Stephen 2019 (JHE), Rajpurkar 2017 (CheXNet, arXiv) gibi yüksek atıflı baseline'lar mevcut; öğrenciler kendi sonuçlarını bilinen sayılarla karşılaştırabilir — Kermany et al. Inception-V3 ile %92,80 accuracy ve **AUC 0,968** raporlamıştır.
- **Problem önemi güçlü ve veriyle desteklenir:** UN Inter-agency Group for Child Mortality Estimation (UN IGME 2024) ve UNICEF verilerine göre **pnömoni her yıl 5 yaş altı 700.000'den fazla çocuğun ölümüne neden olur (günde yaklaşık 2.000 ölüm)** ve bu, herhangi bir bulaşıcı hastalığın çocuk ölümlerindeki en yüksek payıdır. Ayrıca DSÖ (WHO) verilerine atıfla **dünya nüfusunun yaklaşık üçte ikisi tanısal görüntülemeye erişimden yoksundur** — bu, AI destekli teşhisin klinik anlamını sunumun "problem önemi" bölümünde güçlü kılar.
- **Önişleme karşılaştırması doğal olarak yapılır:** X-ray'lerin kontrastı düşük olduğundan CLAHE (Contrast Limited Adaptive Histogram Equalization) ile basit rescale arasındaki farkı ölçmek hem somut hem literatürde desteklenen bir karşılaştırmadır. **Gamara, Loresco & Bandala (IEEE HNICEM 2022, DOI: 10.1109/HNICEM57413.2022.10109585)** çalışması, CLAHE + Wiener filter kombinasyonunun göğüs X-ray sınıflandırmasında doğrulama doğruluğunu **%50'den %78'e çıkardığını** raporlamıştır.
- **Hibrit yöntem dahil edilebilir:** "CNN ile özellik çıkarımı + klasik ML sınıflandırıcı (SVM/Lojistik Regresyon)" beginner-friendly bir hibrit deney sunar; literatürde aynı veri için Xception+LR yaklaşımı doğrulanmıştır (PMC11612971).

## Details

### 1. Önerilen Konu (tek konu, en kolay)
**"Göğüs Röntgeni Görüntülerinden Pnömoni Tespiti: Önişleme Tekniklerinin ve CNN Mimarilerinin Karşılaştırmalı Analizi"**

İki katmanlı bir deneysel tasarım:
- **Eksen 1 (Önişleme):** (A) Sadece resize + normalizasyon + basit augmentation (flip, rotation, zoom) vs. (B) CLAHE kontrast artırma + aynı augmentation. Aynı modeli iki önişleme ile çalıştırıp metrikleri karşılaştırın.
- **Eksen 2 (Model):** En az 3 model — (i) sıfırdan küçük custom CNN (4–5 conv block), (ii) VGG16 (transfer learning, son katmanlar fine-tune), (iii) ResNet50 (transfer learning). Opsiyonel 4. model: VGG16 + SVM hibrit.

Bu, ders kriterlerinde istenen "farklı önişleme × farklı model × farklı metrik" üçlüsünü organik biçimde karşılar.

### 2. Veri Seti
**Kaggle: Chest X-Ray Images (Pneumonia)** — Paul Mooney tarafından yayınlanan, Kermany et al. (2018) çalışmasının kaynak verisi.
- URL: `https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia`
- Toplam: 5.856 JPEG görüntü (1–5 yaş arası pediatrik hastalar, Guangzhou Women and Children's Medical Center, Çin)
- Resmi bölünme: **5.216 eğitim / 16 doğrulama / 624 test**
- Sınıflar: NORMAL (1.583), PNEUMONIA (4.273 — bakteriyel + viral karışık); başlangıç için ikili sınıflandırma yeterli
- **Önemli uyarı:** Resmi doğrulama seti yalnızca 16 görüntü içerir; bu istatistiksel olarak yetersizdir. Öğrenciler eğitim setinden stratified bir doğrulama seti oluşturmalı (örn. %10) ya da k-fold cross-validation kullanmalıdır. Test seti hafifçe dengesizdir (62% pneumonia, 38% normal); bu durum, accuracy yerine F1/AUC kullanmayı zorunlu kılan iyi bir öğretim noktasıdır.

### 3. Karşılaştırılacak Modeller (3 zorunlu + 1 opsiyonel)

| # | Model | Açıklama | Niye seçildi |
|---|---|---|---|
| 1 | **Baseline Custom CNN** | 4 Conv2D + MaxPool + Dropout + Dense; ~500K parametre | Sıfırdan CNN, Stephen et al. 2019 baseline'a (~%93,73 val acc) doğrudan kıyas |
| 2 | **VGG16 (Transfer Learning)** | ImageNet ön-eğitimli; conv katmanları dondur, classifier head fine-tune | Beginner-friendly, Keras `applications` modülünde hazır; literatürde en yaygın baseline |
| 3 | **ResNet50 (Transfer Learning)** | ImageNet ön-eğitimli; residual connections sayesinde derin ama eğitimi stabil | VGG16 ile derinlik/skip-connection karşılaştırması doğal hipotez sağlar |
| 4 (opsiyonel) | **Hibrit CNN + SVM** | VGG16'nın conv block'larından çıkarılan feature vektörü üzerinde SVM/Lojistik Regresyon | "Hibrit yöntem" kriterini doğrudan karşılar; az kodla yapılır |

**Eğitim ayarları:** Adam optimizer (lr = 1e-4 transfer learning için, 1e-3 custom CNN için), batch size 16–32, 10–20 epoch, input 224×224×3, EarlyStopping (patience=3).

### 4. Karşılaştırılacak Önişleme Teknikleri
- **A — Minimal:** Resize 224×224, piksel /255 normalizasyon, hafif augmentation (horizontal flip, ±15° rotation, 0.2 zoom)
- **B — Kontrast artırma:** Yukarıdakine ek olarak **CLAHE** (`clipLimit=2.0`, `tileGridSize=(8,8)`) — OpenCV'de `cv2.createCLAHE` ile tek satır
- **(Opsiyonel C):** CLAHE + Gaussian blur denoising kombinasyonu — literatürde X-ray için en iyi augmentation tekniklerinden biri olarak raporlanmıştır (Springer SIViP 2024)

Her model her önişleme ile eğitilir → 3 model × 2 önişleme = **6 deney**, 2 kişilik ekip için yönetilebilir.

### 5. Kullanılacak Metrikler
Test setinin dengesizliği (62/38) accuracy'yi yanıltıcı kılar; bu nedenle çoklu metrik zorunludur:
- **Accuracy** — genel doğruluk (referans)
- **Precision** — false positive minimize etmek için (yanlış pneumonia tanısı önemli)
- **Recall (Sensitivity)** — false negative minimize etmek için (kaçırılan pneumonia hayati)
- **F1-Score** — precision-recall harmonik ortalaması; dengesiz setlerde standart
- **AUC-ROC** — threshold-bağımsız ayırt edicilik (Kermany baseline'ı: 0,968)
- **Confusion Matrix** — sınıflar arası karışıklığı sunum slaytında görsel olarak etkili
- **Training/Validation Loss eğrileri** — overfitting kontrolü, sunum görseli olarak güçlü

### 6. Akademik Referanslar (3 temel, tümü doğrulanmış)

1. **Kermany, D. S., Goldbaum, M., Cai, W., et al. (2018).** "Identifying Medical Diagnoses and Treatable Diseases by Image-Based Deep Learning." *Cell*, **172**(5), 1122–1131.e9. **DOI: 10.1016/j.cell.2018.02.010** (PMID: 29474911). — Bu projede kullanılan veri setinin orijinal kaynağı; ImageNet'te ön-eğitimli Inception-V3'ün transfer learning ile fine-tune edilerek Normal vs. Pneumonia'da **%92,80 accuracy ve AUC 0,968**, bakteriyel vs. viral pnömoni ayrımında **%90,70 accuracy** raporlanmıştır. "Problem önemi" ve baseline performans için zorunlu referans.

2. **Stephen, O., Sain, M., Maduh, U. J., & Jeong, D.-U. (2019).** "An Efficient Deep Learning Approach to Pneumonia Classification in Healthcare." *Journal of Healthcare Engineering*, Vol. 2019, Article ID 4180949, 7 sayfa. **DOI: 10.1155/2019/4180949** (PMCID: PMC6458916). — **Sıfırdan eğitilmiş** (transfer learning kullanmayan) custom CNN ile yaklaşık **%93,73 doğrulama doğruluğu** raporlar; öğrencilerin custom CNN modeli için doğrudan baseline'dır.

3. **Rajpurkar, P., Irvin, J., Zhu, K., et al. (2017).** "CheXNet: Radiologist-Level Pneumonia Detection on Chest X-Rays with Deep Learning." *arXiv preprint* **arXiv:1711.05225**. — 121 katmanlı DenseNet'in (DenseNet-121) ChestX-ray14 veri setinde **F1 = 0,435** ile radyolog ortalamasını (F1 = 0,387) geçtiğini gösteren landmark çalışma; "gelecek çalışmalar" bölümünde DenseNet'e geçişi motive eder.

**Opsiyonel 4. referans** (hibrit yöntem ve önişleme için): **Gamara, R. P. C., Loresco, P. J. M., & Bandala, A. A. (2022).** "Medical Chest X-Ray Image Enhancement Based on CLAHE and Wiener Filter for Deep Learning Data Preprocessing." *2022 IEEE 14th International Conference on HNICEM*. **DOI: 10.1109/HNICEM57413.2022.10109585**.

### 7. Sunum Yapısı (5–7 dakika, 8 slayt)

| Slayt | İçerik | Süre |
|---|---|---|
| 1 | **Başlık** — proje adı, isimler, ders kodu | 15 sn |
| 2 | **Problem önemi & literatür özeti** — UNICEF/UN IGME 2024: 700.000+ çocuk ölümü/yıl; WHO: dünya nüfusunun ~2/3'ü görüntülemeye erişimsiz; Kermany 2018 ve CheXNet 2017'ye 1–2 cümle atıf | 60 sn |
| 3 | **Veri seti** — Kaggle Chest X-Ray, 5.856 görüntü, sınıf dağılımı, örnek Normal vs. Pneumonia görüntüleri | 45 sn |
| 4 | **Model seçim gerekçesi & teorik açıklama** — Custom CNN vs. Transfer Learning (VGG16, ResNet50); ImageNet özelliklerinin medikal görüntüye transfer mantığı; basit mimari diyagramları | 90 sn |
| 5 | **Önişleme karşılaştırması** — Minimal vs. CLAHE; öncesi/sonrası görsel; CLAHE'nin teorik motivasyonu (lokal kontrast artırımı); Gamara 2022'ye kısa atıf | 60 sn |
| 6 | **Nesnel sonuçlar** — 6 deneylik tablo (Accuracy / Precision / Recall / F1 / AUC), confusion matrix, en iyi modelin ROC eğrisi | 90 sn |
| 7 | **Yorum** — Hangi model en iyi ve neden? CLAHE faydası anlamlı mı? Overfitting var mı? Sınırlamalar (16 görüntülük resmi val seti, pediatrik veri yetişkinde genelleşmez) | 60 sn |
| 8 | **Gelecek çalışmalar & Q&A açılışı** — DenseNet121/EfficientNet'e geçiş, 3-sınıflı (bakteriyel/viral/normal), Grad-CAM ile açıklanabilirlik, ensemble yöntemler | 30 sn |

**Q&A için hazırlık (2–3 dk):** Olası sorular — "Neden ResNet50 değil DenseNet?", "Class imbalance'ı nasıl ele aldınız?", "Resmi 16 görüntülük val seti sorun yarattı mı?", "CLAHE parametrelerini nasıl seçtiniz?", "Sonuçlarınız Kermany'nin %92,80'inin altında/üstünde mi, neden?"

## Recommendations

### Aşamalı yol haritası (önerilen sıra)
1. **1. Hafta:** Veriyi indir, klasör yapısını doğrula, eğitim setinden %10 stratified validation ayır. Veri yükleme pipeline'ı kur (`ImageDataGenerator` veya `tf.data`).
2. **2. Hafta:** Baseline custom CNN'i minimal önişleme ile eğit; ilk metrikleri al. Bu, "sıfır noktası"dır.
3. **3. Hafta:** VGG16 ve ResNet50 transfer learning'i ekle (yine minimal önişleme). 3 model × 1 önişleme = 3 deney.
4. **4. Hafta:** CLAHE önişleme ekle, 3 modeli yeniden eğit. 6 deney tamamlanır.
5. **5. Hafta:** (Opsiyonel) Hibrit CNN+SVM dene. Sonuçları sunum tablosuna dökünüz; confusion matrix, ROC eğrisi ve eğitim/doğrulama kayıp grafiklerini çıkarın.
6. **6. Hafta:** Slaytları hazırla, 2 kez prova et (zaman 5–7 dk içinde tutmalı), Q&A için 5 olası soruya cevap hazırlayın.

### Karar eşikleri (planı değiştirmek gerekirse)
- **Eğer GPU erişimi yetersizse** (Colab free tier yetmiyorsa) → ResNet50'yi çıkar, sadece custom CNN + VGG16 ile devam et; veya görüntü boyutunu 224→128'e düşür.
- **Eğer transfer learning custom CNN'i ezici biçimde geçerse** (>%5 fark) → hipotezi "Önişlemenin etkisi mimariden bağımsız mı?" şeklinde derinleştirin; ablation tablosunu ön plana çıkarın.
- **Eğer 6 deney zaman almazsa** → DenseNet121 ekleyerek CheXNet'e bir köprü kurun; aksi takdirde gelecek çalışmalar slaytında bunu öner olarak listelemek yeterlidir.
- **Eğer CLAHE bir veya iki modelde metrikleri düşürürse** → bunu "negatif sonuç" olarak yorumlayın; X-ray augmentation literatüründe Gaussian blur'un CLAHE'den daha iyi olabildiği raporlanmıştır (Springer SIViP 2024).

### İkincil seçenek (eğer X-ray çalışmazsa)
**Brain Tumor MRI Dataset (Masoud Nickparvar, Kaggle)** ile aynı metodoloji uygulanabilir — 7.023 görüntü, 4 sınıf (glioma, meningioma, pituitary, no tumor). Ancak 4 sınıf + daha karmaşık eğitim nedeniyle 2 kişi için biraz daha ağırdır; **birincil öneri pnömoni** kalmaktadır.

## Caveats
- **Resmi doğrulama seti büyüklüğü:** Kaggle'ın 16 görüntülük validation seti istatistiksel olarak yetersizdir; mutlaka yeniden bölünmeli (stratified). Bu durumu sunumda açıkça belirtmek "sınırlamalar" puanı kazandırır.
- **Veri sızıntısı riski:** Stephen et al. 2019'da olduğu gibi train/test'i yeniden karıştırmak sonuçları yapay olarak iyileştirebilir. Resmi test setine dokunmayın; sadece eğitim setini bölün.
- **Pediatrik veri genelleşme sınırı:** Bu veri 1–5 yaş çocuklardandır; yetişkin pnömonisi için doğrudan kullanılmaz. Sunumda etik/genelleşme uyarısı yapın.
- **Yayınlanan çok yüksek doğruluk değerleri (%98+) genellikle veri sızıntısı, yeniden bölme veya doğrulama protokolündeki zayıflıklara dayanır.** Beginner sonuçlarınız %88–95 aralığında olacaktır ve bu tamamen kabul edilebilirdir; doğru rapor edilmiş %91 bir F1, şüpheli bir %99'dan akademik olarak daha değerlidir.
- **CLAHE her zaman iyi sonuç vermez:** Bazı çalışmalar marjinal/negatif fark raporlar; "negatif" sonuç da bilimsel olarak değerlidir, paniklenmeyin — yorum slaytında doğrudan ele alın.
- **Q&A zamanı sınırlıdır:** 2–3 dakikada en fazla 2–3 derin soru gelir; teknik detayları (Adam hiperparametreleri, BatchNorm momentumu vs.) ezberlemek yerine "neden bu modeli/önişlemeyi seçtik" mantığını savunmaya odaklanın.