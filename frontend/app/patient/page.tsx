import PatientRecentMedications from "@/components/organisms/tables/patient/recent-medications";
import StatsCard from "@/components/organisms/patient-stats-cards";
import { PerformanceHeartRateChart } from "@/app/patient/components/performance-heart-rate-chart";
import { RestingHeartRateChart } from "@/app/patient/components/resting-heart-rate-chart";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientPastAppointment from "@/app/patient/components/past-appointment";
import PatientUpcomingAppointment from "@/app/patient/components/upcoming-appointment";
import PatientRecentDocuments from "@/app/patient/components/recent-documents";

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

      <section className="card block w-full overflow-x-auto">
        <h1 className="mb-4 text-3xl font-semibold">View Results</h1>

        <div className="space-y-2">
          <div className="card flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaFile className="text-accent" />
              <p className="text-left">Juan Dela Cruz Lab Result</p>
            </div>

            <div className="flex space-x-4">
              <Link href="/#" className="text-blue-500 hover:text-blue-700">View</Link>
              <Link href="/#" className="text-blue-500 hover:text-blue-700">Download</Link>
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaFile className="text-accent" />
              <p className="text-left">Juan Dela Cruz Lab Result</p>
            </div>

            <div className="flex space-x-4">
              <Link href="/#" className="text-blue-500 hover:text-blue-700">View</Link>
              <Link href="/#" className="text-blue-500 hover:text-blue-700">Download</Link>
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaFile className="text-accent" />
              <p className="text-left">Juan Dela Cruz Lab Result</p>
            </div>

            <div className="flex space-x-4">
              <Link href="/#" className="text-blue-500 hover:text-blue-700">View</Link>
              <Link href="/#" className="text-blue-500 hover:text-blue-700">Download</Link>
            </div>
          </div>

        </div>
      </section>

      <section className="card">
        <div className="flex-col justify-between">
          <h1 className="mb-4 text-3xl font-semibold">Notes</h1>
          <p className="text-lg">Diagnosis: Type 2 Diabetes</p>
          <ul className="list-disc space-y-4 text-wrap break-words pl-5">
            <li className="mt-4">Diet and excercise counseling recommended.</li>
            <li>Follow up in 2 weeks for blood glucose monitoring and medication
              adjustment</li>
          </ul>
        </div>
      </section>

    </div>
  );
}
