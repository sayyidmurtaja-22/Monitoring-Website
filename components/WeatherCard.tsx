'use client';

import { Cloud, CloudRain, Wind, Droplets } from 'lucide-react';

interface WeatherCardProps {
  tempMax: number;
  tempMin: number;
  windSpeed: number;
  timestamp: string;
  location: string;
}

export default function WeatherCard({
  tempMax,
  tempMin,
  windSpeed,
  timestamp,
  location,
}: WeatherCardProps) {
  // Format timestamp
  const formattedTime = new Date(timestamp).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Tentukan icon berdasarkan kondisi
  const getWeatherIcon = () => {
    if (windSpeed > 8) return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (tempMax > 32) return <Cloud className="w-12 h-12 text-orange-400" />;
    return <Cloud className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{location}</h3>
          <p className="text-sm text-gray-500">{formattedTime}</p>
        </div>
        {getWeatherIcon()}
      </div>

      {/* Temperature Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded p-3">
          <p className="text-xs text-red-600 font-semibold mb-1">Temp Max</p>
          <p className="text-2xl font-bold text-red-700">{tempMax.toFixed(1)}°C</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-3">
          <p className="text-xs text-blue-600 font-semibold mb-1">Temp Min</p>
          <p className="text-2xl font-bold text-blue-700">{tempMin.toFixed(1)}°C</p>
        </div>
      </div>

      {/* Wind Speed Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-3 flex items-center gap-3">
        <Wind className="w-5 h-5 text-green-600" />
        <div>
          <p className="text-xs text-green-600 font-semibold">Kecepatan Angin</p>
          <p className="text-lg font-bold text-green-700">{windSpeed.toFixed(1)} m/s</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 mt-4">
        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          Live
        </span>
        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
          Updated
        </span>
      </div>
    </div>
  );
}
