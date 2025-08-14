import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

const laboratory_services = [
  { name: "Standard Chemistry", icon: "/icons/chemistry.png" },
  { name: "Blood Typing", icon: "/icons/blood.png" },
  { name: "Urinalysis", icon: "/icons/urinalysis.png" },
  { name: "CBC", icon: "/icons/cbc.png" },
  { name: "CBC w/ PC", icon: "/icons/cbc.png" },
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
    <div className="card m-6">
      <h1 className="my-4 font-bold">Laboratory Services</h1>
      <div className="grid grid-cols-3 gap-4">
        {laboratory_services.map(({ name, icon }) => (
          <div key={name} className="card flex items-center gap-2">
            <Image
              src={icon}
              alt={name}
              height={128}
              width={128}
              quality={100}
              className="h-32 w-32 rounded-xl"
            />
            <span>{name}</span>
          </div>
        ))}
      </div>
      <h1 className="my-4 font-bold">X-Ray Services</h1>
      <div className="grid grid-cols-3 gap-4">
        {xray_services.map(({ name, icon }) => (
          <div key={name} className="card flex items-center gap-2">
            <Image
              src={icon}
              alt={name}
              height={128}
              width={128}
              quality={100}
              className="h-32 w-32 rounded-xl"
            />
            <span>{name}</span>
          </div>
        ))}
      </div>
      <h1 className="my-4 font-bold">Other Services</h1>
      <div className="grid grid-cols-3 gap-4">
        {other_services.map(({ name, icon }) => (
          <div key={name} className="card flex items-center gap-2">
            <Image
              src={icon}
              alt={name}
              height={128}
              width={128}
              quality={100}
              className="h-32 w-32 rounded-xl"
            />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
