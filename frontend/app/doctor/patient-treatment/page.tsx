"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import userRole from "@/components/hooks/userRole";

// Update interfaces to match API response structure
interface QueueData {
  id: number;
  priority_level: string;
  status: string;
  created_at: string;
  complaint: string;
  queue_number: string;
}

interface Patient {
  patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  email: string;
  phone_number: string;
  date_of_birth: string;
  street_address: string;
  barangay: string;
  municipal_city: string;
  queue_data?: QueueData;
}

interface Diagnosis {
  diagnosis_code: string;
  diagnosis_description: string;
  diagnosis_date: string;
}

interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string;
}

interface Treatment {
  id: number;
  treatment_notes: string;
  created_at: string;
  updated_at: string;
  patient: Patient;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
}

// Helper function: given an array of treatments, return only the latest treatment for each patient
function getLatestTreatments(treatments: Treatment[]): Treatment[] {
  const latestMap: Record<string, Treatment> = {};
  treatments.forEach((treatment) => {
    const pid = treatment.patient.patient_id;
    if (
      !latestMap[pid] ||
      new Date(treatment.created_at) > new Date(latestMap[pid].created_at)
    ) {
      latestMap[pid] = treatment;
    }
  });
  return Object.values(latestMap);
}

export default function TreatmentManagement() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const router = useRouter();
  const role = userRole();

  useEffect(() => {
    async function fetchTreatments() {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/patient/patient-treatment",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch treatments");
        const data: Treatment[] = await res.json();
        // Filter treatments so only the latest treatment for each patient is retained.
        const latestTreatments = getLatestTreatments(data);
        setTreatments(latestTreatments);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    }
    fetchTreatments();
  }, []);
  if (!role || role.role !== "doctor") {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Not Authorized
      </div>
    );
  }

  const handleViewDetails = (patient_id: string) => {
    router.push(`/doctor/treatment-details/${patient_id}/`);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Treatment Management</h1>
      <p className="text-lg text-gray-700">
        Manage patient treatments, add new treatments, and track ongoing
        treatments for each patient.
      </p>

      <Button className="bg-blue-500 text-white hover:bg-blue-600">
        <Link href="/doctor/patient-treatment-queue">
          View Treatment Queueing
        </Link>
      </Button>

      {/* Ongoing Treatments Section */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Patient Monitoring</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-left">Complaint</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr
                key={`${treatment.patient.patient_id}-${treatment.id}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  {treatment.patient.first_name} {treatment.patient.middle_name}{" "}
                  {treatment.patient.last_name}
                </td>
                <td className="px-4 py-2">
                  {treatment.patient.queue_data
                    ? treatment.patient.queue_data.complaint
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {treatment.patient.queue_data
                    ? treatment.patient.queue_data.status
                    : "N/A"}
                </td>
                <td className="space-x-2 px-4 py-2">
                  <Button
                    onClick={() =>
                      handleViewDetails(treatment.patient.patient_id)
                    }
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    View Details
                  </Button>
                  <Button
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                    onClick={() =>
                      router.push(
                        `/doctor/patient-treatment-form/${treatment.patient.patient_id}/${treatment.patient.queue_data?.queue_number}`
                      )
                    }
                  >
                    Update
                  </Button>
                  <Button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Treatment Section */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Add New Treatment</h2>
        <form className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg">Patient Name</label>
            <input
              type="text"
              placeholder="Enter Patient Name"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Diagnosis</label>
            <input
              type="text"
              placeholder="Enter Diagnosis"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Start Date</label>
            <input type="date" className="w-2/3 rounded-md border p-2" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Treatment Plan</label>
            <textarea
              className="w-2/3 rounded-md border p-2"
              placeholder="Enter Treatment Plan"
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Doctor</label>
            <select className="w-2/3 rounded-md border p-2">
              <option>Select Doctor</option>
              <option>Dr. Brown</option>
              <option>Dr. Williams</option>
              <option>Dr. Lee</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button className="bg-green-500 text-white hover:bg-green-600">
              Add Treatment
            </Button>
          </div>
        </form>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          Search and Filter Treatments
        </h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Patient Name"
            className="w-1/3 rounded-md border p-2"
          />
          <input
            type="text"
            placeholder="Search by Diagnosis"
            className="w-1/3 rounded-md border p-2"
          />
          <select className="w-1/3 rounded-md border p-2">
            <option>Filter by Doctor</option>
            <option>Dr. Brown</option>
            <option>Dr. Williams</option>
            <option>Dr. Lee</option>
          </select>
          <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
