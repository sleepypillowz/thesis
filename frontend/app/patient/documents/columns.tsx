"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

export type DocumentFile = {
  document_id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  status: string;
};

export const columns: ColumnDef<DocumentFile>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "file_type",
    header: "Type",
  },
  {
    accessorKey: "created_at",
    header: "Date Uploaded",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <Download className="cursor-pointer text-blue-500 hover:fill-current" />
      );
    },
  },
];
