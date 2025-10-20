"use client";
import { DataTable } from "@/components/ui/data-table";
import { PatientColumns } from "./patient-columns";
import usePatients from "@/hooks/use-patients";

export default function MedicalRecords() {
  const patients = usePatients();

  return (
    <DataTable title="Patients" columns={PatientColumns} data={patients} />
  );
}
