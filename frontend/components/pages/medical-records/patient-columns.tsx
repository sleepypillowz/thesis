"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Eye } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

function ActionsCell({ patientId }: { patientId: string }) {
  const pathname = usePathname();
  const basePath = pathname.includes("oncall-doctors")
    ? "/oncall-doctors"
    : "/doctor";

  return (
    <div className="flex flex-row space-x-1">
      <Link href={`${basePath}/patient-information/${patientId}`}>
        <Eye className="cursor-pointer text-green-500 hover:fill-current" />
      </Link>
      <Edit className="cursor-pointer text-blue-500 hover:fill-current" />
      <EllipsisVertical className="cursor-pointer" />
    </div>
  );
}

export const PatientColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "patient_id",
    header: "Patient ID",
  },
  {
    id: "name",
    header: "Name",
    accessorFn: (row) =>
      `${row.first_name} ${row.middle_name ? row.middle_name + " " : ""}${
        row.last_name
      }`,
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
    id: "created_at",
    header: "Created Date",
    cell: ({ row }) => {
      const latestQueue = row.original.queue_data?.[0];
      if (!latestQueue?.created_at) return "-";

      const date = new Date(latestQueue.created_at);
      return date.toISOString().split("T")[0];
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
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const latestQueue = row.original.queue_data?.[0];
      const status = latestQueue ? latestQueue.status : null;
      if (!status) return "-";

      const statusColor =
        status.toLowerCase() === "completed"
          ? "text-green-500 border-green-500"
          : status.toLowerCase() === "queued for treatment"
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell patientId={row.original.patient_id} />,
  },
];
