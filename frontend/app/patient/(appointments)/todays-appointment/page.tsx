import TitleCard from "@/components/molecules/title-card";
import AppointmentTable from "@/app/patient/components/appointment-table";
import { appointments } from "@/lib/placeholder-data";

export default function Page() {
  return (
    <TitleCard title="Today's Appointment">
      <AppointmentTable appointments={appointments} />
    </TitleCard>
  );
}
