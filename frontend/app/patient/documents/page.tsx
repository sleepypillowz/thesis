"use client";
import { columns } from "./columns";
import { SkeletonPageTable } from "@/components/shared/custom-skeleton";
import { PageTable } from "@/components/ui/custom/page-table";
import { documents } from "@/lib/placeholder-data";

export default function DemoPage() {
  if (documents === undefined) {
    return <SkeletonPageTable />;
  }

  return (
    <PageTable title="Documents" columns={columns} data={documents ?? []} />
  );
}
