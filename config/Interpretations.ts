// ============================================================================
// KONFIGURASI INTERPRETASI DATA CUACA
// Berisi seluruh kemungkinan kalimat interpretasi untuk setiap parameter dan
// kondisi datanya (periode per jam / per hari / per bulan, kondisi normal,
// di atas/bawah normal, hujan ringan/sedang/lebat, dsb.).
// Dipakai ulang oleh AnalysisNote: kondisi dihitung lalu template yang cocok
// diambil dari config ini.
// ============================================================================

export const INTERVAL_LABEL: Record<string, string> = {
  hour: "per jam",
  day: "per hari",
  week: "per minggu",
  month: "per bulan",
};

export type InterpretationCondition =
  | "tidak_ada_data"
  | "deskripsi"
  | "periode_pendek"
  | "normal"
  | "di_atas_normal"
  | "di_bawah_normal"
  | "sebagian_menyimpang"
  | "banyak_menyimpang_atas"
  | "banyak_menyimpang_bawah"
  | "trend_meningkat"
  | "trend_menurun"
  | "variasi_tinggi"
  | "kering"
  | "hujan_ringan"
  | "hujan_sedang"
  | "hujan_lebat"
  | "hujan_merata"
  | "arah_dominan";

export interface InterpretationValues {
  label: string;
  unit: string;
  sum: boolean;
  compass: boolean;
  count: number;
  avg: number | null;
  median: number | null;
  stddev: number | null;
  cv: number | null;
  range: number | null;
  max: number | null;
  min: number | null;
  maxPeriod: string;
  minPeriod: string;
  latest: number | null;
  status: string | null;
  outOfRange: number;
  total: number | null;
  positive: number;
  first: number | null;
  last: number | null;
  trend: "meningkat" | "menurun" | "stabil" | null;
  fromDate: string;
  toDate: string;
  shortPeriod: boolean;
}

export interface InterpretationTemplate {
  condition: InterpretationCondition;
  text: string;
}

// ─── Menentukan kondisi data dari nilai-nilai hasil agregasi ────────────────
export function resolveCondition(v: InterpretationValues): InterpretationCondition {
  if (!v.count) return "tidak_ada_data";

  if (v.sum) {
    if ((v.total ?? 0) === 0) return "kering";
    const ratio = v.count ? v.positive / v.count : 0;
    if (ratio >= 0.5) return "hujan_merata";
    const t = v.total ?? 0;
    if (t < 20) return "hujan_ringan";
    if (t <= 100) return "hujan_sedang";
    return "hujan_lebat";
  }

  if (v.compass) return "arah_dominan";

  if (v.shortPeriod) return "periode_pendek";

  if (v.status === "di atas normal") {
    return v.outOfRange >= Math.max(1, v.count / 2) ? "banyak_menyimpang_atas" : "di_atas_normal";
  }
  if (v.status === "di bawah normal") {
    return v.outOfRange >= Math.max(1, v.count / 2) ? "banyak_menyimpang_bawah" : "di_bawah_normal";
  }
  if (v.status === null) return "deskripsi";
  if (v.outOfRange > 0) return "sebagian_menyimpang";
  if (v.trend === "meningkat") return "trend_meningkat";
  if (v.trend === "menurun") return "trend_menurun";
  if (v.cv !== null && v.cv >= 20) return "variasi_tinggi";
  return "normal";
}

// ─── Mengisi placeholder {kata} pada template dengan nilai sebenarnya ───────
export function fillTemplate(text: string, v: InterpretationValues, intervalLabel: string): string {
  const num = (x: number | null, d = 1) => (x === null ? "-" : x.toFixed(d).replace(".", ","));
  const pct = (x: number) => `${Math.round(x)}%`;
  const map: Record<string, string> = {
    label: v.label,
    unit: v.unit,
    interval: intervalLabel,
    avg: num(v.avg),
    median: num(v.median),
    stddev: num(v.stddev),
    cv: v.cv === null ? "-" : pct(v.cv),
    range: num(v.range),
    max: num(v.max),
    min: num(v.min),
    maxPeriod: v.maxPeriod || "-",
    minPeriod: v.minPeriod || "-",
    latest: num(v.latest),
    status: v.status ?? "normal",
    outOfRange: String(v.outOfRange),
    count: String(v.count),
    total: num(v.total),
    positive: String(v.positive),
    first: num(v.first),
    last: num(v.last),
    trend: v.trend ?? "stabil",
    fromDate: v.fromDate || "-",
    toDate: v.toDate || "-",
    pct: v.count ? `${Math.round((v.positive / v.count) * 100)}%` : "0%",
    pctOut: v.count ? pct((v.outOfRange / v.count) * 100) : "0%",
    direction: v.status?.replace("Arah ", "") ?? "-",
  };
  return text.replace(/\{(\w+)\}/g, (_, k: string) => map[k] ?? `{${k}}`);
}

// ─── Template default untuk parameter dengan kisaran normal ─────────────────
export const DEFAULT_TEMPLATES: InterpretationTemplate[] = [
  {
    condition: "tidak_ada_data",
    text: "Tidak terdapat data {label} yang valid pada periode {interval} yang dipilih, sehingga kondisi parameter ini tidak dapat diinterpretasikan. Disarankan untuk memeriksa kembali ketersediaan data pada rentang waktu tersebut.",
  },
  {
    condition: "periode_pendek",
    text: "Periode pengamatan {label} tergolong pendek, hanya mencakup {count} data pada {interval} dalam rentang {fromDate} hingga {toDate}. Dengan jumlah sampel yang terbatas tersebut, analisis yang dihasilkan bersifat deskriptif awal: rata-rata tercatat {avg} {unit} dengan nilai tertinggi {max} {unit} dan terendah {min} {unit}. Interpretasi lebih lanjut memerlukan rentang waktu pengamatan yang lebih panjang agar representatif secara statistik.",
  },
  {
    condition: "deskripsi",
    text: "Berdasarkan pengamatan {label} pada rentang {fromDate} hingga {toDate}, diperoleh rata-rata {avg} {unit} dengan nilai median {median} {unit}. Distribusi nilai menunjukkan simpangan baku {stddev} {unit} (koefisien variasi {cv}), sehingga rentang data cukup bervariasi antara {min} hingga {max} {unit}. Nilai tertinggi {max} {unit} tercatat pada {maxPeriod} sedangkan nilai terendah {min} {unit} terjadi pada {minPeriod}. Fluktuasi ini menggambarkan dinamika parameter tersebut sepanjang periode pengamatan.",
  },
  {
    condition: "normal",
    text: "{label} pada rentang {fromDate} hingga {toDate} berada dalam kondisi normal dan relatif stabil. Rata-rata tercatat {avg} {unit} dengan nilai tengah (median) {median} {unit} dan simpangan baku {stddev} {unit}, menunjukkan sebaran data yang tidak terlalu lebar (rentang {min}–{max} {unit}). Nilai terkini {latest} {unit} masih berada dalam kisaran kewajaran sehingga tidak terdapat indikasi penyimpangan yang perlu dikhawatirkan.",
  },
  {
    condition: "di_atas_normal",
    text: "{label} pada rentang {fromDate} hingga {toDate} cenderung berada di atas kisaran normal. Rata-rata tercatat {avg} {unit} dengan nilai puncak {max} {unit} pada {maxPeriod}, sedangkan nilai terendah {min} {unit} terjadi pada {minPeriod}. Sebanyak {outOfRange} dari {count} data ({pctOut}) tercatat di luar batas normal. Nilai terkini {latest} {unit} tergolong di atas normal, menandakan kondisi yang lebih tinggi dari biasanya sehingga perlu diwaspadai dan dipantau terus menerus.",
  },
  {
    condition: "di_bawah_normal",
    text: "{label} pada rentang {fromDate} hingga {toDate} cenderung berada di bawah kisaran normal. Rata-rata tercatat {avg} {unit} dengan titik terendah {min} {unit} pada {minPeriod}, sedangkan nilai tertinggi {max} {unit} terjadi pada {maxPeriod}. Sebanyak {outOfRange} dari {count} data ({pctOut}) tercatat di luar batas normal. Nilai terkini {latest} {unit} tergolong di bawah normal, menandakan kondisi yang lebih rendah dari biasanya sehingga perlu diwaspadai dan dipantau terus menerus.",
  },
  {
    condition: "sebagian_menyimpang",
    text: "{label} pada rentang {fromDate} hingga {toDate} memiliki rata-rata {avg} {unit} yang tergolong normal (median {median} {unit}), namun terdapat {outOfRange} dari {count} data ({pctOut}) yang tercatat di luar kisaran normal. Hal ini menunjukkan bahwa meskipun rata-rata keseluruhan masih wajar, sebagian periode mengalami kondisi yang menyimpang dari kewajaran (rentang pengamatan {min}–{max} {unit}) dan perlu diperhatikan pada periode-periode tersebut.",
  },
  {
    condition: "banyak_menyimpang_atas",
    text: "{label} pada rentang {fromDate} hingga {toDate} menunjukkan kecenderungan yang tinggi. Sebanyak {outOfRange} dari {count} data ({pctOut}) tercatat di atas kisaran normal dengan rata-rata {avg} {unit} (median {median} {unit}) dan simpangan baku {stddev} {unit}. Kondisi ini mengindikasikan bahwa parameter berada jauh di atas kewajaran selama sebagian besar periode pengamatan, sehingga perlu menjadi perhatian khusus karena berpotensi memengaruhi kondisi lingkungan secara keseluruhan.",
  },
  {
    condition: "banyak_menyimpang_bawah",
    text: "{label} pada rentang {fromDate} hingga {toDate} menunjukkan kecenderungan yang rendah. Sebanyak {outOfRange} dari {count} data ({pctOut}) tercatat di bawah kisaran normal dengan rata-rata {avg} {unit} (median {median} {unit}) dan simpangan baku {stddev} {unit}. Kondisi ini mengindikasikan bahwa parameter berada jauh di bawah kewajaran selama sebagian besar periode pengamatan, sehingga perlu menjadi perhatian khusus karena berpotensi memengaruhi kondisi lingkungan secara keseluruhan.",
  },
  {
    condition: "trend_meningkat",
    text: "{label} pada rentang {fromDate} hingga {toDate} memperlihatkan kecenderungan meningkat dari {first} {unit} menjadi {last} {unit}. Rata-rata periode tercatat {avg} {unit} dengan simpangan baku {stddev} {unit}, nilai tertinggi {max} {unit} pada {maxPeriod} dan terendah {min} {unit} pada {minPeriod}. Tren kenaikan ini mengindikasikan adanya perubahan bertahap yang perlu diamati lebih lanjut pada periode berikutnya.",
  },
  {
    condition: "trend_menurun",
    text: "{label} pada rentang {fromDate} hingga {toDate} memperlihatkan kecenderungan menurun dari {first} {unit} menjadi {last} {unit}. Rata-rata periode tercatat {avg} {unit} dengan simpangan baku {stddev} {unit}, nilai tertinggi {max} {unit} pada {maxPeriod} dan terendah {min} {unit} pada {minPeriod}. Tren penurunan ini mengindikasikan adanya perubahan bertahap yang perlu diamati lebih lanjut pada periode berikutnya.",
  },
  {
    condition: "variasi_tinggi",
    text: "{label} pada rentang {fromDate} hingga {toDate} menunjukkan variabilitas yang tinggi dengan simpangan baku {stddev} {unit} dan koefisien variasi {cv}. Nilai rata-rata {avg} {unit} (median {median} {unit}) berada dalam kisaran normal, namun rentang nilai yang lebar ({min}–{max} {unit}) menandakan ketidakstabilan data antar periode yang perlu menjadi perhatian dalam analisis lebih lanjut.",
  },
];

// ─── Template khusus curah hujan ────────────────────────────────────────────
export const RAIN_TEMPLATES: InterpretationTemplate[] = [
  { condition: "tidak_ada_data", text: "Tidak terdapat data curah hujan yang valid pada periode {interval} yang dipilih, sehingga kondisi curah hujan tidak dapat diinterpretasikan." },
  { condition: "periode_pendek", text: "Periode pengamatan curah hujan tergolong pendek, hanya mencakup {count} data pada {interval} dalam rentang {fromDate} hingga {toDate}. Selama rentang tersebut tercatat total hujan {total} {unit}, sehingga belum dapat ditarik kesimpulan yang representatif tentang pola curah hujan." },
  { condition: "kering", text: "Selama rentang pengamatan {fromDate} hingga {toDate} tidak terjadi hujan dengan total 0 mm pada seluruh {count} data pengamatan. Kondisi kering ini menunjukkan bahwa tidak ada curah hujan yang tercatat, sehingga potensi terjadinya kekeringan perlu diwaspadai apabila berlangsung dalam jangka waktu yang lama." },
  { condition: "hujan_ringan", text: "Curah hujan ringan tercatat pada rentang {fromDate} hingga {toDate} dengan total {total} {unit} dari {count} data pengamatan, rata-rata hujan per data {avg} {unit}, dan hujan tertinggi mencapai {max} {unit} pada {maxPeriod}. Intensitas hujan yang ringan ini tidak menimbulkan dampak signifikan terhadap kondisi lingkungan dan masih berada dalam kategori yang wajar." },
  { condition: "hujan_sedang", text: "Curah hujan sedang tercatat pada rentang {fromDate} hingga {toDate} dengan total {total} {unit}, rata-rata hujan per data {avg} {unit}, dan hujan tertinggi mencapai {max} {unit} pada {maxPeriod}. Hujan terjadi pada {positive} data ({pct}) dari seluruh {count} data pengamatan. Intensitas hujan kategori sedang ini masih tergolong wajar namun perlu tetap dipantau perkembangan curah hujannya." },
  { condition: "hujan_lebat", text: "Curah hujan lebat tercatat pada rentang {fromDate} hingga {toDate} dengan total {total} {unit}, rata-rata hujan per data {avg} {unit}, dan hujan tertinggi mencapai {max} {unit} pada {maxPeriod}. Intensitas hujan yang lebat ini perlu menjadi perhatian karena berpotensi menimbulkan dampak seperti genangan air, banjir, maupun bencana hidrometeorologi di sekitar lokasi stasiun." },
  { condition: "hujan_merata", text: "Hujan hampir merata sepanjang rentang {fromDate} hingga {toDate}: {positive} dari {count} data tercatat mengalami hujan dengan total {total} {unit} dan rata-rata hujan per data {avg} {unit}. Distribusi hujan yang merata ini menunjukkan kondisi basah yang berlangsung konsisten selama periode pengamatan, sehingga ketersediaan air cenderung terjaga." },
];

// ─── Template khusus arah angin ─────────────────────────────────────────────
export const DIRECTION_TEMPLATES: InterpretationTemplate[] = [
  { condition: "tidak_ada_data", text: "Tidak terdapat data arah angin yang valid pada periode {interval} yang dipilih, sehingga arah angin dominan tidak dapat diinterpretasikan." },
  { condition: "periode_pendek", text: "Pengamatan arah angin pada rentang {fromDate} hingga {toDate} hanya mencakup {count} data ({interval}), sehingga arah dominan yang dihitung bersifat deskriptif awal: arah rata-rata {avg}° dengan dominasi arah {direction}." },
  { condition: "arah_dominan", text: "Arah angin pada rentang {fromDate} hingga {toDate} tercatat dominan dari arah {direction} dengan arah rata-rata {avg}°. Dari {count} data pengamatan, dominasi arah angin ini menunjukkan pola pergerakan angin yang konsisten sepanjang periode pengamatan, yang dapat dipengaruhi oleh kondisi musim maupun kondisi topografi di sekitar lokasi stasiun." },
  { condition: "deskripsi", text: "Arah angin pada rentang {fromDate} hingga {toDate} bervariasi dengan arah rata-rata {avg}° dari {count} data pengamatan. Variasi arah angin ini mengindikasikan kondisi pergerakan angin yang berubah-ubah sepanjang periode pengamatan, sehingga tidak terdapat satu arah yang mendominasi secara signifikan." },
];

// ─── Pemetaan tiap kelompok parameter ke template interpretasinya ───────────
export interface ParamInterpretation {
  id: string;
  label: string;
  templates: InterpretationTemplate[];
}

export const PARAM_INTERPRETATIONS: Record<string, ParamInterpretation> = {
  "Suhu Udara": { id: "suhu", label: "Suhu udara", templates: DEFAULT_TEMPLATES },
  "Kelembapan Udara": { id: "kelembapan", label: "Kelembapan udara", templates: DEFAULT_TEMPLATES },
  "Tekanan Uap Air": { id: "vapor", label: "Tekanan uap air", templates: DEFAULT_TEMPLATES },
  "Tekanan Udara": { id: "tekanan", label: "Tekanan udara", templates: DEFAULT_TEMPLATES },
  "Curah Hujan": { id: "hujan", label: "Curah hujan", templates: RAIN_TEMPLATES },
  "Kecepatan Angin": { id: "angin", label: "Kecepatan angin", templates: DEFAULT_TEMPLATES },
  "Arah Angin": { id: "arah-angin", label: "Arah angin", templates: DIRECTION_TEMPLATES },
  "Radiasi Neto": { id: "radiasi-neto", label: "Radiasi matahari (radiasi neto)", templates: DEFAULT_TEMPLATES },
  "Radiasi CNR": { id: "radiasi-cnr", label: "Radiasi CNR", templates: DEFAULT_TEMPLATES },
  "Baterai & Panel": { id: "baterai", label: "Baterai stasiun dan suhu panel", templates: DEFAULT_TEMPLATES },
};

export function getInterpretation(groupLabel: string): ParamInterpretation {
  return PARAM_INTERPRETATIONS[groupLabel] ?? { id: "umum", label: groupLabel, templates: DEFAULT_TEMPLATES };
}

// ─── Fungsi utama: hasil akhir kalimat interpretasi ─────────────────────────
export function buildInterpretation(
  groupLabel: string,
  v: InterpretationValues,
  interval: string,
): string {
  const def = getInterpretation(groupLabel);
  const condition = resolveCondition(v);
  const template =
    def.templates.find((t) => t.condition === condition) ??
    def.templates.find((t) => t.condition === "deskripsi") ??
    def.templates[0];
  return fillTemplate(template.text, v, INTERVAL_LABEL[interval] ?? "per hari");
}
