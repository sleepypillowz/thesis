"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import {
  Medicine,
  columns,
} from "@/components/molecules/tables/medicine-columns";
import { DataTable } from "@/components/ui/data-table";

export default function Page() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      const { data, error } = await supabase
        .from("medicine_medicine")
        .select("*");

      if (error) {
        console.error("Error fetching medicines:", error);
        return;
      }

      console.log("Fetched Medicines:", data); // Debugging Output

      // Ensure IDs are numbers (if Supabase returns them as strings)
      const formattedMedicines = data.map((medicine) => ({
        ...medicine,
        id: Number(medicine.id),
      }));

      setMedicines(formattedMedicines);
    };

    fetchMedicines();
  }, []);

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-10 py-10">
      <h1 className="mb-4 text-2xl">Medicines</h1>
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search medicine..."
        className="mb-4 w-full rounded border border-gray-300 p-2"
      />
      <DataTable columns={columns} data={filteredMedicines} />
    </div>
  );
}
