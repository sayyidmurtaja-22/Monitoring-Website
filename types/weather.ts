// // types/weather.ts

// // Type utama untuk konfigurasi select fields
// export type WeatherDataConfig = {
//   id?: boolean;
//   time?: boolean;
//   Batt_V_Avg?: boolean;
//   PTemp_Max?: boolean;
//   WS_S_Avg?: boolean;
//   WD_Std?: boolean;
//   WS_Max?: boolean;
//   WD_Max_WS?: boolean;
//   Ta_Avg?: boolean;
//   Ta_Max?: boolean;
//   Ta_Min?: boolean;
//   RH_Avg?: boolean;
//   RH_Max?: boolean;
//   RH_Min?: boolean;
//   NR_Wm2_Avg?: boolean;
//   NR_Wm2_Max?: boolean;
//   NR_Wm2_Min?: boolean;
//   CNR_Wm2_Avg?: boolean;
//   CNR_Wm2_Max?: boolean;
//   CNR_Wm2_Min?: boolean;
//   Rain_mm_Tot?: boolean;
//   e_Avg?: boolean;
//   e_Max?: boolean;
//   e_Min?: boolean;
// };

// Type untuk data record-nya
export type WeatherData = {
  id: string | number;
  time: string | Date | null;
  Batt_V_Avg: number | null;
  PTemp_Max: number | null;
  WS_S_Avg: number| null;
  WD_Std: number| null;
  WS_Max: number| null;
  WD_Max_WS: number| null;
  Ta_Avg: number| null;
  Ta_Max: number| null;
  Ta_Min: number| null;
  RH_Avg: number| null;
  RH_Max: number| null;
  RH_Min: number| null;
  NR_Wm2_Avg: number| null;
  NR_Wm2_Max: number| null;
  NR_Wm2_Min: number| null;
  CNR_Wm2_Avg: number| null;
  CNR_Wm2_Max: number| null;
  CNR_Wm2_Min: number| null;
  Rain_mm_Tot: number| null;
  e_Avg: number| null;
  e_Max: number| null;
  e_Min: number| null;
};


// Derived type — otomatis ambil key dari WeatherData
