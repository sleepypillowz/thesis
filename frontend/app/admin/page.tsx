"use client";

import PatientChart from "@/components/organisms/charts/patient-chart";
import AdminStatCards from "./components/admin-stat-cards";
import { CalendarFunction } from "./components/calendar";
import HospitalSurveyChart from "@/components/organisms/charts/hospital-survey-chart";
import { TotalAppointments } from "./components/total-appointments";
import { RevenueChart } from "@/components/organisms/charts/revenue-chart";

import { AppointmentColumns } from "./components/appointment-columns";
import { DashboardTable } from "@/components/ui/dashboard-table";
import { appointments } from "@/lib/placeholder-data";

import { DoctorColumns } from "./components/doctor-columns";
import { doctors } from "@/lib/placeholder-data";

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
        <RevenueChart />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h1 className="font-bold mb-4">Appointments</h1>
          <DashboardTable
            columns={AppointmentColumns}
            data={appointments ?? []}
          />
        </div>
        <div className="card col-span">
          <h1 className="font-bold mb-4">Doctor Status</h1>
          <DashboardTable columns={DoctorColumns} data={doctors ?? []} />
        </div>
      </div>
    </div>
  );
}
