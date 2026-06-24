// app/loading.tsx

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto p-8 space-y-8">
      
      {/* Animasi Berputar (Spinner) */}
      <div className="relative w-10 h-10">
        {/* Lingkaran dasar (abu-abu pudar) */}
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        {/* Lingkaran berputar (biru) */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      {/* Baris Skeleton Minimalis */}
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="h-2.5 bg-gray-200 rounded-full w-48 animate-pulse"></div>
        <div className="h-2.5 bg-gray-200 rounded-full w-64 animate-pulse"></div>
        <div className="h-2.5 bg-gray-200 rounded-full w-32 animate-pulse"></div>
      </div>

    </div>
  );
}