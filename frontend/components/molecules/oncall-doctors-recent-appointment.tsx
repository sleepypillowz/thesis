import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Eye, SquarePen, User } from "lucide-react";
import { Badge } from "../ui/badge";

export default function OncallDoctorsRecentAppointment() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Appointment ID</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>APT-20250629-0001</TableCell>
          <TableCell className="flex">
            <User className="me-2 self-center rounded-full bg-muted" />
            <span>John Doe</span>
          </TableCell>
          <TableCell>06/30/2025</TableCell>
          <TableCell>8:00PM</TableCell>
          <TableCell>
            <Badge
              variant="outline"
              className="rounded-full border-red-500 text-orange-500"
            >
              Scheduled
            </Badge>
          </TableCell>
          <TableCell className="flex space-x-2">
            <Eye className="cursor-pointer text-green-500 hover:fill-current" />
            <SquarePen className="cursor-pointer text-blue-500 hover:fill-current" />
            <EllipsisVertical className="cursor-pointer" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
