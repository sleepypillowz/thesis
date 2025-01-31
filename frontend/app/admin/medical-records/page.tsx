import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Patient, columns } from "@/app/components/patient-columns";
import { DataTable } from "@/components/ui/data-table";

// Initialize Supabase client using the environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Fetch patient data from Supabase
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patient_patient") // Replace with your actual table name
          .select("*");

        if (error) {
          throw new Error(error.message);
        }

        setPatients(data || []); // Set the fetched patient data
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
        data={patients} // Use the patients fetched from Supabase
        filterColumn="patient_id"
        filterPlaceholder="Search patient name..."
      />
    </div>
  );
}
