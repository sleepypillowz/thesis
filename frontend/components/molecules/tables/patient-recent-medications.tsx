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
          <TableRow>
            <TableCell className="flex">
              <Tablets className="me-2 text-green-600" />
              Econochlor (chloramphenicol-oral)
            </TableCell>
            <TableCell>1-0-1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="flex">
              <PillBottle className="me-2 text-red-600" />
              Desmopressin tabs
            </TableCell>
            <TableCell>1-1-1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="flex">
              <Syringe className="me-2 text-blue-600" />
              Abciximab-injection
            </TableCell>
            <TableCell>1-1-1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
