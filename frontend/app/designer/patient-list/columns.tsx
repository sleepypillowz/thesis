"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Patient = {
  patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  queue_data: {
    created_at: string;
    status: string;
    complaint: string;
  }[];
};

export const columns: ColumnDef<Patient>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const { first_name, middle_name, last_name } = row.original;
      return (
        <span>
          {first_name} {middle_name ? `${middle_name} ` : ""}
          {last_name}
        </span>
      );
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const latestQueue = row.original.queue_data?.[0];
      return latestQueue ? latestQueue.status : "-";
    },
  },
  {
    id: "complaint",
    header: "Complaint",
    cell: ({ row }) => {
      const latestQueue = row.original.queue_data?.[0];
      return latestQueue ? latestQueue.complaint : "-";
    },
  },
];
