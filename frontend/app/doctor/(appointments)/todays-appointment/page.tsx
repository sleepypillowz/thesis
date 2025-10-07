"use client";
import { AppointmentColumns } from "@/components/shared/appointment-columns";
import { PageTable } from "@/components/ui/custom/page-table";
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
