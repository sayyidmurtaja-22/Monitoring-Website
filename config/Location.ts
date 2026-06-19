export type LocationKey = "padang" | "bali" | "pangandaran"
export type TableName   = "aws_bungus" | "aws_bali" | "aws_pangandaran"

export const LOCATIONS: Record<LocationKey, {
  label:  string
  table:  TableName
  region: string
  href:   string
  active: boolean
}> = {
  padang:      { label: "Padang",      table: "aws_bungus",      region: "Sumatera Barat", href: "/ListAws/Padang",      active: true },
  bali:        { label: "Bali",        table: "aws_bali",        region: "Bali",           href: "/ListAws/Bali",        active: true },
  pangandaran: { label: "Pangandaran", table: "aws_pangandaran", region: "Jawa Barat",     href: "/ListAws/Pangandaran", active: true },
}


export interface ChartLineConfig {
  key: string;
  color: string;
  name: string;
  unit?: string;
}

export interface ChartAnalysisConfig {
  type: "percentage" | "absolute_diff" | "none" | "compass";
  lowerBound?: number;
  upperBound?: number;
}

export interface ChartConfig {
  lines: ChartLineConfig[];
  title: string;
  yLabel: string;
  analysis?: ChartAnalysisConfig;
}

// ============ KONFIGURASI UNTUK SETIAP PARAMETER ============

// 1. SUHU (Temperature)
export const TEMPERATURE_CONFIG: ChartConfig = {
  title: "Grafik Suhu Udara",
  yLabel: "Suhu (°C)",
  lines: [
    { key: "Ta_Avg", color: "#ff0000", name: "Suhu Rata-rata", unit: "°C" },
    { key: "Ta_Max", color: "#ffcc00", name: "Suhu Tertinggi", unit: "°C" },
    { key: "Ta_Min", color: "#00ccff", name: "Suhu Terendah", unit: "°C" },
  ],
  analysis: {
    type: "absolute_diff",
    lowerBound: -0.5,
    upperBound: 0.5,
  },
};

// 2. KELEMBABAN (Humidity)
export const HUMIDITY_CONFIG: ChartConfig = {
  title: "Grafik Kelembaban Udara",
  yLabel: "Kelembaban (%)",
  lines: [
    { key: "RH_Avg", color: "#023e8a", name: "Kelembaban Rata-rata", unit: "%" },
    { key: "RH_Max", color: "#d00000", name: "Kelembaban Tertinggi", unit: "%" },
    { key: "RH_Min", color: "#ffba08", name: "Kelembaban Terendah", unit: "%" },
  ],
  analysis: {
    type: "percentage",
    lowerBound: 85,
    upperBound: 115,
  },
};

// 3. TEKANAN UAP AIR (Vapor Pressure)
export const VAPOR_PRESSURE_CONFIG: ChartConfig = {
  title: "Grafik Tekanan Uap Air",
  yLabel: "Tekanan (hPa)",
  lines: [
    { key: "e_Avg", color: "#33cc33", name: "Tekanan Rata-rata", unit: "hPa" },
    { key: "e_Max", color: "#ff6600", name: "Tekanan Tertinggi", unit: "hPa" },
    { key: "e_Min", color: "#ffcc00", name: "Tekanan Terendah", unit: "hPa" },
  ],
};

// 4. TEKANAN UDARA (Air Pressure)
export const PRESSURE_CONFIG: ChartConfig = {
  title: "Grafik Tekanan Udara",
  yLabel: "Tekanan (hPa)",
  lines: [
    { key: "P", color: "#9933ff", name: "Tekanan Udara", unit: "hPa" },
  ],
};

// 5. ANGIN (Wind)
export const WIND_CONFIG: ChartConfig = {
  title: "Grafik Kecepatan Angin",
  yLabel: "Kecepatan (m/s)",
  lines: [
    { key: "WS_S_Avg", color: "#33cc33", name: "Kecepatan Rata-rata", unit: "m/s" },
    { key: "WS_Max", color: "#ff3300", name: "Kecepatan Maksimum", unit: "m/s" },
  ],
  analysis: {
    type: "none",
  },
};

// 6. ARAH ANGIN (Wind Direction)
export const WIND_DIRECTION_CONFIG: ChartConfig = {
  title: "Grafik Arah Angin",
  yLabel: "Arah (derajat)",
  lines: [
    { key: "W_D_Avg", color: "#33ccff", name: "Arah Rata-rata", unit: "°" },
    { key: "WD_Max_WS", color: "#ff6600", name: "Arah saat Angin Maks", unit: "°" },
  ],
  analysis: {
    type: "compass",
  },
};

// 7. RADIASI NETO (Net Radiation)
export const NET_RADIATION_CONFIG: ChartConfig = {
  title: "Grafik Radiasi Neto",
  yLabel: "Radiasi (W/m²)",
  lines: [
    { key: "NR_Wm2_Avg", color: "#023e8a", name: "Radiasi Rata-rata", unit: "W/m²" },
    { key: "NR_Wm2_Max", color: "#d00000", name: "Radiasi Maksimum", unit: "W/m²" },
    { key: "NR_Wm2_Min", color: "#ffba08", name: "Radiasi Minimum", unit: "W/m²" },
  ],
};

// 8. RADIASI CNR (CNR Radiation)
export const CNR_RADIATION_CONFIG: ChartConfig = {
  title: "Grafik Radiasi CNR",
  yLabel: "Radiasi (W/m²)",
  lines: [
    { key: "CNR_Wm2_Avg", color: "#9933ff", name: "Radiasi Rata-rata", unit: "W/m²" },
    { key: "CNR_Wm2_Max", color: "#ff3300", name: "Radiasi Maksimum", unit: "W/m²" },
    { key: "CNR_Wm2_Min", color: "#ffcc00", name: "Radiasi Minimum", unit: "W/m²" },
  ],
};

// 9. BATERAI & PANEL (Battery & Panel)
export const BATTERY_CONFIG: ChartConfig = {
  title: "Grafik Baterai & Panel",
  yLabel: "Tegangan (V) / Suhu (°C)",
  lines: [
    { key: "Batt_V_Avg", color: "#ffcc00", name: "Tegangan Baterai", unit: "V" },
    { key: "PTemp_Max", color: "#ff6600", name: "Suhu Panel", unit: "°C" },
  ],
};

// 10. CURAH HUJAN (Rainfall)
export const RAIN_CONFIG: ChartConfig = {
  title: "Grafik Curah Hujan",
  yLabel: "Curah Hujan (mm)",
  lines: [
    { key: "Rain_mm_Tot", color: "#3399ff", name: "Total Hujan", unit: "mm" },
  ],
};

// 11. STANDAR DEVIASI ANGIN (Wind Std Deviation)
export const WIND_STD_CONFIG: ChartConfig = {
  title: "Grafik Standar Deviasi Arah Angin",
  yLabel: "Deviasi (derajat)",
  lines: [
    { key: "WD_Std", color: "#ff66cc", name: "Std Deviasi Arah Angin", unit: "°" },
  ],
};

// ============ SEMUA KONFIGURASI DALAM SATU OBJEK ============

export const ALL_CHART_CONFIGS = {
  temperature: TEMPERATURE_CONFIG,
  humidity: HUMIDITY_CONFIG,
  vaporPressure: VAPOR_PRESSURE_CONFIG,
  pressure: PRESSURE_CONFIG,
  wind: WIND_CONFIG,
  windDirection: WIND_DIRECTION_CONFIG,
  netRadiation: NET_RADIATION_CONFIG,
  cnrRadiation: CNR_RADIATION_CONFIG,
  battery: BATTERY_CONFIG,
  rain: RAIN_CONFIG,
  windStd: WIND_STD_CONFIG,
};

// ============ KONFIGURASI UNTUK CARD DATA (NILAI TERAKHIR) ============

export interface CardDataConfig {
  key: string;
  label: string;
  unit: string;
  decimals?: number;
}

export const CARD_DATA_CONFIGS: CardDataConfig[] = [
  { key: "Ta_Avg", label: "Suhu Rata-rata", unit: "°C", decimals: 1 },
  { key: "Ta_Max", label: "Suhu Tertinggi", unit: "°C", decimals: 1 },
  { key: "Ta_Min", label: "Suhu Terendah", unit: "°C", decimals: 1 },
  { key: "RH_Avg", label: "Kelembaban Rata-rata", unit: "%", decimals: 1 },
  { key: "WS_S_Avg", label: "Kecepatan Angin", unit: "m/s", decimals: 1 },
  { key: "WS_Max", label: "Angin Maksimum", unit: "m/s", decimals: 1 },
  { key: "W_D_Avg", label: "Arah Angin Rata-rata", unit: "°", decimals: 0 },
  { key: "NR_Wm2_Avg", label: "Radiasi Neto", unit: "W/m²", decimals: 1 },
  { key: "CNR_Wm2_Avg", label: "Radiasi CNR", unit: "W/m²", decimals: 1 },
  { key: "e_Avg", label: "Tekanan Uap", unit: "hPa", decimals: 1 },
  { key: "P", label: "Tekanan Udara", unit: "hPa", decimals: 1 },
  { key: "Rain_mm_Tot", label: "Curah Hujan Total", unit: "mm", decimals: 1 },
  { key: "Batt_V_Avg", label: "Tegangan Baterai", unit: "V", decimals: 2 },
  { key: "PTemp_Max", label: "Suhu Panel", unit: "°C", decimals: 1 },
];