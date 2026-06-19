// types/weather.ts
export type IntervalType = 'hour' | 'day' | 'month';


export type WeatherData = {
  period: string; 
  time : Date | string | null;
  id: string | number;
  timestamp: Date | string | null;
  Batt_V_Avg: number | null;
  PTemp_Max: number | null;
  WS_S_Avg: number | null;
  WD_Std: number | null;
  WS_Max: number | null;
  WD_Max_WS: number | null;
  Ta_Avg: number | null;
  Ta_Max: number | null;
  Ta_Min: number | null;
  RH_Avg: number | null;
  RH_Max: number | null;
  RH_Min: number | null;
  NR_Wm2_Avg: number | null;
  NR_Wm2_Max: number | null;
  NR_Wm2_Min: number | null;
  CNR_Wm2_Avg: number | null;
  CNR_Wm2_Max: number | null;
  CNR_Wm2_Min: number | null;
  Rain_mm_Tot: number | null;
  e_Avg: number | null;
  e_Max: number | null;
  e_Min: number | null;
};

export type AvgWeatherData = {
  id?: string;
  time?: Date | string | null;
  period: string;
  avg_Batt: number | null;
  avg_Ptemp: number | null;
  avg_WS_S_Avg: number | null;
  // avg_WS_Std: number | null;
  avg_W_D_Avg?: number | null;
  avg_WS_Max: number | null;
  avg_WD_Max_WS: number | null;
  avg_Ta_Avg: number | null;
  avg_Ta_Max: number | null;
  avg_Ta_Min: number | null;
  avg_RH_Avg: number | null;
  avg_RH_Max: number | null;
  avg_RH_Min: number | null;
  avg_NR_Wm2_Avg: number | null;
  avg_NR_Wm2_Max: number | null;
  avg_CNR_Wm2_Min: number | null;
  avg_CNR_Wm2_Max: number | null;
  avg_CNR_Wm2_Avg: number | null;
  avg_Rain_mm_Tot: number | null;
  avg_e_Avg: number | null;
  avg_e_Max: number | null;
  avg_e_Min: number | null;
  jumlah_data: number | null;
  P?: number | null;
  avg_P?: number | null;
};

// Alias untuk kompatibilitas import yang sudah ada
export type WeatherDataTypes = WeatherData;