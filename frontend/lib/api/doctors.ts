import { Appointment } from "@/components/shared/appointment-columns";

export async function getAppointments(): Promise<Appointment[]> {
  const accessToken = localStorage.getItem("access");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/doctor`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  const appointments: Appointment[] = await response.json();

  // Optional: sort by created_at if available
  return appointments.sort((a, b) => {
    const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bDate - aDate; // newest first
  });
}
