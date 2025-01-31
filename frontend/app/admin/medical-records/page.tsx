"use client"

import { useEffect, useState } from "react"; // Importing useState and useEffect
import { Patient, columns } from "@/app/components/patient-columns";
import { DataTable } from "@/components/ui/data-table";

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Fetch patient data from the Django API or Supabase
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/patients/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Patient[] = await response.json();
        setPatients(data); // Set the fetched patient data
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []); // Empty dependency array, meaning this runs only once on mount.

  return (
    <div className="container mx-auto px-10 py-10">
      <h1 className="text-2xl">Medical Records</h1>
      <DataTable
        columns={columns}
        data={patients} // Use the patients fetched from the API or Supabase
        filterColumn="patient_id"
        filterPlaceholder="Search patient name..."
      />
    </div>
  );
}
