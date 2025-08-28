"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export type Prescription = {
  prescription_id: string;
  patient_name: string;
  doctor_name: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  date_issued: string;
  status: string;
};

export const columns: ColumnDef<Prescription>[] = [
  {
    accessorKey: "medicine_name",
    header: "Medicine",
  },
  {
    accessorKey: "dosage",
    header: "Dosage",
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <Eye className="cursor-pointer text-green-500 hover:fill-current" />
      );
    },
  },
];
