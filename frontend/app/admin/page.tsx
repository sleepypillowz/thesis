"use client";

import PatientChart from "@/app/admin/admin-components/patient-chart";
import AdminStatCards from "./admin-components/admin-stat-cards";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import HospitalSurveyChart from "@/app/admin/admin-components/hospital-survey-chart";
import { TotalAppointments } from "./admin-components/total-appointments";
import { RevenueChart } from "@/app/admin/admin-components/revenue-chart";

import { DashboardTable } from "@/components/ui/custom/dashboard-table";
import { AppointmentColumns } from "./admin-components/appointment-columns";
import { DoctorColumns } from "../../components/shared/doctor-columns";
import { appointments } from "@/lib/placeholder-data";
import { doctors } from "@/lib/placeholder-data";
import { operations } from "@/lib/placeholder-data";
import { OperationColumns } from "./admin-components/operation-columns";
import DailyAppointments from "./admin-components/daily-appointments";

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="m-4 space-y-4">
      <AdminStatCards />
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        <PatientChart />
        <DailyAppointments />

        <div className="card">
          <h1 className="font-bold">Calendar</h1>
          <div className="flex items-center justify-center pt-4">
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
          <h1 className="mb-4 font-bold">Appointments</h1>
          <DashboardTable
            columns={AppointmentColumns}
            data={appointments ?? []}
          />
        </div>
        <div className="card">
          <h1 className="mb-4 font-bold">Doctor Status</h1>
          <DashboardTable columns={DoctorColumns} data={doctors ?? []} />
        </div>
      </div>
      <div className="card">
        <h1 className="mb-4 font-bold">Operations</h1>
        <DashboardTable columns={OperationColumns} data={operations ?? []} />
      </div>
    </div>
  );
}
