"use client";
import { columns } from "../columns";

import { SkeletonPageTable } from "@/components/atoms/custom-skeleton";
import { PageTable } from "@/components/ui/page-table";
import { appointments } from "@/lib/placeholder-data";

export default function Page() {
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
