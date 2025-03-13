"use client";
import { VisitorsChart } from "@/components/organisms/visitors-chart";
import { CommonDiseasesChart } from "@/components/organisms/common-diseases-chart";

import StatsCard from "@/components/organisms/stats-cards";
import MedicalRecords from "@/components/molecules/tables/medical-records";

export default function Page() {
  return (
    <div className="mb-4 space-y-4 text-center md:text-left lg:m-0">
      <div className="px-6 py-4">
        <p className="text-2xl font-bold">Good Day, Test</p>
        <p className="text-sm">
          Check out the latest updates from the past 7 days!
        </p>
      </div>

      <StatsCard />

      <div className="space-y-4 lg:mx-4 lg:flex lg:justify-center lg:space-x-4 lg:space-y-0">
        <div className="lg:w-full">
          <VisitorsChart />
        </div>

        <div className="lg:w-full lg:max-w-xs">
          <CommonDiseasesChart />
        </div>
      </div>
      <MedicalRecords />
    </div>
  );
}
