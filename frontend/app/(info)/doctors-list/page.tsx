"use client";
import { GridTable } from "@/components/ui/grid-table";
import { DoctorColumns } from "@/components/molecules/tables/doctor-columns";
import GridView from "./grid-view";
import { SkeletonDataTable } from "@/components/atoms/custom-skeleton";
import { doctors } from "@/lib/placeholder-data";

export default function DocList() {
  if (doctors === undefined) {
    return <SkeletonDataTable />;
  }

  return (
    <div className="xl:mx-48">
      <GridTable
        title="Doctors"
        columns={DoctorColumns}
        data={doctors ?? []}
        GridComponent={<GridView />}
      />
    </div>
  );
}
