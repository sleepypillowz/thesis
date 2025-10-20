import { MdOutlinePregnantWoman } from "react-icons/md";
import { GiKidneys } from "react-icons/gi";
import { Badge } from "@/components/ui/badge";
import { SelectComponent } from "@/components/atoms/select-component";
import { Baby, Ear, HeartPulse, PillBottle } from "lucide-react";

export default function Page() {
  const doctorTypes = [
    "Pediatrician",
    "OB-Gyne",
    "ENT",
    "Cardiologist",
    "Internist",
    "Nephrologist",
  ];

  return (
    <div className="flex-1 px-8 py-8">
      <h1 className="text-gray-foreground mb-4 text-3xl font-semibold">
        Find a Doctor
      </h1>
      <SelectComponent title={"Select a Doctor Type..."} items={doctorTypes} />
      <div className="m-4 grid grid-cols-1 place-items-center gap-4 text-card-foreground md:grid-cols-2 lg:grid-cols-4">
        <div className="card block w-full max-w-sm space-y-2 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Baby className="me-2 text-primary" />
              <p>Pediatrician</p>
            </div>
          </div>
          <p>Dra. Bolima</p>
          <Badge variant="outline">Tuesday</Badge>
          <Badge variant="outline">Friday</Badge>
          <Badge variant="outline">10:00AM - 12:00PM</Badge>
        </div>
        <div className="card block w-full max-w-sm space-y-2 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdOutlinePregnantWoman className="me-2 text-primary" />
              <p>OB-Gyne</p>
            </div>
          </div>
          <p>Dra. Lee</p>
          <Badge variant="outline">Tuesday</Badge>
          <Badge variant="outline">Saturday</Badge>
          <Badge variant="outline">10:00AM - 12:00PM</Badge>
        </div>
        <div className="card block w-full max-w-sm space-y-2 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Ear className="me-2 text-primary" />
              <p>ENT</p>
            </div>
          </div>
          <p>Dr. Sy</p>
          <Badge variant="outline">Wednesday</Badge>
          <Badge variant="outline">Friday</Badge>
          <Badge variant="outline">8:30AM - 10:30AM</Badge>
        </div>
        <div className="card block w-full max-w-sm space-y-2 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HeartPulse className="me-2 text-primary" />
              <p>Cardiologist</p>
            </div>
          </div>
          <p>Dr. Co</p>
          <Badge variant="outline">Monday</Badge>
          <Badge variant="outline">10:00AM - 12:00PM</Badge>
        </div>
        <div className="card block w-full max-w-sm space-y-2 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PillBottle className="me-2 text-primary" />
              <p>Internal Medicine</p>
            </div>
          </div>
          <p>Dra. Kat Sanchez</p>
          <Badge variant="outline">Tuesday</Badge>
          <Badge variant="outline">9:00AM - 11:00AM</Badge>
        </div>
        <div className="card block w-full max-w-sm space-y-2 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GiKidneys className="me-2 text-primary" />
              <p>Nephorologist</p>
            </div>
          </div>
          <p>Dra. Kat Sanchez</p>
          <Badge variant="outline">Thursday</Badge>
          <Badge variant="outline">8:30AM - 10:30AM</Badge>
        </div>
      </div>
    </div>
  );
}
