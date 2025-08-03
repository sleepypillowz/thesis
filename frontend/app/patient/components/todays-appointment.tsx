import Card from "@/components/molecules/card";
import AppointmentTable from "@/app/patient/components/appointment-table";
import { appointments } from "@/lib/placeholder-data";

export default function TodaysAppointment() {
  return (
    <Card title="Today's Appointment">
      <AppointmentTable appointments={appointments} />
    </Card>
  );
}
