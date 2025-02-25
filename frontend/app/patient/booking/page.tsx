import { AppointmentSonner } from "@/components/appointment-sonner";
import { DatePicker } from "@/components/date-picker";

export default function Page() {
  return (
    <div className="flex-1 px-8 py-8">
      <h1 className="text-gray-foreground mb-4 text-3xl font-semibold">
        Book an Appointment
      </h1>
      <DatePicker />
      <AppointmentSonner />
    </div>
  );
}
