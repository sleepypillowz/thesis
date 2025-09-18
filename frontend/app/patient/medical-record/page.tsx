"use client";
import { columns } from "./columns";

import { SkeletonPageTable } from "@/components/atoms/custom-skeleton";
import { PageTable } from "@/components/ui/page-table";
import { medicalRecords } from "@/lib/placeholder-data";

export default function Page() {
  if (medicalRecords === undefined) {
    return <SkeletonPageTable />;
  }

  return (
    <PageTable
      title="Medical Records"
      columns={columns}
      data={medicalRecords ?? []}
    />
  );
}
