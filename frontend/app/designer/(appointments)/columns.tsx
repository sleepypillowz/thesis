"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Appointment = {
  patient_name: string;
  doctor_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
};

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient_name",
    header: "Patient",
  },
  {
    accessorKey: "doctor_name",
    header: "Doctor",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
  },
  {
    accessorKey: "end_time",
    header: "End Time",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
