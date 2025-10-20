"use client";

import PatientChart from "@/components/organisms/charts/patient-chart";
import AdminStatCards from "./components/admin-stat-cards";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import HospitalSurveyChart from "@/components/organisms/charts/hospital-survey-chart";
import { TotalAppointments } from "./components/total-appointments";
import { RevenueChart } from "@/components/organisms/charts/revenue-chart";

import { DashboardTable } from "@/components/ui/dashboard-table";
import { AppointmentColumns } from "./components/appointment-columns";
import { DoctorColumns } from "../../components/molecules/tables/doctor-columns";
import { appointments } from "@/lib/placeholder-data";
import { doctors } from "@/lib/placeholder-data";
import { operations } from "@/lib/placeholder-data";
import { OperationColumns } from "./components/operation-columns";
import DailyAppointments from "./components/daily-appointments";

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="m-4 space-y-4">
      <AdminStatCards />
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
        <PatientChart />
        <DailyAppointments />

        <div className="card">
          <h1 className="font-bold">Calendar</h1>
          <div className="flex justify-center items-center pt-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
            />
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
        <div className="card">
          <h1 className="font-bold mb-4">Doctor Status</h1>
          <DashboardTable columns={DoctorColumns} data={doctors ?? []} />
        </div>
      </div>
      <div className="card">
        <h1 className="font-bold mb-4">Operations</h1>
        <DashboardTable columns={OperationColumns} data={operations ?? []} />
      </div>
    </div>
  );
}
