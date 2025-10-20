'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FaPenToSquare,
  FaFile,
  FaUser,
  FaNotesMedical,
  FaPrescription,
  FaRegCalendarCheck,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from 'date-fns';

interface PatientInfo {
  patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  age?: number;
  queue_data: QueueData;
  appointments: Appointments[];
  treatment: TreatmentRecord;
}
interface QueueData {
  complaint: string;
  created_at: string;
}
interface Appointments {
  appointment_date: string;
  status: string;
  doctor_id: number;
  doctor_name: string;
  reason: string;
}
interface TreatmentRecord {
  id: number;
  treatment_notes: string;
  created_at: string;
  updated_at: string;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
}
interface Diagnosis {
  diagnosis_description: string;
}
// ─── Prescription Interface ─────────────────────────────────────────────────
interface Prescription {
  id: number;
  dosage: string;           // e.g. "954 mg"
  frequency: string;        // e.g. "Twice a day"
  quantity: number;         // e.g. 40
  start_date: string;       // ISO date, e.g. "2025-04-19"
  end_date: string;         // ISO date, e.g. "2025-04-30"
  patient_id: string;
  medication_id: number;
  medicine_medicine: {      // nested medicine record
    id: number;
    name: string;           // e.g. "Cefcillin"
  };
}

// ─── TreatmentRecord Interface ────────────────────────────────────────────────
interface TreatmentRecord {
  id: number;
  treatment_notes: string;
  created_at: string;
  updated_at: string;
  diagnoses: Diagnosis[];             // unchanged
  prescriptions: Prescription[];      // now uses the updated Prescription
}

// ─── PatientInfo Interface ───────────────────────────────────────────────────
interface PatientInfo {
  patient_id: string;
  /* …other fields… */
  treatment: TreatmentRecord;
  // remove any previous “prescriptions” array here; the nested TreatmentRecord now holds them
}


export default function Page() {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const { patient_id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }
        if (!patient_id) {
          console.error("No patient ID found");
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/patient/patient-info/${patient_id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include'
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        console.log("patient id:", patient_id);
        console.log(json);
        // Populate patient and appointments separately
        setPatient({
          ...json.patient,
          treatment: json.latest_treatment,     // “treatment” now points at “latest_treatment”
        });
        setAppointments(json.appointments);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };

    fetchPatient();
  }, [patient_id]);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between border-b pb-8">
          {/* Left: Title */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Patient Profile
            </h1>
            <p className="mt-2 text-lg font-medium">
              Medical records and health information
            </p>
          </div>

          {/* Right: Action Buttons */}
        <div className="flex items-center gap-4">
          <Link href={`/doctor/patient-report/${patient_id}`} passHref>
            <Button
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <FaFile className="h-4 w-4" />
              Reports
            </Button>
          </Link>

            {/* Edit Profile: neutral outline */}
            <Button
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaPenToSquare className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>



        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Personal Information Card */}
            <div className="card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100">
                  <FaUser className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-normal">
                    {patient
                      ? `${patient.first_name} ${patient.middle_name} ${patient.last_name}`
                      : "Loading..."}
                  </h2>
                  <p className="font-medium">
                    {patient?.gender} • {patient?.age} years •{" "}
                    {patient?.date_of_birth &&
                      new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(patient.date_of_birth))}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-4 border-r pr-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    CONTACT
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-base font-medium">
                      <span>📞</span>
                      {patient ? patient.phone_number : "Loading..."}
                    </p>
                    <p className="flex items-center gap-2 text-base font-medium">
                      <span>✉️</span>
                      {patient ? patient.email : "Loading..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pl-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    MEDICAL DETAILS
                  </h3>
                  <div className="space-y-2">
                    <p className="text-base">
                      <span className="font-semibold">Last Visit:</span>{" "}
                      {patient?.queue_data.created_at
                        ? format(
                            new Date(patient.queue_data.created_at),
                            "MMMM d, yyyy, h:mm a"
                          )
                        : "N/A"}
                    </p>
                    <p className="text-base">
                      <span className="font-semibold">Complaint:</span>{" "}
                      {patient?.queue_data.complaint || "N/A"}
                    </p>
                    <p className="text-base">
                      <span className="font-semibold">Diagnosis:</span>{" "}
                      Diabetes
                    </p>
                    <p className="text-base">
                      <span className="font-semibold">Allergies:</span>{" "}
                      Penicillin, Pollen
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Card */}
            <div className="card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                  <FaRegCalendarCheck className="h-6 w-6 text-green-600" />
                  Appointments
                </h2>
                <Link
                  href="/patient/appointments"
                  className="flex items-center gap-2 text-sm font-medium text-blue-600"
                >
                  View All
                  <FaPenToSquare className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                  {(appointments ?? []).length > 0 ? (
                    (appointments ?? []).map((appt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border-2 p-4 transition-colors"
                    >
                      <div>
                        <h3 className="text-base font-semibold">
                          {appt.reason}
                        </h3>
                        <p className="text-sm font-medium">
                          Dr. {appt.doctor_name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          Status: {appt.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold">
                          {format(
                            new Date(appt.appointment_date),
                            "MMMM d, yyyy"
                          )}
                        </p>
                        <p className="text-sm font-medium">
                          {format(
                            new Date(appt.appointment_date),
                            "h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No appointments found.
                  </p>
                )}
              </div>
            </div>

{/* Prescriptions Card */}
<div className="card rounded-xl border p-6 shadow-sm">
  <div className="flex items-center justify-between border-b pb-4">
    <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
      <FaPrescription className="h-6 w-6 text-purple-600" />
      Prescriptions
    </h2>
    <Link
      href="/patient/prescriptions"
      className="flex items-center gap-2 text-sm font-medium text-blue-600"
    >
      View All
      <FaPenToSquare className="h-4 w-4" />
    </Link>
  </div>

  <div className="mt-6 overflow-x-auto">
    <table className="w-full">
      <thead className="border-b">
        <tr className="text-left text-sm font-semibold tracking-wide">
          <th className="pb-3">Medication</th>
          <th className="pb-3">Dosage</th>
          <th className="pb-3">Frequency</th>
          <th className="pb-3">Duration</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {/*
          Use optional chaining on treatment and prescriptions,
          then default to an empty array to safely map.
        */}
        {(patient?.treatment?.prescriptions ?? []).map((pres, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="py-3 text-base font-medium">
              {pres.medicine_medicine?.name}
            </td>
            <td className="py-3 text-base">{pres.dosage}</td>
            <td className="py-3 text-base">{pres.frequency}</td>
            <td className="py-3 text-base">
              {format(new Date(pres.start_date), 'MMM d, yyyy')} –{' '}
              {format(new Date(pres.end_date),   'MMM d, yyyy')}
            </td>
          </tr>
        ))}
        {((patient?.treatment?.prescriptions ?? []).length === 0) && (
          <tr>
            <td
              colSpan={4}
              className="py-3 text-center text-gray-500"
            >
              No prescriptions found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Medical History Card */}
            <div className="card rounded-xl border border-l-4 border-orange-500 p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 border-b pb-4 text-xl font-semibold tracking-tight">
                <FaNotesMedical className="h-6 w-6 text-orange-600" />
                Health Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    MEDICAL HISTORY
                  </h3>
                  <p className="mt-2 text-base leading-relaxed">
                    Hypertension (1998), Hyperlipidemia (2000), Appendectomy
                    (1985)
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    FAMILY HISTORY
                  </h3>
                  <p className="mt-2 text-base leading-relaxed">
                    Father: Heart disease, Mother: Type 2 Diabetes
                  </p>
                </div>
              </div>
            </div>

            {/* Lab Results Card */}
            <div className="card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                  <FaFile className="h-6 w-6 text-red-600" />
                  Lab Results
                </h2>
                <Link
                  href="#"
                  className="border-b border-transparent text-sm font-medium text-blue-600"
                >
                  View All
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-lg border-2 p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaFile className="h-5 w-5" />
                      <span className="text-base font-medium">
                        Lab Result #{item}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Card */}
            <div className="card">
              <h2 className="mb-4 text-xl font-semibold tracking-tight">
                Clinical Notes
              </h2>
              <div className="space-y-3">
                <p className="text-base font-medium">
                  Diagnosis: Type 2 Diabetes
                </p>
                <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed">
                  <li>Diet and exercise counseling recommended</li>
                  <li>Follow up in 2 weeks for blood glucose monitoring</li>
                  <li>Consider medication adjustment if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
