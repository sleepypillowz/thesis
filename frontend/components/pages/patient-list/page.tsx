"use client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { SkeletonDataTable } from "@/components/atoms/custom-skeleton";
import { api, useQuery } from "@/lib/api/patients";

export default function PatientList() {
  const patients = useQuery(api.patients.getPatients);

  if (patients === undefined) {
    return <SkeletonDataTable />;
  }

  return <DataTable title="Patients" columns={columns} data={patients ?? []} />;
}
