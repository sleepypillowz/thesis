// hooks/usePatients.ts
"use client";

import { useEffect, useState } from "react";
import { getPatients } from "@/lib/api/patients";
import { Patient } from "@/components/pages/medical-records/patient-columns";

export default function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadPatients();
  }, []);

  return patients;
}
