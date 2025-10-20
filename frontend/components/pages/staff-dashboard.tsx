"use client";
import { useName } from "@/hooks/use-name";
import { Skeleton } from "../ui/skeleton";

import StatsCard from "@/components/organisms/admin-stats-cards";
import { VisitorsChart } from "@/components/organisms/charts/visitors-chart";
import { CommonDiseasesChart } from "@/components/organisms/charts/common-diseases-chart";
import { CommonMedicinesChart } from "@/components/organisms/charts/common-medicine-chart";
import { PatientColumns } from "./medical-records/patient-columns";
import { DashboardTable } from "../ui/dashboard-table";
import TitleCard from "../molecules/title-card";
import usePatients from "@/hooks/use-patients";

export default function StaffDashboard() {
  const name = useName();
  const patients = usePatients();

  return (
    <div className="m-6 space-y-4 text-center md:text-left">
      <div className="mx-2 py-4">
        <div className="flex flex-row space-x-1 text-2xl font-bold">
          <span>Good Day,</span>
          <span className="text-blue-500">
            {name ?? <Skeleton className="mb-1 h-8 w-[120px]" />}
          </span>
        </div>

        <p className="text-sm">
          Check out the latest updates from the past 7 days!
        </p>
      </div>

      <StatsCard />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Visitors chart spans 2 columns */}
        <div className="lg:col-span-2">
          <VisitorsChart />
        </div>

        {/* Sidebar spaced out to align bottom */}
        <div className="flex flex-col justify-between">
          <CommonDiseasesChart />
          <CommonMedicinesChart />
        </div>
      </div>
      <TitleCard title="Patients">
        <DashboardTable columns={PatientColumns} data={patients ?? []} />
      </TitleCard>
    </div>
  );
}
