const pptxgen = require("C:/Users/pc/AppData/Roaming/npm/node_modules/pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Göğüs Röntgeninden Pnömoni Tespiti";
pres.author = "Derin Öğrenme Dersi";

// Color palette
const C = {
  darkBg: "065A82",
  primary: "065A82",
  secondary: "1C7293",
  white: "FFFFFF",
  lightBg: "F4F8FB",
  subtitle: "CADCFC",
  lightBlue: "E8F4F8",
  teal: "1C7293",
  gray: "888888",
  darkText: "1A2B3C",
  green: "E8F5E9",
  orange: "E65100",
  amber: "FF8F00",
};

// Slide dimensions: 10" x 5.625"
const W = 10;
const H = 5.625;

// Helper: add slide number
function addSlideNum(slide, num) {
  slide.addText(String(num), {
    x: W - 0.5,
    y: H - 0.35,
    w: 0.35,
    h: 0.25,
    fontSize: 9,
    color: C.gray,
    align: "right",
    fontFace: "Calibri",
  });
}

// ─────────────────────────────────────────────
// SLIDE 1 — Title
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Title
  slide.addText("Göğüs Röntgeninden Pnömoni Tespiti", {
    x: 0.5,
    y: 0.9,
    w: 9,
    h: 1.2,
    fontSize: 40,
    bold: true,
    color: C.white,
    align: "center",
    fontFace: "Calibri",
    valign: "middle",
  });

  // Teal horizontal line between title and subtitle
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 2.0,
    y: 2.25,
    w: 6.0,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // Subtitle
  slide.addText(
    "CNN Mimarilerinin ve Önişleme Tekniklerinin Karşılaştırmalı Analizi",
    {
      x: 0.5,
      y: 2.35,
      w: 9,
      h: 1.0,
      fontSize: 22,
      color: C.subtitle,
      align: "center",
      fontFace: "Calibri Light",
      valign: "middle",
    }
  );

  // Bottom text
  slide.addText("Derin Öğrenme Dersi Projesi  |  2025–2026", {
    x: 0.5,
    y: 4.8,
    w: 9,
    h: 0.45,
    fontSize: 14,
    color: C.white,
    align: "center",
    fontFace: "Calibri",
    valign: "middle",
  });

  addSlideNum(slide, 1);
}

// ─────────────────────────────────────────────
// SLIDE 2 — Problem Önemi
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  // Title
  slide.addText("Neden Bu Problem Önemli?", {
    x: 0.4,
    y: 0.15,
    w: 9.2,
    h: 0.6,
    fontSize: 36,
    bold: true,
    color: C.primary,
    fontFace: "Calibri",
    valign: "middle",
  });

  // Title underline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 0.78,
    w: 9.2,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // ── Left column: stat cards ──
  const cards = [
    { big: "700.000+", small: "çocuk ölümü / yıl (UN IGME 2024)" },
    { big: "2.000", small: "günlük çocuk ölümü" },
    { big: "2/3", small: "dünya görüntülemeye erişemiyor (WHO)" },
  ];

  cards.forEach((card, i) => {
    const cy = 1.0 + i * 1.35;
    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3,
      y: cy,
      w: 3.8,
      h: 1.15,
      fill: { color: "FFFFFF" },
      line: { color: "D0E4EF", width: 1 },
      shadow: {
        type: "outer",
        color: "000000",
        blur: 4,
        offset: 1,
        angle: 135,
        opacity: 0.1,
      },
    });
    // Left accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3,
      y: cy,
      w: 0.06,
      h: 1.15,
      fill: { color: C.secondary },
      line: { color: C.secondary, width: 0 },
    });
    // Big number
    slide.addText(card.big, {
      x: 0.45,
      y: cy + 0.06,
      w: 3.55,
      h: 0.55,
      fontSize: 30,
      bold: true,
      color: C.secondary,
      fontFace: "Calibri",
      valign: "middle",
      margin: 0,
    });
    // Small text
    slide.addText(card.small, {
      x: 0.45,
      y: cy + 0.62,
      w: 3.55,
      h: 0.42,
      fontSize: 11,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
      margin: 0,
    });
  });

  // ── Right column: bullets ──
  slide.addText(
    [
      {
        text: "Pnömoni, 5 yaş altı çocuklarda en ölümcül bulaşıcı hastalık",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Yapay zeka teşhisi: erişimi olmayan bölgelerde hayat kurtarabilir",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Kermany et al. 2018 (Cell): AUC 0.968 ile Inception-V3",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "CheXNet 2017: DenseNet-121 radyolog seviyesine ulaştı (F1=0.435)",
        options: { bullet: true },
      },
    ],
    {
      x: 4.4,
      y: 0.95,
      w: 5.3,
      h: 4.2,
      fontSize: 15,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  addSlideNum(slide, 2);
}

// ─────────────────────────────────────────────
// SLIDE 3 — Veri Seti
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addText("Veri Seti: Kaggle Chest X-Ray (Kermany 2018)", {
    x: 0.4,
    y: 0.15,
    w: 9.2,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: C.primary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 0.78,
    w: 9.2,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // Left: stat cards
  const statCards = [
    { big: "5.856", small: "toplam görüntü" },
    { big: "5.216", small: "train / 624 test" },
    { big: "522", small: "yeni doğrulama seti (stratified %10)" },
  ];

  statCards.forEach((card, i) => {
    const cy = 1.0 + i * 1.35;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3,
      y: cy,
      w: 3.8,
      h: 1.15,
      fill: { color: "FFFFFF" },
      line: { color: "D0E4EF", width: 1 },
      shadow: {
        type: "outer",
        color: "000000",
        blur: 4,
        offset: 1,
        angle: 135,
        opacity: 0.1,
      },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3,
      y: cy,
      w: 0.06,
      h: 1.15,
      fill: { color: C.secondary },
      line: { color: C.secondary, width: 0 },
    });
    slide.addText(card.big, {
      x: 0.45,
      y: cy + 0.06,
      w: 3.55,
      h: 0.55,
      fontSize: 30,
      bold: true,
      color: C.secondary,
      fontFace: "Calibri",
      valign: "middle",
      margin: 0,
    });
    slide.addText(card.small, {
      x: 0.45,
      y: cy + 0.62,
      w: 3.55,
      h: 0.42,
      fontSize: 11,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
      margin: 0,
    });
  });

  // Right: bullets
  slide.addText(
    [
      {
        text: "Pediatrik hastalar, 1–5 yaş, Guangzhou, Çin",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 6 },
      },
      {
        text: "Normal: 1.341 | Pneumonia: 3.875 (train)",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 6 },
      },
      {
        text: "Orijinal 16 görüntülük val istatistiksel yetersiz → yeniden bölündü",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 6 },
      },
      {
        text: "Sınıf dengesizliği %74 Pneumonia → F1 ve AUC zorunlu",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 6 },
      },
      {
        text: "Görüntüler 500–2538px → 224×224 resize",
        options: { bullet: true },
      },
    ],
    {
      x: 4.4,
      y: 0.95,
      w: 5.3,
      h: 4.2,
      fontSize: 15,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  addSlideNum(slide, 3);
}

// ─────────────────────────────────────────────
// SLIDE 4 — Yöntem
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addText(
    "Deneysel Tasarım: 3 Model × 2 Önişleme = 6 Deney",
    {
      x: 0.4,
      y: 0.12,
      w: 9.2,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: C.primary,
      fontFace: "Calibri",
      valign: "middle",
    }
  );

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 0.74,
    w: 9.2,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // Top row: 3 model cards (teal background)
  const modelCards = [
    {
      title: "Custom CNN",
      line2: "4 Conv2D blok, ~13M param",
      line3: "Sıfırdan eğitim (Stephen 2019)",
    },
    {
      title: "VGG16",
      line2: "ImageNet ön-eğitimli",
      line3: "10 epoch frozen + 5 epoch fine-tune",
    },
    {
      title: "ResNet50",
      line2: "ImageNet ön-eğitimli",
      line3: "Residual connections",
    },
  ];

  modelCards.forEach((card, i) => {
    const cx = 0.3 + i * 3.15;
    const cy = 0.88;
    const cw = 3.0;
    const ch = 1.5;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: cw,
      h: ch,
      fill: { color: C.secondary },
      line: { color: C.secondary, width: 0 },
    });

    // Title bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: cw,
      h: 0.45,
      fill: { color: C.primary },
      line: { color: C.primary, width: 0 },
    });

    slide.addText(card.title, {
      x: cx,
      y: cy,
      w: cw,
      h: 0.45,
      fontSize: 16,
      bold: true,
      color: C.white,
      fontFace: "Calibri",
      align: "center",
      valign: "middle",
      margin: 0,
    });

    slide.addText(
      [
        { text: card.line2, options: { breakLine: true } },
        { text: card.line3 },
      ],
      {
        x: cx + 0.1,
        y: cy + 0.5,
        w: cw - 0.2,
        h: ch - 0.55,
        fontSize: 12,
        color: C.white,
        fontFace: "Calibri Light",
        align: "center",
        valign: "top",
      }
    );
  });

  // Bottom row: 3 preprocessing/settings cards (light blue)
  const prepCards = [
    {
      title: "Önişleme A — Minimal",
      line2: "Resize 224×224, normalizasyon",
      line3: "Flip + Rotation + Zoom",
    },
    {
      title: "Önişleme B — CLAHE",
      line2: "LAB uzayında lokal kontrast",
      line3: "clipLimit=2.0, tileGrid=(8,8)",
    },
    {
      title: "Ayarlar",
      line2: "Adam optimizer, EarlyStopping(patience=3)",
      line3: "ReduceLROnPlateau",
    },
  ];

  prepCards.forEach((card, i) => {
    const cx = 0.3 + i * 3.15;
    const cy = 2.55;
    const cw = 3.0;
    const ch = 2.75;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: cw,
      h: ch,
      fill: { color: C.lightBlue },
      line: { color: "B8D8E8", width: 1 },
    });

    // Title bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx,
      y: cy,
      w: cw,
      h: 0.5,
      fill: { color: "D0E8F0" },
      line: { color: "D0E8F0", width: 0 },
    });

    slide.addText(card.title, {
      x: cx,
      y: cy,
      w: cw,
      h: 0.5,
      fontSize: 13,
      bold: true,
      color: C.primary,
      fontFace: "Calibri",
      align: "center",
      valign: "middle",
      margin: 0,
    });

    slide.addText(
      [
        { text: card.line2, options: { breakLine: true } },
        { text: card.line3 },
      ],
      {
        x: cx + 0.1,
        y: cy + 0.58,
        w: cw - 0.2,
        h: ch - 0.65,
        fontSize: 12,
        color: C.darkText,
        fontFace: "Calibri Light",
        align: "center",
        valign: "top",
      }
    );
  });

  addSlideNum(slide, 4);
}

// ─────────────────────────────────────────────
// SLIDE 5 — CLAHE
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addText("CLAHE Önişleme: Motivasyon ve Bulgular", {
    x: 0.4,
    y: 0.15,
    w: 9.2,
    h: 0.6,
    fontSize: 34,
    bold: true,
    color: C.primary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 0.78,
    w: 9.2,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // Left column: motivation
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3,
    y: 0.92,
    w: 4.5,
    h: 4.35,
    fill: { color: "FFFFFF" },
    line: { color: "D0E4EF", width: 1 },
  });

  slide.addText("Teorik Gerekçe", {
    x: 0.4,
    y: 1.0,
    w: 4.3,
    h: 0.38,
    fontSize: 16,
    bold: true,
    color: C.secondary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addText(
    [
      {
        text: "CLAHE: görüntüyü bloklara bölerek lokal kontrast artırır",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "X-ray'lerin düşük kontrastı için literatürde önerilir",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Gamara et al. 2022 (IEEE): %50 → %78 doğruluk artışı",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Piksel histogramı daha geniş ve dengeli dağılım",
        options: { bullet: true },
      },
    ],
    {
      x: 0.4,
      y: 1.45,
      w: 4.2,
      h: 3.6,
      fontSize: 14,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  // Right column: result
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.1,
    y: 0.92,
    w: 4.6,
    h: 4.35,
    fill: { color: "FFFFFF" },
    line: { color: "D0E4EF", width: 1 },
  });

  slide.addText("Bu Çalışmadaki Bulgu", {
    x: 5.2,
    y: 1.0,
    w: 4.4,
    h: 0.38,
    fontSize: 16,
    bold: true,
    color: C.secondary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addText(
    [
      {
        text: "CLAHE 3 modelden 2'sinde F1 düşürdü",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "ΔF1: Custom CNN −0.031, VGG16 −0.009, ResNet50 +0.001",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Negatif sonuç da bilimsel değer taşır",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Medikal kalite X-ray'lerde ekstra kontrast gürültü ekleyebilir",
        options: { bullet: true },
      },
    ],
    {
      x: 5.2,
      y: 1.45,
      w: 4.4,
      h: 3.6,
      fontSize: 14,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  addSlideNum(slide, 5);
}

// ─────────────────────────────────────────────
// SLIDE 6 — Sonuçlar (Results Table)
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addText("6 Deney Test Sonuçları", {
    x: 0.4,
    y: 0.1,
    w: 9.2,
    h: 0.52,
    fontSize: 34,
    bold: true,
    color: C.primary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 0.64,
    w: 9.2,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // Table data
  const hdr = { color: C.white, bold: true, fill: { color: C.primary } };
  const mkH = (t) => ({ text: t, options: hdr });
  const mkC = (t, fill) => ({
    text: t,
    options: fill
      ? { fill: { color: fill }, color: "1B5E20" }
      : { color: C.darkText },
  });
  const hl = "E8F5E9"; // highlight green

  const tableData = [
    [
      mkH("Model"),
      mkH("Önişleme"),
      mkH("Accuracy"),
      mkH("Precision"),
      mkH("Recall"),
      mkH("F1"),
      mkH("AUC"),
    ],
    [
      mkC("Custom CNN"),
      mkC("Minimal"),
      mkC("0.8814"),
      mkC("0.8641"),
      mkC("0.9615"),
      mkC("0.9102"),
      mkC("0.9177"),
    ],
    [
      mkC("Custom CNN"),
      mkC("CLAHE"),
      mkC("0.8317"),
      mkC("0.7950"),
      mkC("0.9846"),
      mkC("0.8797"),
      mkC("0.9202"),
    ],
    [
      mkC("VGG16", hl),
      mkC("Minimal", hl),
      mkC("0.9119", hl),
      mkC("0.8923", hl),
      mkC("0.9769", hl),
      mkC("0.9327", hl),
      mkC("0.9756", hl),
    ],
    [
      mkC("VGG16"),
      mkC("CLAHE"),
      mkC("0.9006"),
      mkC("0.8850"),
      mkC("0.9667"),
      mkC("0.9240"),
      mkC("0.9647"),
    ],
    [
      mkC("ResNet50"),
      mkC("Minimal"),
      mkC("0.8750"),
      mkC("0.8594"),
      mkC("0.9564"),
      mkC("0.9053"),
      mkC("0.9453"),
    ],
    [
      mkC("ResNet50"),
      mkC("CLAHE"),
      mkC("0.8766"),
      mkC("0.8598"),
      mkC("0.9590"),
      mkC("0.9067"),
      mkC("0.9468"),
    ],
  ];

  slide.addTable(tableData, {
    x: 0.3,
    y: 0.72,
    w: 9.4,
    h: 3.35,
    colW: [1.55, 1.25, 1.15, 1.15, 1.15, 1.05, 1.1],
    border: { pt: 0.5, color: "B8D8E8" },
    fontSize: 12,
    fontFace: "Calibri",
    align: "center",
    valign: "middle",
    rowH: 0.42,
  });

  // Note below table
  slide.addText(
    "★ En iyi model: VGG16 + Minimal (AUC 0.9756 ≈ Kermany 2018 baseline 0.968)",
    {
      x: 0.3,
      y: 4.12,
      w: 9.4,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: C.primary,
      fontFace: "Calibri",
      valign: "middle",
    }
  );

  // Confusion matrix summary
  slide.addText(
    "VGG16 Minimal — TP: 381 | FN: 9 | TN: 188 | FP: 46  →  390 pnömoniden yalnızca 9 kaçırıldı",
    {
      x: 0.3,
      y: 4.5,
      w: 9.4,
      h: 0.75,
      fontSize: 12,
      color: C.darkText,
      fontFace: "Calibri Light",
      fill: { color: "E8F4F8" },
      valign: "middle",
      align: "center",
    }
  );

  addSlideNum(slide, 6);
}

// ─────────────────────────────────────────────
// SLIDE 7 — Tartışma
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addText("Bulgular, Yorumlar ve Sınırlamalar", {
    x: 0.4,
    y: 0.15,
    w: 9.2,
    h: 0.6,
    fontSize: 34,
    bold: true,
    color: C.primary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 0.78,
    w: 9.2,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // Left column: Bulgular & Yorumlar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3,
    y: 0.92,
    w: 4.5,
    h: 4.35,
    fill: { color: "FFFFFF" },
    line: { color: "D0E4EF", width: 1 },
  });

  slide.addText("Bulgular & Yorumlar", {
    x: 0.4,
    y: 1.0,
    w: 4.3,
    h: 0.38,
    fontSize: 16,
    bold: true,
    color: C.secondary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addText(
    [
      {
        text: "VGG16 + Minimal en iyi: AUC 0.9756",
        options: { bullet: { character: "✓" }, breakLine: true, paraSpaceAfter: 8, color: "2E7D32" },
      },
      {
        text: "Transfer learning custom CNN'i tüm metriklerde geçti",
        options: { bullet: { character: "✓" }, breakLine: true, paraSpaceAfter: 8, color: "2E7D32" },
      },
      {
        text: "ImageNet özellikleri medikal görüntüye başarıyla transfer oldu",
        options: { bullet: { character: "✓" }, breakLine: true, paraSpaceAfter: 8, color: "2E7D32" },
      },
      {
        text: "Recall >%95: klinik açıdan doğru trade-off",
        options: { bullet: { character: "✓" }, breakLine: true, paraSpaceAfter: 8, color: "2E7D32" },
      },
      {
        text: "CLAHE bu veri setinde fayda sağlamadı",
        options: { bullet: { character: "✗" }, color: "C62828" },
      },
    ],
    {
      x: 0.4,
      y: 1.45,
      w: 4.2,
      h: 3.65,
      fontSize: 14,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  // Right column: Sınırlamalar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.1,
    y: 0.92,
    w: 4.6,
    h: 4.35,
    fill: { color: "FFFFFF" },
    line: { color: "FFD0B0", width: 1 },
  });

  slide.addText("Sınırlamalar", {
    x: 5.2,
    y: 1.0,
    w: 4.4,
    h: 0.38,
    fontSize: 16,
    bold: true,
    color: C.orange,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addText(
    [
      {
        text: "Yalnızca 1–5 yaş pediatrik veri",
        options: { bullet: { character: "⚠" }, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Yetişkin pnömonisine genelleşmez",
        options: { bullet: { character: "⚠" }, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "GPU yokluğu → sınırlı epoch",
        options: { bullet: { character: "⚠" }, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Binary sınıflandırma (bakt./viral ayrımı yok)",
        options: { bullet: { character: "⚠" }, breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: "Doğrulama seti orijinalde yalnızca 16 görüntü",
        options: { bullet: { character: "⚠" } },
      },
    ],
    {
      x: 5.2,
      y: 1.45,
      w: 4.4,
      h: 3.65,
      fontSize: 14,
      color: C.darkText,
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  addSlideNum(slide, 7);
}

// ─────────────────────────────────────────────
// SLIDE 8 — Gelecek Çalışmalar (dark background)
// ─────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addText("Gelecek Çalışmalar & Sonuç", {
    x: 0.4,
    y: 0.15,
    w: 9.2,
    h: 0.65,
    fontSize: 36,
    bold: true,
    color: C.white,
    fontFace: "Calibri",
    valign: "middle",
  });

  // Teal underline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4,
    y: 0.82,
    w: 9.2,
    h: 0.04,
    fill: { color: C.secondary },
    line: { color: C.secondary, width: 0 },
  });

  // Left column: Gelecek Çalışmalar header
  slide.addText("Gelecek Çalışmalar", {
    x: 0.4,
    y: 1.0,
    w: 4.4,
    h: 0.4,
    fontSize: 17,
    bold: true,
    color: C.secondary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addText(
    [
      {
        text: "DenseNet-121 (CheXNet mimarisi)",
        options: { bullet: { character: "→" }, breakLine: true, paraSpaceAfter: 10 },
      },
      {
        text: "3-sınıflı: Normal / Bakteriyel / Viral",
        options: { bullet: { character: "→" }, breakLine: true, paraSpaceAfter: 10 },
      },
      {
        text: "Grad-CAM ile açıklanabilir yapay zeka",
        options: { bullet: { character: "→" }, breakLine: true, paraSpaceAfter: 10 },
      },
      {
        text: "Ensemble: VGG16 + ResNet50",
        options: { bullet: { character: "→" }, breakLine: true, paraSpaceAfter: 10 },
      },
      {
        text: "Cloud GPU ile daha uzun fine-tune",
        options: { bullet: { character: "→" } },
      },
    ],
    {
      x: 0.4,
      y: 1.45,
      w: 4.4,
      h: 3.5,
      fontSize: 14,
      color: C.white,
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  // Right column: Sonuç box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.1,
    y: 1.0,
    w: 4.6,
    h: 4.3,
    fill: { color: "0E4F72" },
    line: { color: C.secondary, width: 1 },
  });

  slide.addText("Sonuç", {
    x: 5.2,
    y: 1.05,
    w: 4.4,
    h: 0.38,
    fontSize: 17,
    bold: true,
    color: C.secondary,
    fontFace: "Calibri",
    valign: "middle",
  });

  slide.addText(
    "VGG16 transfer learning, başlangıç seviyesi ekip için AUC 0.9756 ile güçlü bir baseline sunmaktadır.",
    {
      x: 5.2,
      y: 1.45,
      w: 4.35,
      h: 0.9,
      fontSize: 14,
      color: C.white,
      fontFace: "Calibri Light",
      valign: "top",
      italic: true,
    }
  );

  // References
  slide.addText("Referanslar", {
    x: 5.2,
    y: 2.45,
    w: 4.35,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: C.subtitle,
    fontFace: "Calibri",
  });

  slide.addText(
    [
      {
        text: "Kermany et al. 2018, Cell, DOI:10.1016/j.cell.2018.02.010",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 4 },
      },
      {
        text: "Stephen et al. 2019, J. Healthcare Eng., DOI:10.1155/2019/4180949",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 4 },
      },
      {
        text: "Rajpurkar et al. 2017, CheXNet, arXiv:1711.05225",
        options: { bullet: true, breakLine: true, paraSpaceAfter: 4 },
      },
      {
        text: "Gamara et al. 2022, IEEE HNICEM, DOI:10.1109/HNICEM57413.2022.10109585",
        options: { bullet: true },
      },
    ],
    {
      x: 5.2,
      y: 2.78,
      w: 4.35,
      h: 2.4,
      fontSize: 11,
      color: "B0C8D8",
      fontFace: "Calibri Light",
      valign: "top",
    }
  );

  addSlideNum(slide, 8);
}

// Save
pres
  .writeFile({
    fileName:
      "C:/Users/pc/DeepLearning/4.proje/presentation/pnomoni_tespiti_sunum.pptx",
  })
  .then(() => {
    console.log("✅ Saved successfully.");
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
