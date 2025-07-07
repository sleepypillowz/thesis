import OncallDoctorsRecentAppointment from "@/components/molecules/oncall-doctors-recent-appointment";
import { PatientSurveyChart } from "@/components/organisms/charts/patient-survey-chart";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="m-6 space-y-6">
      <section className="card">
        <div className="grid grid-cols-3">
          <div className="col-span-2 content-center">
            <div className="mb-4 flex flex-col space-y-4 text-sm font-semibold text-muted-foreground">
              <span>Welcome back</span>
              <span className="text-xl font-bold text-blue-500">
                DR. Sarah Smith!
              </span>
              <span>Gynecologist, MBBS,MD</span>
            </div>
            <div className="flex space-x-6 text-slate-800">
              <div className="flex w-full flex-col rounded-xl bg-indigo-200 p-2">
                <span className="text-sm font-bold">Appointments</span>
                <span className="text-lg text-blue-600">12+</span>
              </div>
              <div className="flex w-full flex-col rounded-xl bg-red-200 p-2">
                <span className="text-sm font-bold">Surgeries</span>
                <span className="text-lg text-red-600">3+</span>
              </div>
              <div className="flex w-full flex-col rounded-xl bg-green-200 p-2">
                <span className="text-sm font-bold">Room Visit</span>
                <span className="text-lg text-green-600">12+</span>
              </div>
            </div>
          </div>
          <div className="w-96 place-content-center place-self-center">
            <AspectRatio ratio={1 / 1}>
              <Image
                src="/doctor.png"
                alt="Doctor"
                fill
                className="h-full w-full rounded-lg object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-3 space-x-6">
        <div className="card col-span-2">
          <div className="flex justify-between">
            <span className="mb-6 font-bold">Recent Appointments</span>
            <Link
              href="/oncall-doctors/appointments"
              className="font-bold text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <OncallDoctorsRecentAppointment />
        </div>
        <div>
          <PatientSurveyChart />
        </div>
      </section>
    </div>
  );
}
