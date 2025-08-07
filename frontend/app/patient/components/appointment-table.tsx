import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/lib/definitions";

export default function AppointmentTable({
  appointments,
}: {
  appointments: Appointment[];
}) {
  return (
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
            <TableCell>
              <Badge
                variant="outline"
                className={clsx("rounded-full", {
                  "border-green-500 text-green-500":
                    item.status === "Confirmed" || item.status === "Done",
                  "border-yellow-500 text-yellow-500":
                    item.status === "Pending",
                  "border-red-500 text-red-500": item.status === "Cancelled",
                })}
              >
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
