"use client";
import { columns } from "./columns";
import { SkeletonPageTable } from "@/components/atoms/custom-skeleton";
import { DashboardTable } from "@/components/ui/dashboard-table";
import { appointments } from "@/lib/placeholder-data";

export default function Appointments() {
  if (appointments === undefined) {
    return <SkeletonPageTable />;
  }

  return <DashboardTable columns={columns} data={appointments ?? []} />;
}
