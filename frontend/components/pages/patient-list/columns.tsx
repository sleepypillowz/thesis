"use client";

import { ColumnDef } from "@tanstack/react-table";

export type patients = {
  name: string;
  status: string;
};

export const columns: ColumnDef<patients>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
