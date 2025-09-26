"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import AppointmentConfirmation from "./appointment-confirmation";

export type AppointmentRequest = {
  name: string;
  request: string;
  status: string;
  amount: string;
  date: string;
  time: string;
};

export const AppointmentRequestColumns: ColumnDef<AppointmentRequest>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "request",
    header: "Request",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Eye className="cursor-pointer text-green-500 hover:fill-current" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="hidden">
              <DialogTitle>Confirm Appointment</DialogTitle>
              <DialogDescription className="hidden">
                Confirm the patients appointment request.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto">
              <AppointmentConfirmation />
            </div>
            <DialogFooter>
              <Button type="submit">Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
