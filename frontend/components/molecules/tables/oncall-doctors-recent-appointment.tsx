import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Eye, SquarePen, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OncallDoctorsRecentAppointment() {
  const test = [
    {
      id: "APT-20250629-0001",
      name: "John Deo",
      date: "2/25/18",
      time: "09:00",
      status: "Scheduled",
      color: "orange",
    },
    {
      id: "APT-20250629-0002",
      name: "John Deo",
      date: "2/25/18",
      time: "09:00",
      status: "Scheduled",
      color: "orange",
    },
    {
      id: "APT-20250629-0003",
      name: "John Deo",
      date: "2/25/18",
      time: "09:00",
      status: "Scheduled",
      color: "orange",
    },
  ];

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
        {test.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell className="flex">
              <User className="me-2 self-center rounded-full bg-muted" />
              <span>{item.name}</span>
            </TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`rounded-full border-${item.color}-500 text-${item.color}-500`}
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="flex space-x-2">
              <Eye className="cursor-pointer text-green-500 hover:fill-current" />
              <SquarePen className="cursor-pointer text-blue-500 hover:fill-current" />
              <EllipsisVertical className="cursor-pointer" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
