import { DashboardTable } from "@/components/ui/dashboard-table";
import { AppointmentRequestColumns } from "./appointment-request-columns";
import { appointmentRequest } from "@/lib/placeholder-data";

export default function Page() {
  return (
    <div className="card m-6 space-y-6">
      <h1 className="mb-6 text-3xl font-bold">Patient Requests</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Appointment Request</h2>
          <DashboardTable
            columns={AppointmentRequestColumns}
            data={appointmentRequest ?? []}
          />
        </div>
        <div className="card col-span-1 space-y-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-semibold">Updates Today</h2>
            <span className="font-semibold text-muted-foreground">
              As of 10:00 AM
            </span>
          </div>

          <div className="flex flex-row justify-between">
            <span>Juan Dela Cruz</span>
            <span className="font-semibold text-blue-500">
              Arrived at 10:00 AM
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <span>Juan Dela Cruz</span>
            <span className="font-semibold text-muted-foreground">
              Canceled Appointment
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <span>Juan Dela Cruz</span>
            <span className="font-semibold text-yellow-500">
              Ongoing Appointment
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <span>Juan Dela Cruz</span>
            <span className="font-semibold text-green-500">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
