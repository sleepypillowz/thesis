"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MedicalRecord = {
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string | null;
};

export const columns: ColumnDef<MedicalRecord>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
  },
  {
    accessorKey: "treatment",
    header: "Treatment",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
];
