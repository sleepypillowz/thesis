"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type Doctor = {
  name: string;
  specialization: string | null;
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusColor =
        status.toLowerCase() === "active"
          ? "text-green-500 border-green-500"
          : status.toLowerCase() === "inactive"
          ? "text-red-500 border-red-500"
          : status.toLowerCase() === "on leave"
          ? "text-yellow-500 border-yellow-500"
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
