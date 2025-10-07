import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDashboardTable() {
  return (
    <div className="card m-6 space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-[180px] animate-pulse" />
      </div>
      {/* Table */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-full animate-pulse" />
        <Skeleton className="h-8 w-full animate-pulse" />
      </div>
      {/* Pagination */}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-[80px] animate-pulse" />
        <Skeleton className="h-8 w-[56px] animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonPageTable() {
  return (
    <div className="card m-6 space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-[180px] animate-pulse" />
      </div>
      {/* Table */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-full animate-pulse" />
        <Skeleton className="h-8 w-full animate-pulse" />
      </div>
      {/* Pagination */}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-[80px] animate-pulse" />
        <Skeleton className="h-8 w-[56px] animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonDataTable() {
  return (
    <div className="card m-6 space-y-6">
      <div className="flex justify-between">
        {/* Title and Search Bar */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-[56px] animate-pulse" />
          <Skeleton className="h-8 w-[160px] animate-pulse rounded-full" />
        </div>
        {/* Layout Switch Buttons */}
        <div className="flex space-x-1">
          <Skeleton className="h-8 w-[34px] animate-pulse" />
          <Skeleton className="h-8 w-[34px] animate-pulse" />
        </div>
      </div>
      {/* Table */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-full animate-pulse" />
        <Skeleton className="h-8 w-full animate-pulse" />
      </div>
      {/* Pagination */}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-[80px] animate-pulse" />
        <Skeleton className="h-8 w-[56px] animate-pulse" />
      </div>
    </div>
  );
}
