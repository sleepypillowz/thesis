import Card from "@/components/molecules/card";
import AppointmentTable from "@/app/patient/components/appointment-table";
import { appointments } from "@/lib/placeholder-data";

export default function UpcomingAppointment() {
  return (
    <Card title="Upcoming Appointment">
      <AppointmentTable appointments={appointments} />
    </Card>
  );
}
