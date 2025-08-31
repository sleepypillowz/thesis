import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDashboardTable() {
  return (
    <div className="card m-6 space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-[180px]" />
      </div>
      {/* Table */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      {/* Pagination */}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-[80px]" />
        <Skeleton className="h-8 w-[56px]" />
      </div>
    </div>
  );
}

export function SkeletonPageTable() {
  return (
    <div className="card m-6 space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-[180px]" />
      </div>
      {/* Table */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      {/* Pagination */}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-[80px]" />
        <Skeleton className="h-8 w-[56px]" />
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
          <Skeleton className="h-8 w-[56px]" />
          <Skeleton className="h-8 w-[160px] rounded-full" />
        </div>
        {/* Layout Switch Buttons */}
        <div className="flex space-x-1">
          <Skeleton className="h-8 w-[34px]" />
          <Skeleton className="h-8 w-[34px]" />
        </div>
      </div>
      {/* Table */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      {/* Pagination */}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-[80px]" />
        <Skeleton className="h-8 w-[56px]" />
      </div>
    </div>
  );
}
