"use client";
import { columns } from "./columns";

import { SkeletonPageTable } from "@/components/atoms/custom-skeleton";
import { PageTable } from "@/components/ui/page-table";
import { patients } from "@/lib/placeholder-data";

export default function Page() {
  if (patients === undefined) {
    return <SkeletonPageTable />;
  }

  return <PageTable title="Patients" columns={columns} data={patients ?? []} />;
}
