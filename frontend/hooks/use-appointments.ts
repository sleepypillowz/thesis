// hooks/useappointments.ts
"use client";

import { useEffect, useState } from "react";
import { getAppointments } from "@/lib/api/appointments";
import { Appointment } from "@/components/molecules/tables/appointment-columns";

export default function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadAppointments();
  }, []);

  return appointments;
}
