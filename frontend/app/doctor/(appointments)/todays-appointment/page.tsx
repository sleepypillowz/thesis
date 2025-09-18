"use client";
import { AppointmentColumns } from "@/components/molecules/tables/appointment-columns";
import { PageTable } from "@/components/ui/page-table";
import useAppointments from "@/hooks/use-appointments";

export default function DemoPage() {
  const appointments = useAppointments();

  return (
    <PageTable
      title="Todays Appointments"
      columns={AppointmentColumns}
      data={appointments ?? []}
    />
  );
}
