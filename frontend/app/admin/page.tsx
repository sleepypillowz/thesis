import PatientChart from "@/components/organisms/charts/patient-chart";
import AdminStatCards from "./components/admin-stat-cards";
import { CalendarFunction } from "./components/calendar";
import HospitalSurveyChart from "@/components/organisms/charts/hospital-survey-chart";
import { TotalAppointments } from "./components/total-appointments";

export default function Page() {
  return (
    <div className="m-4 space-y-4">
      <AdminStatCards />
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
        <PatientChart />
        <div className="card">
          <div className="flex justify-between">
            <h1 className="font-bold">Appointments</h1>
            <span>August 2025</span>
          </div>
        </div>

        <div className="card">
          <h1 className="font-bold">Calendar</h1>
          <div className="items-center flex justify-center">
            <CalendarFunction />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <HospitalSurveyChart />
        <TotalAppointments />
      </div>
    </div>
  );
}
