import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function OncallDoctorsRecentAppointment() {
  const appointments = [
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
      status: "Pending",
      color: "orange",
    },
    {
      id: "APT-20250629-0003",
      name: "John Deo",
      date: "2/25/18",
      time: "09:00",
      status: "Cancelled",
      color: "orange",
    },
  ];

  return (
    <div className="card col-span-2">
      <div className="flex justify-between">
        <span className="mb-6 font-bold">Recent Appointments</span>
        <Link
          href="/oncall-doctors/appointments"
          className="font-bold text-blue-500 hover:underline"
        >
          View All
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Appointment ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((item) => (
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
                  className={`rounded-full ${
                    item.status === "Cancelled"
                      ? "border-red-500 text-red-500"
                      : item.status === "Pending"
                      ? "border-yellow-500 text-yellow-500"
                      : "border-green-500 text-green-500"
                  }`}
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
