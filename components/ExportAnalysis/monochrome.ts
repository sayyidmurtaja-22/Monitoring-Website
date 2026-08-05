export const EXPORT_MONOCHROME_CSS = `
/* ── Kartu grafik & ringkasan: latar putih, teks hitam ── */
[data-export-area] .bg-\\[\\#A8DADC\\] { background-color: #ffffff !important; }
[data-export-area] .dark\\:bg-\\[\\#1D3557\\] { background-color: #ffffff !important; }
[data-export-area] .bg-\\[\\#1d3557\\] { background-color: #ffffff !important; }
[data-export-area] .hover\\:bg-\\[\\#a8dadc\\] { background-color: #ffffff !important; }
[data-export-area] .text-\\[\\#1D3557\\] { color: #000000 !important; }
[data-export-area] .dark\\:text-\\[\\#F1FAEE\\] { color: #000000 !important; }
[data-export-area] .text-\\[\\#a8dadc\\] { color: #000000 !important; }
[data-export-area] .text-white { color: #000000 !important; }
[data-export-area] .text-white\\/70 { color: #000000 !important; }
[data-export-area] .text-white\\/60 { color: #000000 !important; }
[data-export-area] .text-\\[\\#E63946\\] { color: #000000 !important; }
[data-export-area] .text-emerald-400 { color: #000000 !important; }
[data-export-area] .bg-white\\/10 { background-color: #e2e8f0 !important; }
[data-export-area] .border { border-color: #94a3b8 !important; }
[data-export-area] .dark\\:border-\\[\\#457B9D\\] { border-color: #94a3b8 !important; }
[data-export-area] .border-\\[\\#1a3a6e\\]\\/40 { border-color: #94a3b8 !important; }

/* ── Badge status: netral abu-abu dengan teks hitam ── */
[data-export-area] .bg-\\[\\#E63946\\] { background-color: #e2e8f0 !important; }
[data-export-area] .bg-blue-900 { background-color: #e2e8f0 !important; }
[data-export-area] .bg-blue-700 { background-color: #e2e8f0 !important; }
[data-export-area] .bg-emerald-600 { background-color: #e2e8f0 !important; }
[data-export-area] .text-blue-100 { color: #000000 !important; }

/* ── Garis & isi grafik (recharts): garis hitam, isi putih ── */
[data-export-area] .recharts-line-curve { stroke: #000000 !important; }
[data-export-area] .recharts-line-dot { fill: #ffffff !important; stroke: #000000 !important; }
[data-export-area] .recharts-area-curve { stroke: #000000 !important; }
[data-export-area] .recharts-area-area { fill: #ffffff !important; }
[data-export-area] .recharts-bar-rectangle { fill: #ffffff !important; stroke: #000000 !important; }

/* ── Sumbu, label, legenda: hitam ── */
[data-export-area] .recharts-text { fill: #000000 !important; color: #000000 !important; }
[data-export-area] .recharts-cartesian-axis-tick-value { fill: #000000 !important; }
[data-export-area] .recharts-cartesian-axis-line { stroke: #000000 !important; }
[data-export-area] .recharts-cartesian-axis-tick line { stroke: #000000 !important; }
[data-export-area] .recharts-legend-item-text { fill: #000000 !important; color: #000000 !important; }
[data-export-area] .recharts-cartesian-grid line { stroke: #cbd5e1 !important; }

/* ── Tabel indikator: latar putih, garis & teks hitam ── */
[data-export-area] table { border-collapse: collapse !important; }
[data-export-area] th, [data-export-area] td { border: 1px solid #94a3b8 !important; color: #000000 !important; }
[data-export-area] th { background-color: #f1f5f9 !important; }

/* ── Jarak header → tabel indikator: rapat (0) ── */
[data-export-area] { gap: 0 !important; }
[data-export-area] [data-export-header] > div { margin-bottom: 0 !important; padding-bottom: 2px !important; }
[data-export-area] [data-export-table] { margin-top: 0 !important; }

/* ── Sub-bab tiap seksi grafik ── */
[data-export-area] [data-export-subtitle] { margin-top: 20px !important; }

/* ── Legenda grafik di PDF: font lebih besar ── */
[data-export-area] .recharts-legend-item-text { font-size: 17px !important; }

/* ── Hapus pembungkus kotak grafik: hanya grafik + sumbu, rata kiri ── */
[data-export-area] .rounded-3xl {
  background-color: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
}
[data-export-area] h3 { display: none !important; }
[data-export-area] [data-chart-section] > div:first-child > div:first-child { display: none !important; }
[data-export-area] [data-chart-section] > div:first-child { margin: 0 !important; }
[data-export-area] [data-chart-section] .recharts-responsive-container { margin: 0 !important; }

/* ── Grafik di PDF: penuh satu kolom (rata kiri) ── */
[data-export-area] [data-chart-section] { display: block !important; }
`;

export function applyExportMonochrome(clonedDoc: Document) {
  const style = clonedDoc.createElement("style");
  style.id = "export-monochrome-style";
  style.textContent = EXPORT_MONOCHROME_CSS;
  clonedDoc.head.appendChild(style);

  const area = clonedDoc.querySelector("[data-export-area]");
  if (!area) return;

  const paint = (selector: string, prop: "fill" | "stroke", value: string) => {
    area.querySelectorAll(selector).forEach((el) => {
      el.setAttribute(prop, value);
      (el as SVGElement).style.setProperty(prop, value);
    });
  };

  paint("text, tspan", "fill", "#000000");
  paint(".recharts-cartesian-axis-line", "stroke", "#000000");
  paint(".recharts-cartesian-axis-tick line", "stroke", "#000000");
  paint(".recharts-area-curve", "stroke", "#000000");
  paint(".recharts-line-dot", "fill", "#ffffff");
  paint(".recharts-line-dot", "stroke", "#000000");
  paint(".recharts-area-area", "fill", "#ffffff");
  paint(".recharts-bar-rectangle", "fill", "#ffffff");
  paint(".recharts-bar-rectangle", "stroke", "#000000");
  paint(".recharts-cartesian-grid line", "stroke", "#cbd5e1");

  // ── Garis seri: hitam dengan pola pembeda (0: rata-rata solid tebal, 1: maks putus-putus, 2: min titik-titik) ──
  const LINE_PATTERNS = [
    { strokeWidth: 3, strokeDasharray: null as string | null }, // Rata-rata
    { strokeWidth: 2, strokeDasharray: "6 3" }, // Maksimum
    { strokeWidth: 2, strokeDasharray: "2 3" }, // Minimum
  ];

  area.querySelectorAll("svg").forEach((svg) => {
    const lines = Array.from(svg.querySelectorAll(".recharts-line"));
    if (lines.length === 0) return;
    lines.forEach((line, idx) => {
      const curve = line.querySelector(".recharts-line-curve");
      if (!curve) return;
      const pattern = LINE_PATTERNS[idx % LINE_PATTERNS.length];
      const curveEl = curve as SVGElement;
      curveEl.setAttribute("stroke", "#000000");
      curveEl.setAttribute("stroke-width", String(pattern.strokeWidth));
      curveEl.style.setProperty("stroke", "#000000");
      curveEl.style.setProperty("stroke-width", String(pattern.strokeWidth));
      if (pattern.strokeDasharray) {
        curveEl.setAttribute("stroke-dasharray", pattern.strokeDasharray);
        curveEl.style.setProperty("stroke-dasharray", pattern.strokeDasharray);
      } else {
        curveEl.removeAttribute("stroke-dasharray");
        curveEl.style.setProperty("stroke-dasharray", "none");
      }
    });
  });

  // ── Ubah grafik garis menjadi AREA CHART dengan gradasi abu (hanya di PDF) ──
  // Setiap path garis (.recharts-line-curve) disalin menjadi path area yang
  // ditutup ke baseline sumbu-X, lalu disisipkan DI BAWAH semua garis supaya
  // tidak menutupi garis-garis yang lain.
  const SVG_NS = "http://www.w3.org/2000/svg";
  let areaChartIndex = 0;

  area.querySelectorAll("svg").forEach((svg) => {
    const lineGroups = Array.from(svg.querySelectorAll(".recharts-line"));
    if (lineGroups.length === 0) return;

    // Baseline = posisi Y garis sumbu-X (garis cartesian paling bawah)
    let baselineY: number | null = null;
    const axisLine = svg.querySelector(".recharts-cartesian-axis-line");
    if (axisLine) {
      const y1 = Number(axisLine.getAttribute("y1"));
      const y2 = Number(axisLine.getAttribute("y2"));
      if (Number.isFinite(y1) && Number.isFinite(y2)) baselineY = (y1 + y2) / 2;
    }

    const areaPaths: SVGPathElement[] = [];

    lineGroups.forEach((line) => {
      const curve = line.querySelector(".recharts-line-curve");
      if (!curve) return;
      const d = curve.getAttribute("d");
      if (!d) return;

      const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number);
      if (!nums || nums.length < 4) return;

      // Fallback baseline: titik terendah dari path garis
      let baseline = baselineY;
      if (baseline === null) {
        const ys: number[] = [];
        for (let i = 1; i < nums.length; i += 2) ys.push(nums[i]);
        baseline = Math.max(...ys) + 4;
      }

      const firstX = nums[0];
      const lastX = nums[nums.length - 2];

      // Path area = jalur garis + turun ke baseline + kembali ke titik awal + tutup
      const areaD = `${d} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;

      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", areaD);
      path.setAttribute("class", "export-area-fill");
      path.setAttribute("pointer-events", "none");
      path.setAttribute("fill", `url(#export-area-grad-${areaChartIndex})`);
      path.setAttribute("stroke", "none");
      areaPaths.push(path);
    });

    if (areaPaths.length === 0) return;

    // Defs gradasi abu (atas pekat → bawah transparan) per grafik
    const gradId = `export-area-grad-${areaChartIndex}`;
    areaChartIndex++;

    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(SVG_NS, "defs");
      svg.insertBefore(defs, svg.firstChild);
    }

    const grad = document.createElementNS(SVG_NS, "linearGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", "0");
    grad.setAttribute("y2", "1");

    const stopTop = document.createElementNS(SVG_NS, "stop");
    stopTop.setAttribute("offset", "0%");
    stopTop.setAttribute("stop-color", "#6b7280");
    stopTop.setAttribute("stop-opacity", "0.5");

    const stopBottom = document.createElementNS(SVG_NS, "stop");
    stopBottom.setAttribute("offset", "100%");
    stopBottom.setAttribute("stop-color", "#ffffff");
    stopBottom.setAttribute("stop-opacity", "0.08");

    grad.appendChild(stopTop);
    grad.appendChild(stopBottom);
    defs.appendChild(grad);

    // Sisipkan area di posisi awal SVG → dilukis pertama = berada di belakang semua garis
    areaPaths.forEach((p) => {
      svg.insertBefore(p, svg.firstChild);
    });
  });

  // ── Legenda: swatch mengikuti pola garis seri ──
  const LEGEND_SWATCHES = [
    { borderTop: "4px solid #000000" },
    { borderTop: "3px dashed #000000" },
    { borderTop: "3px dotted #000000" },
  ];

  area.querySelectorAll(".recharts-legend-wrapper .rounded-\\[2px\\]").forEach((swatch, idx) => {
    const el = swatch as HTMLElement;
    const pattern = LEGEND_SWATCHES[idx % LEGEND_SWATCHES.length];
    el.style.backgroundColor = "transparent";
    el.style.width = "20px";
    el.style.height = "0";
    el.style.borderRadius = "0";
    el.style.margin = "4px 0";
    el.style.borderTop = pattern.borderTop;
  });

  // ── Grafik di PDF: satu kolom penuh rata kiri (inline, pasti terbaca html2canvas) ──
  area.querySelectorAll("[data-chart-section]").forEach((el) => {
    (el as HTMLElement).style.display = "block";
    (el as HTMLElement).style.textAlign = "left";
  });

  // ── Hapus kotak pembungkus grafik (border/bg/rounded/padding) & rata kiri ──
  area.querySelectorAll(".rounded-3xl").forEach((el) => {
    const style = (el as HTMLElement).style;
    style.backgroundColor = "transparent";
    style.border = "none";
    style.borderRadius = "0";
    style.padding = "0";
    style.boxShadow = "none";
    style.maxWidth = "100%";
    style.margin = "0";
  });

  // ── Sembunyikan judul chart (digantikan sub-bab) ──
  area.querySelectorAll("h3").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });
  area.querySelectorAll("[data-chart-section] > div:first-child > div:first-child").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  // ── Legenda grafik lebih besar ──
  area.querySelectorAll(".recharts-legend-item-text").forEach((el) => {
    (el as HTMLElement).style.fontSize = "17px";
  });
}
