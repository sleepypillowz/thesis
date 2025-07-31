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
import { EllipsisVertical, Eye, SquarePen, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Typescript Definition which defines the shape or structure of the patient object
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
  // useState is data that changes
  // patients is the state variable and setPatients is the function used to update it
  // the useState<Patient[]>([]); tells typescript is an array of Patient objects, and it starts as an empty array."
  const [patients, setPatients] = useState<Patient[]>([]);
  // searchTerm is the state variable which holds what the user typed and setSearchTerm is the function used to update it
  // the useState(""); tells typescript it starts of as an empty string
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch patient data from the API
  // this runs once on mount cause of the empty array
  useEffect(() => {
    // async allows you to fetch data without blocking the entire system this returns a promise
    // await tells it to pause execution til the promise resolves
    const fetchPatients = async () => {
      // access token of the user which checks if the user is logged in the right account
      const accessToken = localStorage.getItem("access");
      const response = await fetch(
        // this is the url where the data is, this becomes http://localhost:8000/api/patients/
        `${process.env.NEXT_PUBLIC_API_BASE}/patients/`,
        {
          method: "GET",
          headers: {
            // This request is coming from a logged-in user — here’s their token."
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // : Patient[]: this is a typescript annotation saying: "I expect data to be an array of Patient objects."
      // .json() converts the json to js object
      const data: Patient[] = await response.json();
      setPatients(data);
    };

    // run the function
    fetchPatients();
    // [] is a dependency array and when its empty it tells the function to only run once (which is on first load or reload)
    // you can also change the dependency to [value] (userId) so whenever the value changes it updates but it doesn't require a refresh
  }, []);

  // Filter patients based on search term and by date
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

  // Only slice if we are on the dashboard
  const displayedPatients =
    pathname === "/doctor" || pathname === "/secretary" || pathname === "/admin"
      ? filteredPatients.slice(0, 5)
      : filteredPatients;

  return (
    <div className="card m-6">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="mr-4 font-bold">Medical Records</h1>
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
            // Get the latest queue entry
            const latestQueue = item.queue_data?.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

            return (
              <TableRow key={item.patient_id}>
                <TableCell>{item.patient_id}</TableCell>
                <TableCell className="flex">
                  <User className="me-2 self-center rounded-full bg-muted" />
                  <span>
                    {`${item.first_name} ${item.middle_name || ""} ${
                      item.last_name
                    }`.trim()}
                  </span>
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
