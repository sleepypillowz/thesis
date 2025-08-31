import PatientChart from "@/components/organisms/charts/patient-chart";
import AdminStatCards from "./components/admin-stat-cards";
import { CalendarFunction } from "./components/calendar";
import HospitalSurveyChart from "@/components/organisms/charts/hospital-survey-chart";

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
        <div className="card flex flex-col justify-evenly p-6 rounded-2xl shadow-md bg-white">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-lg font-semibold text-gray-700">
              Total Appointments
            </h1>
            <span className="text-4xl font-bold text-gray-900 my-4">128</span>
          </div>

          {/* Stats */}
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-col items-center flex-1 bg-blue-100 text-blue-600 p-4 rounded-xl shadow-sm">
              <span className="text-2xl font-bold">73</span>
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="flex flex-col items-center flex-1 bg-orange-100 text-orange-600 p-4 rounded-xl shadow-sm">
              <span className="text-2xl font-bold">55</span>
              <span className="text-sm font-medium">Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
