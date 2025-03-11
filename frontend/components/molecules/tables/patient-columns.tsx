"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import Link from "next/link";

// Update the Patient type to reflect that queue data is a separate model (an array of entries)
export type Patient = {
  patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  // Assume the API returns an array of queue entries under the key "queue_data"
  queue_data: {
    created_at: string;
    status: string;
    complaint: string;
  }[];

};

export const columns: ColumnDef<Patient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "patient_id",
    header: "Patient ID",
  },
  {
    id: "patient_name",
    header: "Patient Name",
    cell: ({ row }) => {
      const { first_name, middle_name, last_name } = row.original;
      return `${first_name} ${middle_name ? middle_name : ""} ${last_name}`.trim();
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    id: "created_date",
    header: "Created Date",
    cell: ({ row }) => {
      const queueData = row.original.queue_data;
      if (queueData && queueData.length > 0) {
        // Sort the queue entries descending by created_at
        const latestQueue = queueData.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        return format(new Date(latestQueue.created_at), "d MMMM yyyy", { locale: enGB });
      }
      return "N/A";
    },
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => {
      const queueData = row.original.queue_data;
      if (queueData && queueData.length > 0) {
        const latestQueue = queueData.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        return format(new Date(latestQueue.created_at), "HH:mm:ss", { locale: enGB });
      }
      return "N/A";
    },
  },
  {
    id: "complaint",
    header: "Complaint",
    cell: ({ row }) => {
      const queueData = row.original.queue_data;
      if (queueData && queueData.length > 0) {
        const latestQueue = queueData.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        return latestQueue.complaint;
      }
      return "N/A";
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const queueData = row.original.queue_data;
      if (queueData && queueData.length > 0) {
        const latestQueue = queueData.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        return latestQueue.status;
      }
      return "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(patient.patient_id)}
            >
              Copy patient ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/admin/patient-information">
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
            <Link href="/admin/medical-records">
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <Link href="/admin/medical-records">
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
