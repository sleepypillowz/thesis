import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const laboratory_services = [
  { name: "Standard Chemistry", icon: "/icons/chemistry.png" },
  { name: "Blood Typing", icon: "/icons/blood.png" },
  { name: "Urinalysis", icon: "/icons/urinalysis.png" },
  { name: "CBC", icon: "/icons/cbc.png" },
  { name: "CBC w/ PC", icon: "/icons/cbc-pc.png" },
  { name: "HbA1c", icon: "/icons/hba1c.png" },
  { name: "ECG", icon: "/icons/ecg.png" },
  { name: "EBS", icon: "/icons/ebs.png" },
  { name: "Sodium", icon: "/icons/sodium.png" },
  { name: "Potassium", icon: "/icons/potassium.png" },
  { name: "Rabies", icon: "/icons/rabies.png" },
  { name: "Flu", icon: "/icons/flu.png" },
  { name: "Pneumonia", icon: "/icons/pneumonia.png" },
  { name: "Anti-Tetanus", icon: "/icons/tetanus.png" },
  { name: "Hepatitis B Screening", icon: "/icons/hepatitis.png" },
];

const xray_services = [
  { name: "Chest (PA)", icon: "/icons/xray-chest-pa.png" },
  { name: "Chest (PA-Lateral)", icon: "/icons/xray-chest-pa-lateral.png" },
  { name: "Chest (Lateral)", icon: "/icons/xray-chest-lateral.png" },
  { name: "Chest (Apicolordotic View)", icon: "/icons/xray-apicolordotic.png" },
  { name: "Elbow", icon: "/icons/xray-elbow.png" },
  { name: "Hand", icon: "/icons/xray-hand.png" },
  { name: "Pelvic", icon: "/icons/xray-pelvic.png" },
  { name: "Hip Joint", icon: "/icons/xray-hip.png" },
  { name: "Knee", icon: "/icons/xray-knee.png" },
  { name: "Foot", icon: "/icons/xray-foot.png" },
];

const other_services = [
  { name: "Rapid Antigen", icon: "/icons/rapid-antigen.png" },
  { name: "RT-PCR", icon: "/icons/rt-pcr.png" },
  { name: "Saliva", icon: "/icons/saliva.png" },
  { name: "Rapid Antibody", icon: "/icons/rapid-antibody.png" },
];

export default function Page() {
  return (
    <Tabs defaultValue="lab" className="mx-4 my-8 xl:mx-48">
      {/* Tab List */}
      <TabsList className="flex justify-center gap-4 rounded-2xl bg-muted p-2 shadow-md">
        <TabsTrigger
          value="lab"
          className="rounded-xl px-4 py-2 font-medium transition-all hover:bg-accent hover:shadow"
        >
          Laboratory Services
        </TabsTrigger>
        <TabsTrigger
          value="xray"
          className="rounded-xl px-4 py-2 font-medium transition-all hover:bg-accent hover:shadow"
        >
          X-Ray Services
        </TabsTrigger>
        <TabsTrigger
          value="other"
          className="rounded-xl px-4 py-2 font-medium transition-all hover:bg-accent hover:shadow"
        >
          Other Services
        </TabsTrigger>
      </TabsList>

      {/* Laboratory Services */}
      <TabsContent value="lab" className="mt-6">
        <h1 className="mb-6 text-2xl font-bold">Laboratory Services</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {laboratory_services.map(({ name, icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 shadow-md transition hover:shadow-lg"
            >
              <Image
                src={icon}
                alt={name}
                height={128}
                width={128}
                quality={100}
                className="h-28 w-28 rounded-xl object-cover"
              />
              <span className="text-center font-medium">{name}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* X-Ray Services */}
      <TabsContent value="xray" className="mt-6">
        <h1 className="mb-6 text-2xl font-bold">X-Ray Services</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {xray_services.map(({ name, icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 shadow-md transition hover:shadow-lg"
            >
              <Image
                src={icon}
                alt={name}
                height={128}
                width={128}
                quality={100}
                className="h-28 w-28 rounded-xl object-cover"
              />
              <span className="text-center font-medium">{name}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Other Services */}
      <TabsContent value="other" className="mt-6">
        <h1 className="mb-6 text-2xl font-bold">Other Services</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {other_services.map(({ name, icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 shadow-md transition hover:shadow-lg"
            >
              <Image
                src={icon}
                alt={name}
                height={128}
                width={128}
                quality={100}
                className="h-28 w-28 rounded-xl object-cover"
              />
              <span className="text-center font-medium">{name}</span>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
