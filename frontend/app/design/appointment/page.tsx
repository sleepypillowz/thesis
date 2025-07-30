"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Eye, SquarePen, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatetimePicker } from "@/components/ui/extension/datetime-picker";

export default function OncallDoctorsRecentAppointment() {
  const [searchTerm, setSearchTerm] = useState("");

  const appointments = [
    {
      id: 1,
      name: "John Doe",
      date: "06/30/2023",
      time: "8:00PM",
      mobile: "1234567890",
      gender: "Male",
      status: "Scheduled",
      disease: "Fever",
      lastVisit: "09/01/2024",
    },
    {
      id: 2,
      name: "Jane Doe",
      date: "06/30/2024",
      time: "8:00PM",
      mobile: "1234567890",
      gender: "Female",
      status: "Pending",
      disease: "Flu",
      lastVisit: "09/01/2024",
    },
    {
      id: 3,
      name: "John Wick",
      date: "06/30/2025",
      time: "8:00PM",
      mobile: "1234567890",
      gender: "Male",
      status: "Cancelled",
      disease: "Depression",
      lastVisit: "09/01/2024",
    },
  ];

  const filteredAppointments = appointments.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card m-6">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="mr-4 font-bold">Appointments</h1>
        <Input
          type="text"
          placeholder="Search"
          className="max-w-40 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Disease</TableHead>
            <TableHead>Last Visit Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAppointments.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex">
                <User className="me-2 self-center rounded-full bg-muted" />
                <span>{item.name}</span>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.mobile}</TableCell>
              <TableCell>{item.gender}</TableCell>
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
              <TableCell>{item.disease}</TableCell>
              <TableCell>{item.lastVisit}</TableCell>
              <TableCell className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Eye className="cursor-pointer text-green-500 hover:fill-current" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{item.name}</DialogTitle>
                      <ul className="list-disc space-y-1 pl-5 text-xs">
                        <li>
                          <strong>Reason for Referral:</strong> ENT assessment
                          for chronic sinusitis
                        </li>
                        <li>
                          <strong>Referring Doctor:</strong> Doctor Johnny
                        </li>
                        <li>
                          <strong>Receiving Doctor:</strong> Doctor Sins
                        </li>
                        <li>
                          <strong>Additional Notes:</strong> Patient reports
                          ongoing nasal congestion and sinus pressure
                        </li>
                      </ul>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <SquarePen className="cursor-pointer text-blue-500 hover:fill-current" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{item.name}</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when
                          you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <h2>Appointment Date</h2>
                      <DatetimePicker
                        format={[
                          ["months", "days", "years"],
                          ["hours", "minutes", "am/pm"],
                        ]}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type="submit">Save changes</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
                <EllipsisVertical className="cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
