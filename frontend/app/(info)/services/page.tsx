import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const laboratory_services = [
  "Standard Chemistry",
  "Blood Typing",
  "Urinalysis",
  "CBC",
  "CBC w/ PC",
  "HbA1c",
  "ECG",
  "EBS",
  "Sodium",
  "Potassium",
  "Rabies",
  "Flu",
  "Pneumonia",
  "Anti-Tetanus",
  "Hepatitis B Screening",
];

const xray_services = [
  "Chest (PA)",
  "Chest (PA-Lateral)",
  "Chest (Lateral)",
  "Chest (Apicolordotic View)",
  "Elbow",
  "Hand",
  "Pelvic",
  "Hip Joint",
  "Knee",
  "Foot",
];

const other_services = ["Rapid Antigen", "RT-PCR", "Saliva", "Rapid Antibody"];

export default function Page() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3">
      <section className="card m-6 space-y-6">
        <h1 className="text-center text-2xl font-bold">Laboratory Services</h1>
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/laboratory.jpg"
            alt="laboratory"
            fill
            className="h-full w-full rounded-2xl object-cover"
          />
        </AspectRatio>
        <div className="pr-4">
          {laboratory_services.map((item) => (
            <Badge key={item} variant="outline" className="mr-2 rounded-full">
              {item}
            </Badge>
          ))}
        </div>
      </section>
      <section className="card m-6 space-y-6">
        <h1 className="mb-6 text-center text-2xl font-bold">X-Ray Services</h1>
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/xray.jpg"
            alt="xray"
            fill
            className="h-full w-full rounded-2xl object-cover"
          />
        </AspectRatio>
        <div className="pr-4">
          {xray_services.map((item) => (
            <Badge key={item} variant="outline" className="mr-2 rounded-full">
              {item}
            </Badge>
          ))}
        </div>
      </section>
      <section className="card m-6 space-y-6">
        <h1 className="mb-6 text-center text-2xl font-bold">Other Services</h1>
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/other-services.jpg"
            alt="other services"
            fill
            className="h-full w-full rounded-2xl object-cover"
          />
        </AspectRatio>
        <div className="pr-4">
          {other_services.map((item) => (
            <Badge key={item} variant="outline" className="mr-2 rounded-full">
              {item}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
