"use client";

import StatsCard from "@/components/organisms/patient-stats-cards";
import { PerformanceHeartRateChart } from "@/app/patient/components/performance-heart-rate-chart";
import { RestingHeartRateChart } from "@/app/patient/components/resting-heart-rate-chart";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prescriptions, appointments, documents } from "@/lib/placeholder-data";

import { DashboardTable } from "@/components/ui/dashboard-table";
import { columns } from "./(appointments)/columns";
import { columns as PrescriptionsColumn } from "./prescriptions/columns";
import { columns as DocumentsColumn } from "./documents/columns";
import { useName } from "@/hooks/use-name";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const name = useName();

  return (
    <div className="m-6 space-y-6">
      <section className="card">
        <div className="grid grid-cols-3">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="/Welcome.png"
              alt="Welcome"
              fill
              className="h-full w-full rounded-lg object-cover"
            />
          </AspectRatio>

          <div className="col-span-2 flex flex-col content-center space-y-4 p-12">
            <span className="font-semibold">Welcome back</span>
            <span className="text-2xl font-bold text-blue-500">
              {name ?? <Skeleton className="mb-1 h-8 w-[120px]" />}
            </span>
            <p className="text-muted-foreground">
              We would like to take this opportunity to welcome you to our
              practice and to thank you for choosing our physicians to
              participate in your healthcare. We look forward to providing you
              with personalized, comprehensive health care focusing on wellness
              and prevention.
            </p>
          </div>
        </div>
      </section>
      <StatsCard />
      <section className="grid grid-cols-3 gap-6">
        <RestingHeartRateChart />
        <PerformanceHeartRateChart />
        <div className="card">
          <h1 className="mb-4 font-bold">Prescriptions</h1>
          <DashboardTable
            columns={PrescriptionsColumn}
            data={prescriptions ?? []}
          />
        </div>

        <div className="card col-span-2">
          <Tabs defaultValue="upcoming-appointment">
            <TabsList className="w-full">
              <TabsTrigger className="w-1/2" value="todays-appointment">
                Todays Appointment
              </TabsTrigger>
              <TabsTrigger className="w-1/2" value="upcoming-appointment">
                Upcoming Appointment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="todays-appointment">
              <DashboardTable columns={columns} data={appointments ?? []} />
            </TabsContent>
            <TabsContent value="upcoming-appointment">
              <DashboardTable columns={columns} data={appointments ?? []} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="card">
          <h1 className="mb-4 font-bold">Documents</h1>
          <DashboardTable columns={DocumentsColumn} data={documents ?? []} />
        </div>
      </section>
    </div>
  );
}
