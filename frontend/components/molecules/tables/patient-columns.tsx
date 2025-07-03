"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
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
      return `${first_name} ${
        middle_name ? middle_name : ""
      } ${last_name}`.trim();
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
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        return format(new Date(latestQueue.created_at), "d MMMM yyyy");
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
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
          <div className="space-x-4">
            <Button asChild>
              <Link href={`/doctor/patient-information/${patient.patient_id}`}>
                View
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/doctor/medical-records">Edit</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/doctor/medical-records">Archive</Link>
            </Button>
          </div>
        </DropdownMenu>
      );
    },
  },
];
