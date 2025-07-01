import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, SquarePen, Trash } from "lucide-react";

export default function DoctorRecentPatients() {
  return (
    <div className="card">
      <h1 className="font-bold">Prescription</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Patient ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Complaint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>6ND1F8G3</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>04/03/2016</TableCell>
            <TableCell>$40</TableCell>
            <TableCell>10%</TableCell>
            <TableCell>$5</TableCell>
            <TableCell>$39</TableCell>
            <TableCell className="flex space-x-2">
              <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
              <SquarePen className="h-5 w-5 cursor-pointer text-blue-500 hover:fill-current" />
              <Trash className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
