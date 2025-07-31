import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";

export default function Page() {
  return (
    <div className="card m-6">
      <h1 className="mb-6 font-bold">Doctors</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor Name</TableHead>
            <TableHead>Department/Specialty</TableHead>
            <TableHead>On-Call Status</TableHead>
            <TableHead>Shift Time</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="flex">
              <User className="me-2 self-center rounded-full bg-muted" />
              <span>Dr. Ana Reyes</span>
            </TableCell>
            <TableCell>Internal Medicine</TableCell>
            <TableCell>On Duty</TableCell>
            <TableCell>8AM-6PM</TableCell>
            <TableCell>0917 XXX XXXX</TableCell>
            <TableCell>3rd Floor, IM Ward</TableCell>
            <TableCell>Covers emergency cases</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
