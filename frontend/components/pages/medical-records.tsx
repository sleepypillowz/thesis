"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EllipsisVertical, Eye, SquarePen, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Patient = {
  patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  queue_data: {
    created_at: string;
    status: string;
    complaint: string;
  }[];
};

export default function MedicalRecords() {
  const pathname = usePathname();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(
        // this is the url where the data is, this becomes http://localhost:8000/api/patients/
        `${process.env.NEXT_PUBLIC_API_BASE}/patients/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data: Patient[] = await response.json();
      setPatients(data);
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients
    .filter((patient) =>
      `${patient.first_name} ${patient.middle_name || ""} ${patient.last_name}`
        .toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const latestA = a.queue_data?.sort(
        (x, y) =>
          new Date(y.created_at).getTime() - new Date(x.created_at).getTime()
      )[0]?.created_at;

      const latestB = b.queue_data?.sort(
        (x, y) =>
          new Date(y.created_at).getTime() - new Date(x.created_at).getTime()
      )[0]?.created_at;

      return (
        new Date(latestB || 0).getTime() - new Date(latestA || 0).getTime()
      );
    });

  const displayedPatients =
    pathname === "/doctor" || pathname === "/secretary" || pathname === "/admin"
      ? filteredPatients.slice(0, 5)
      : filteredPatients;

  return (
    <div className="card">
      <div className="flex flex-row items-center space-x-2">
        <div className="flex">
          <Users className="me-2 text-primary" />
          <h1 className="mr-4 font-bold">Medical Records</h1>
        </div>

        <Input
          type="text"
          placeholder="Search"
          className="max-w-40 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader className="px-0">
          <TableRow>
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
          {displayedPatients.map((item) => {
            const latestQueue = item.queue_data?.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

            return (
              <TableRow key={item.patient_id}>
                <TableCell>{item.patient_id}</TableCell>
                <TableCell>
                  {`${item.first_name} ${item.middle_name || ""} ${
                    item.last_name
                  }`.trim()}
                </TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell>
                  {latestQueue
                    ? new Date(latestQueue.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {latestQueue ? latestQueue.complaint : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`rounded-full ${
                      latestQueue.status === "Completed" ||
                      latestQueue.status === "Queued for Treatment"
                        ? "border-green-500 text-green-500"
                        : latestQueue.status === "Waiting"
                        ? "border-yellow-500 text-yellow-500"
                        : ""
                    }
              `}
                  >
                    {latestQueue.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Link href={`/doctor/patient-information/${item.patient_id}`}>
                    <Eye className="cursor-pointer text-green-500 hover:fill-current" />
                  </Link>
                  <Link href="/doctor/medical-records">
                    <SquarePen className="cursor-pointer text-blue-500 hover:fill-current" />
                  </Link>
                  <EllipsisVertical className="cursor-pointer" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
