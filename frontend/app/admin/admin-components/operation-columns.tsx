"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Operation = {
  patient_name: string;
  date: string;
  duration: string;
  type: string;
  follow_up_date: string;
  condition: string;
};

export const OperationColumns: ColumnDef<Operation>[] = [
  {
    accessorKey: "patient_name",
    header: "Patient",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "follow_up_date",
    header: "Follow-up Date",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
];
