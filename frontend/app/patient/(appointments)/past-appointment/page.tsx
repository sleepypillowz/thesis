import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, CircleCheck } from "lucide-react";

export default function Page() {
  const appointments = [
    {
      id: 1,
      name: "Dr. Cara Stevens",
      profession: "Radiologist",
      date: "June 12, 2020",
      time: "9:00AM-10:00AM",
      type: "CT Scans",
      number: "0912 345 6789",
    },
    {
      id: 2,
      name: "Dr. Cara Stevens",
      profession: "Radiologist",
      date: "June 12, 2020",
      time: "9:00AM-10:00AM",
      type: "Heart Checkup",
      number: "0912 345 6789",
    },
    {
      id: 3,
      name: "Dr. Cara Stevens",
      profession: "Radiologist",
      date: "June 12, 2020",
      time: "9:00AM-10:00AM",
      type: "Diabetes",
      number: "0912 345 6789",
    },
  ];

  return (
    <div className="card m-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex">
                <User className="me-2 self-center rounded-full bg-muted" />
                <div className="flex flex-col">
                  <span>{item.name}</span>
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
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>
                <CircleCheck className="text-green-500" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
