import { Patient } from "@/components/pages/medical-records/patient-columns";

export async function getPatients(): Promise<Patient[]> {
  const accessToken = localStorage.getItem("access");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/patients/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  const data = await response.json();

  // Some APIs wrap data in { results: [...] }
  const patients: Patient[] = Array.isArray(data) ? data : data.results ?? [];

  // sort by the latest created_at in queue_data
  return [...patients].sort((a, b) => {
    const aDate =
      a.queue_data?.length > 0
        ? new Date(a.queue_data[a.queue_data.length - 1].created_at).getTime()
        : 0;
    const bDate =
      b.queue_data?.length > 0
        ? new Date(b.queue_data[b.queue_data.length - 1].created_at).getTime()
        : 0;

    return bDate - aDate; // newest first
  });
}
