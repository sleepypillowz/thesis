"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type Appointment = {
  id: number;
  patient: string;
  referring_doctor: string;
  receiving_doctor: string;
  reason: string;
  notes?: string;
  status: "pending" | "scheduled" | "canceled" | string;
  created_at: string;
  appointment_date: string;
};

export const AppointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient",
    header: "Patient",
  },
  {
    accessorKey: "referring_doctor",
    header: "Referring Doctor",
  },
  {
    accessorKey: "receiving_doctor",
    header: "Receiving Doctor",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "appointment_date",
    header: "Appointment Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusColor =
        status.toLowerCase() === "scheduled" ||
        status.toLowerCase() === "completed"
          ? "text-green-500 border-green-500"
          : status.toLowerCase() === "pending"
          ? "text-yellow-500 border-yellow-500"
          : status.toLowerCase() === "canceled"
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
