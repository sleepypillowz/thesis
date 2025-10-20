import { Activity, Egg, Syringe } from "lucide-react";
import Link from "next/link";

export default function PatientGroup() {
  const patientGroup = [
    { id: 1, label: "Cholesterol", count: 5, icon: Egg },
    { id: 2, label: "Blood Pressure", count: 3, icon: Activity },
    { id: 3, label: "Diabetes", count: 7, icon: Syringe },
  ];

  const sortedPatients = [...patientGroup].sort((a, b) => b.count - a.count);

  return (
    <div className="card space-y-6">
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
        {sortedPatients.map((item) => (
          <li key={item.id} className="flex flex-row justify-between">
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
    </div>
  );
}
