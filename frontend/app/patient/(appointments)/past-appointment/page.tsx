"use client";

import * as React from "react";
import { useEffect, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { SkeletonPageTable } from "@/components/atoms/custom-skeleton";

import { parseISO, format, isValid /* , differenceInCalendarDays */ } from "date-fns"; // Removed unused differenceInCalendarDays

//////////////////////
// Types for data
//////////////////////

interface DoctorInfo {
  id: string;
  full_name: string;
  email: string;
  role: string;
  specialization: string;
}

interface ReferralResponse {
  id: number;
  patient: string;
  receiving_doctor: DoctorInfo;
  reason: string;
  notes: string;
  referring_doctor: DoctorInfo;
  status: string;
  created_at: string;
  appointment_date: string; // ISO datetime
}

interface AppointmentRow {
  id: number;
  doctorName: string;
  date: string;
  startTime: string;
  reason: string;
  status: string;
}

//////////////////////
// PageTable component
//////////////////////

interface PageTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
}

function PageTable<TData, TValue>({
  columns,
  data,
  title,
}: PageTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="card m-6 space-y-6">
      {title && <h1 className="mr-4 font-bold">{title}</h1>}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Appointments
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

//////////////////////
// Default export page component
//////////////////////

export default function Page() {
  const [appointmentsData, setAppointmentsData] = useState<AppointmentRow[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const columns = React.useMemo<ColumnDef<AppointmentRow, any>[]>(() => [
    {
      accessorKey: "doctorName",
      header: "Doctor",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "startTime",
      header: "Time",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const val = info.getValue() as string;
        return <span className="capitalize">{val}</span>;
      },
    },
  ], []);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/appointment/referrals/past/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        const data: ReferralResponse[] = await res.json();
        const mapped: AppointmentRow[] = data.map((item) => {
          const appointmentAt = parseISO(item.appointment_date);
          const formattedDate = format(appointmentAt, "MMMM d, yyyy");
          const formattedTime = isValid(appointmentAt)
            ? format(appointmentAt, "h:mm a")
            : "";

          return {
            id: item.id,
            doctorName: item.receiving_doctor.full_name,
            date: formattedDate,
            startTime: formattedTime,
            reason: item.reason,
            status: item.status,
          };
        });
        setAppointmentsData(mapped);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setAppointmentsData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  if (loading || appointmentsData === undefined) {
    return <SkeletonPageTable />;
  }

  return (
    <PageTable
      title="Upcoming Appointments"
      columns={columns}
      data={appointmentsData}
    />
  );
}
