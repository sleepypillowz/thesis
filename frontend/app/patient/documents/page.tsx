"use client";
import { columns } from "./columns";
import { SkeletonPageTable } from "@/components/atoms/custom-skeleton";
import { PageTable } from "@/components/ui/page-table";
import { documents } from "@/lib/placeholder-data";

export default function DemoPage() {
  if (documents === undefined) {
    return <SkeletonPageTable />;
  }

  return (
    <PageTable title="Documents" columns={columns} data={documents ?? []} />
  );
}
