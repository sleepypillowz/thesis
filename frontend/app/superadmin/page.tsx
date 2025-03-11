"use client";
import { useEffect, useState } from "react";
import {
  Patient,
  columns,
} from "@/components/molecules/tables/patient-columns";
import { DataTable } from "@/components/ui/data-table";
import { VisitorsChart } from "@/components/organisms/visitors-chart";
import { CommonDiseasesChart } from "@/components/organisms/common-diseases-chart";
import StatsCard from "@/components/organisms/stats-cards";
import userInfo from "@/components/hooks/userRole";

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const user = userInfo();
  useEffect(() => {
    // Fetch patient data from the Django API or Supabase with the token
    const fetchPatients = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }
        const response = await fetch("http://127.0.0.1:8000/patients/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on the search term
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.middle_name || ""} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="mb-4 space-y-4 text-center md:text-left lg:m-0">
      <div className="px-6 py-4">
      <p className="text-2xl font-bold">
        Good Day, <span className="text-blue-500">{user?.first_name}</span>
      </p>

        <p className="text-sm">
          Check out the latest updates from the past 7 days!
        </p>
      </div>

      <StatsCard />

      <div className="space-y-4 lg:mx-4 lg:flex lg:justify-center lg:space-x-4 lg:space-y-0">
        <div className="lg:w-full">
          <VisitorsChart />
        </div>

        <div className="lg:w-full lg:max-w-xs">
          <CommonDiseasesChart />
        </div>
      </div>
      <div className="container mx-auto px-10 py-10">
        <h1 className="mb-4 text-2xl">Medical Records</h1>
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patient name..."
          className="mb-4 w-full rounded border border-gray-300 p-2"
        />
        <DataTable
          columns={columns}
          data={filteredPatients}
        />
      </div>
    </div>
  );
}
