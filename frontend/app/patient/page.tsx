import PatientRecentMedications from "@/components/molecules/tables/patient-recent-medications";
import StatsCard from "@/components/organisms/patient-stats-cards";
import { PerformanceHeartRateChart } from "@/components/organisms/performance-heart-rate-chart";
import { RestingHeartRateChart } from "@/components/organisms/resting-heart-rate-chart";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientPastAppointment from "@/components/molecules/tables/patient-past-appointment";
import PatientUpcomingAppointment from "@/components/molecules/tables/patient-upcoming-appointment";
import PatientRecentDocuments from "@/components/molecules/tables/patient-recent-documents";

export default function Page() {
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
              Cara Stevens!
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
        <PatientRecentMedications />
        <div className="card col-span-2">
          <Tabs defaultValue="upcoming-appointment">
            <TabsList className="w-full">
              <TabsTrigger className="w-1/2" value="upcoming-appointment">
                Upcoming Appointment
              </TabsTrigger>
              <TabsTrigger className="w-1/2" value="past-appointment">
                Past Appointment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming-appointment">
              <PatientUpcomingAppointment />
            </TabsContent>
            <TabsContent value="past-appointment">
              <PatientPastAppointment />
            </TabsContent>
          </Tabs>
        </div>
        <PatientRecentDocuments />
      </section>
    </div>
  );
}
