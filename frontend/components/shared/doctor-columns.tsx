"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Doctor = {
  name: string;
  specialization: string;
  days_available: string | null;
  working_hours: string | null;
  status: string;
};

export const DoctorColumns: ColumnDef<Doctor>[] = [
  {
    accessorKey: "name",
    header: "Doctor",
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
  },
];
