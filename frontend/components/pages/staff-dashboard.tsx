"use client";
import { VisitorsChart } from "@/components/organisms/charts/visitors-chart";
import { CommonDiseasesChart } from "@/components/organisms/charts/common-diseases-chart";
import StatsCard from "@/components/organisms/admin-stats-cards";
import MedicalRecords from "@/components/pages/medical-records";
import { CommonMedicinesChart } from "@/components/organisms/charts/common-medicine-chart";
import { useUser } from "@clerk/nextjs";

export default function StaffDashboard() {
  const { user } = useUser();

  return (
    <div className="m-6 space-y-4 text-center md:text-left">
      <div className="mx-2 py-4">
        <div className="flex space-x-2 text-2xl font-bold">
          <p>Good Day,</p>
          <p className="text-blue-500">{user?.firstName}</p>
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
      <MedicalRecords />
    </div>
  );
}
