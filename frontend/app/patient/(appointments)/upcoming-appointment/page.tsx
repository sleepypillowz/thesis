"use client";
import { columns } from "../columns";
import { SkeletonPageTable } from "@/components/shared/custom-skeleton";
import { PageTable } from "@/components/ui/custom/page-table";
import { appointments } from "@/lib/placeholder-data";

export default function DemoPage() {
  if (appointments === undefined) {
    return <SkeletonPageTable />;
  }

  return (
    <PageTable
      title="Upcoming Appointments"
      columns={columns}
      data={appointments ?? []}
    />
  );
}
