"use client";
import { columns } from "../columns";

import { SkeletonDataTable } from "@/components/atoms/custom-skeleton";
import { CrudTable } from "@/components/ui/crud-table";
import { users } from "@/lib/placeholder-data";

export default function DemoPage() {
  if (users === undefined) {
    return <SkeletonDataTable />;
  }

  return <CrudTable title="Users" columns={columns} data={users ?? []} />;
}
