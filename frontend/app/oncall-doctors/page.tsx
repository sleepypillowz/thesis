import OncallDoctorsRecentAppointment from "@/components/molecules/tables/oncall-doctors-recent-appointment";
import PatientGroup from "@/components/molecules/tables/patient-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

const cards = [
  { id: 1, label: "Appointments", count: 12, color: "indigo" },
  { id: 2, label: "Surgeries", count: 12, color: "red" },
  { id: 3, label: "Room Visit", count: 12, color: "green" },
];

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
        <OncallDoctorsRecentAppointment />
        <PatientGroup />
      </div>
    </div>
  );
}
