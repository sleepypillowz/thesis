import OncallDoctorsRecentAppointment from "@/components/molecules/oncall-doctors-recent-appointment";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Activity, Egg, Syringe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const cards = [
  { label: "Appointments", count: 12, color: "indigo" },
  { label: "Surgeries", count: 12, color: "red" },
  { label: "Room Visit", count: 12, color: "green" },
];

const patientGroup = [
  { label: "Cholesterol", count: 5, icon: Egg },
  { label: "Blood Pressure", count: 3, icon: Activity },
  { label: "Diabetes", count: 7, icon: Syringe },
];

const sortedPatients = [...patientGroup].sort((a, b) => b.count - a.count);

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
              {cards.map((item, index) => (
                <div
                  key={index}
                  className={`flex w-full flex-col rounded-xl bg-${item.color}-200 p-2`}
                >
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className={`text-lg text-${item.color}-600`}>
                    {item.count}+
                  </span>
                </div>
              ))}
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
      <div className="grid grid-cols-3 space-x-6">
        <section className="card col-span-2">
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
        </section>
        <section className="card space-y-6">
          <div className="flex justify-between">
            <span className="font-bold">Patient Group</span>
            <Link
              href="/oncall-doctors"
              className="font-bold text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <ul className="space-y-6">
            {sortedPatients.map((item, index) => (
              <li key={index} className="flex flex-row justify-between">
                <div className="flex flex-row">
                  <item.icon className="mr-2" />
                  <span>{item.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.count} patients
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
