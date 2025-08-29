"use client";

import { Badge } from "@/components/ui/badge";
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
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      // Map status to color
      const statusColor =
        status === "Scheduled" || status === "Completed"
          ? "text-green-500 border-green-500"
          : status === "Pending"
          ? "text-yellow-500 border-yellow-500"
          : status === "Cancelled"
          ? "text-red-500 border-red-500"
          : "text-gray-500 border-gray-500";

      return (
        <Badge
          variant="outline"
          className={`${statusColor} rounded-full bg-muted`}
        >
          {status}
        </Badge>
      );
    },
  },
];
