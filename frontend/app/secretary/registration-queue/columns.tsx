"use client";
import { ColumnDef } from "@tanstack/react-table";

export type Registration = {
  queue_number: string;
  name: string;
  type: string;
  time: string;
};

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "queue_number",
    header: "Queue Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
];
