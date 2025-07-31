import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PillBottle, Syringe, Tablets } from "lucide-react";

export default function PatientRecentMedications() {
  const medications = [
    {
      id: 1,
      name: "Econochlor (chloramphenicol-oral)",
      dosage: "1-0-1",
      icon: Tablets,
      color: "text-green-600",
    },
    {
      id: 2,
      name: "Desmopressin tabs",
      dosage: "1-1-1",
      icon: PillBottle,
      color: "text-red-600",
    },
    {
      id: 3,
      name: "Abciximab-injection",
      dosage: "1-1-1",
      icon: Syringe,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="card">
      <div className="flex justify-between">
        <h1 className="font-bold">Recent Medications</h1>
        <Link
          href="/patient/prescriptions"
          className="text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicine</TableHead>
            <TableHead>Dosage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex">
                <item.icon className={`me-2 ${item.color}`} />
                {item.name}
              </TableCell>
              <TableCell>{item.dosage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
