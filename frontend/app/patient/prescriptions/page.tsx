"use client";
import { columns } from "./columns";
import { SkeletonPageTable } from "@/components/shared/custom-skeleton";
import { PageTable } from "@/components/ui/custom/page-table";
import { prescriptions } from "@/lib/placeholder-data";

export default function DemoPage() {
  if (prescriptions === undefined) {
    return <SkeletonPageTable />;
  }

  return (
    <PageTable
      title="Prescriptions"
      columns={columns}
      data={prescriptions ?? []}
    />
  );
}
