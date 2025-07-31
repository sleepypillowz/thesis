import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";

type Appointment = {
  id: string;
  doctor: string;
  profession: string;
  date: string;
  time: string;
  treatment: string;
  contact: string;
  location: string;
  status: string;
};

export default function AppointmentTable({
  appointments,
  title,
}: {
  appointments: Appointment[];
  title: string;
}) {
  return (
    <div className="card m-6">
      <h1 className="mb-6 font-bold">{title}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex">
                <User className="me-2 self-center rounded-full bg-muted" />
                <div className="flex flex-col">
                  <span>{item.doctor}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.profession}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{item.date}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </TableCell>
              <TableCell>{item.treatment}</TableCell>
              <TableCell>{item.contact}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell
                className={`${
                  item.status === "Confirmed" || item.status === "Done"
                    ? "border-green-500 text-green-500"
                    : item.status === "Pending"
                    ? "border-yellow-500 text-yellow-500"
                    : item.status === "Cancelled"
                    ? "border-red-500 text-red-500"
                    : ""
                }
              `}
              >
                {item.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
