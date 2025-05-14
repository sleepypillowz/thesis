"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import {
  Patient,
  columns,
} from "@/components/molecules/tables/secretary-patient-columns";
import { DataTable } from "@/components/ui/data-table";

export default function MedicalRecords() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("patient_patient")
        .select("*");

      if (error) {
        console.error("Error fetching patients:", error);
        return;
      }

      console.log("Fetched Patients:", data); // Debugging Output

      // Ensure IDs are numbers (if Supabase returns them as strings)
      const formattedPatients = data.map((patient) => ({
        ...patient,
        id: Number(patient.id),
      }));

      setPatients(formattedPatients);
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.middle_name || ""} ${
      patient.last_name
    }`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
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
      <DataTable columns={columns} data={filteredPatients} />
    </div>
  );
}