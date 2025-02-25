"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Update interfaces to match API response structure
interface QueueData {
  id: number;
  priority_level: string;
  status: string;
  created_at: string;
  queue_number: number;
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
  complaint: string;  // Complaint is in patient object
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

export default function TreatmentManagement() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const res = await fetch("http://localhost:8000/patient/patient-treatment-list");
        if (!res.ok) throw new Error("Failed to fetch treatments");
        const data = await res.json();
        setTreatments(data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    }
    fetchTreatments();
  }, []);

  const handleViewDetails = (id: number) => {
    router.push(`/admin/treatment-details/${id}/`);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Treatment Management</h1>
      <p className="text-lg text-gray-700">
        Manage patient treatments, add new treatments, and track ongoing
        treatments for each patient.
      </p>

      <Button className="bg-blue-500 text-white hover:bg-blue-600">
        <Link href="/admin/patient-treatment-queue">View Treatment Queueing</Link>
      </Button>

      {/* Ongoing Treatments Section */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Patient Treatment Records</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Treatment ID</th>
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-left">Complaint</th>
              <th className="px-4 py-2 text-left">Queue Number</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{treatment.id}</td>
                <td className="px-4 py-2">
                  {treatment.patient.first_name} {treatment.patient.middle_name} {treatment.patient.last_name}
                </td>
                <td className="px-4 py-2">{treatment.patient.complaint}</td>
                <td className="px-4 py-2">{treatment.patient.queue_data ? treatment.patient.queue_data.queue_number : 'N/A'}</td>
                <td className="px-4 py-2">{treatment.patient.queue_data ? treatment.patient.queue_data.status : 'N/A'}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    onClick={() => handleViewDetails(treatment.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View Details
                  </Button>
                  <Button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    Update
                  </Button>
                  <Button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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