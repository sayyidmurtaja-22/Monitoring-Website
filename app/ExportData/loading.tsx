import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-200px)] p-2 space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-[250px] bg-black/20 dark:bg-white/20" />
        <Skeleton className="h-4 w-[350px] bg-black/10 dark:bg-white/10" />
      </div>

      {/* Stats/Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[120px] w-full rounded-2xl bg-black/10 dark:bg-white/10" />
        <Skeleton className="h-[120px] w-full rounded-2xl bg-black/10 dark:bg-white/10" />
        <Skeleton className="h-[120px] w-full rounded-2xl bg-black/10 dark:bg-white/10" />
      </div>

      {/* Main Content/Table Skeleton */}
      <div className="flex-1 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl bg-black/15 dark:bg-white/15" />
        <Skeleton className="h-[300px] w-full rounded-2xl bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}
