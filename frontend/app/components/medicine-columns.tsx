"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale'
import Link from "next/link"

export type Patient = {
  patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  queue_data: {
    created_at: string;
    status: string;
  };
  time: string;
  complaint: string;
}

export const columns: ColumnDef<Patient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "no", // Column for No
    header: "No",
    cell: ({ row }) => {
      // Calculate the patient number based on the row index
      const patientIndex = row.index + 1; // Add 1 to make it 1-based index
      return patientIndex;
    },
  },
  {
    accessorKey: "patient_id",
    header: "Patient ID",
  },
  {
    id: "patient_name", // Use 'id' for a custom column
    header: "Patient Name",
    cell: ({ row }) => {
      const { first_name, middle_name, last_name } = row.original; // Get data from the row
      return `${first_name} ${middle_name ? middle_name : ""} ${last_name}`.trim(); // Combine the names
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    id: "created_date", // Column for Created Date (foreign key)
    header: "Created Date",
    cell: ({ row }) => {
      const createdAt = row.original.queue_data?.created_at;
      return createdAt ? format(new Date(createdAt), "d MMMM yyyy", { locale: enGB }) : "N/A";
    },
  },
  {
    id: "time", // Column for Created Date (foreign key)
    header: "Time",
    cell: ({ row }) => {
      const createdAt = row.original.queue_data?.created_at;
      return createdAt ? format(new Date(createdAt), "HH:mm:ss", { locale: enGB }) : "N/A";
    },
  },
  {
    accessorKey: "complaint",
    header: "Complaint",
  },
  {
    id: "status", // Column for Created Date (foreign key)
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.queue_data?.status;
      return status || "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.patient_id)}>
              Copy patient ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/admin/patient-information">
            <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
            <Link href="/admin/patient-information">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <Link href="/admin/patient-information">
            <DropdownMenuItem>Delete</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]