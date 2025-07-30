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
  const appointments = [
    {
      id: "#A003",
      doctor: "Dr. K",
      profession: "Radiologist",
      date: "June 12 2020",
      time: "9:00AM-10:00AM",
      treatment: "CT Scans",
      contact: "0912 345 6789",
      status: "Confirmed",
      location: "Grand Plains Clinic",
    },
    {
      id: "#A002",
      doctor: "Dr. K",
      profession: "Radiologist",
      date: "June 12 2020",
      time: "9:00AM-10:00AM",
      treatment: "Heart Checkup",
      contact: "0912 345 6789",
      status: "Pending",
      location: "Genesis Hospital",
    },
    {
      id: "#A001",
      doctor: "Dr. K",
      profession: "Radiologist",
      date: "June 12 2020",
      time: "9:00AM-10:00AM",
      treatment: "Diabetes",
      contact: "0912 345 6789",
      status: "Cancelled",
      location: "Genesis Laboratory",
    },
  ];

  return (
    <div className="card m-6">
      <h1 className="mb-6 font-bold">Today&apos;s Appointment</h1>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(appointments[0])
              .filter(
                (key) => key !== "id" && key !== "profession" && key !== "date"
              ) // exclude 'id'
              .map((key) => (
                <TableHead key={key} className="capitalize">
                  {key}
                </TableHead>
              ))}
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
              <TableCell
                className={`${
                  item.status === "Confirmed"
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
              <TableCell>{item.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
