"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { FormEvent } from "react";

interface Patient {
  first_name: string;
  last_name: string;
}

interface PreliminaryAssessment {
  blood_pressure: string;
  temperature: string;
  heart_rate: string;
  respiratory_rate: string;
  pulse_rate: string;
  allergies: string;
  medical_history: string;
  symptoms: string;
  current_medications: string;
  pain_scale: string;
  pain_location: string;
  smoking_status: string;
  alcohol_use: string;
  assessment: string;
  created_at?: string;
  updated_at?: string;
  patient_id?: string;
  queue_number?: string;
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

interface ApiResponse {
  patient: Patient;
  preliminary_assessment: PreliminaryAssessment;
}

export default function TreatmentForm() {
  const params = useParams();
  const { patient_id, queue_number } = params as {
    patient_id: string;
    queue_number: string;
  };

  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessment, setAssessment] = useState<PreliminaryAssessment | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    { diagnosis_code: "", diagnosis_description: "", diagnosis_date: "" },
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { medication: "", dosage: "", frequency: "", start_date: "", end_date: "" },
  ]);

  const [treatmentNotes, setTreatmentNotes] = useState("");

  useEffect(() => {
    if (!patient_id || !queue_number) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/patient/patient-preliminary-assessment/${patient_id}/${queue_number}/`
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setPatient(data.patient);
        setAssessment(data.preliminary_assessment);
        setError(null);
      } catch (err) {
        setError("Failed to load patient data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patient_id, queue_number]);

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const treatmentData = {
      treatment_notes: treatmentNotes,
      patient_id,
      diagnoses: diagnoses.filter(
        (d) => d.diagnosis_code && d.diagnosis_description && d.diagnosis_date
      ),
      prescriptions: prescriptions.filter(
        (p) =>
          p.medication && p.dosage && p.frequency && p.start_date && p.end_date
      ),
    };

    console.log("Data to serialize (JSON):", treatmentData);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/queueing/patient-treatment/${patient_id}/${queue_number}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(treatmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit treatment");
      }

      alert("Treatment submitted successfully!");

      // Reset form fields
      setDiagnoses([
        { diagnosis_code: "", diagnosis_description: "", diagnosis_date: "" },
      ]);
      setPrescriptions([
        {
          medication: "",
          dosage: "",
          frequency: "",
          start_date: "",
          end_date: "",
        },
      ]);
      setTreatmentNotes("");
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to submit treatment"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-medium text-gray-600">
          Loading patient data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-medium text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-lg backdrop-blur-lg">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Patient Treatment Form {patient?.first_name} {patient?.last_name}
      </h2>
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700">
          Queue Number:{" "}
          <span className="font-bold text-blue-600">{queue_number}</span>
        </h4>
      </div>

      {assessment && (
        <div className="mb-6 rounded-lg border bg-blue-50 p-4">
          <h3 className="mb-3 text-xl font-semibold text-gray-800">
            Preliminary Assessment
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p>
                <span className="font-medium">Blood Pressure:</span>{" "}
                {assessment.blood_pressure || "N/A"}
              </p>
              <p>
                <span className="font-medium">Temperature:</span>{" "}
                {assessment.temperature || "N/A"}
              </p>
              <p>
                <span className="font-medium">Heart Rate:</span>{" "}
                {assessment.heart_rate || "N/A"}
              </p>
              <p>
                <span className="font-medium">Respiratory Rate:</span>{" "}
                {assessment.respiratory_rate || "N/A"}
              </p>
              <p>
                <span className="font-medium">Pulse Rate:</span>{" "}
                {assessment.pulse_rate || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Allergies:</span>{" "}
                {assessment.allergies || "N/A"}
              </p>
              <p>
                <span className="font-medium">Medical History:</span>{" "}
                {assessment.medical_history || "N/A"}
              </p>
              <p>
                <span className="font-medium">Symptoms:</span>{" "}
                {assessment.symptoms || "N/A"}
              </p>
              <p>
                <span className="font-medium">Current Medications:</span>{" "}
                {assessment.current_medications || "N/A"}
              </p>
              <p>
                <span className="font-medium">Pain Scale:</span>{" "}
                {assessment.pain_scale || "N/A"}
              </p>
              <p>
                <span className="font-medium">Pain Location:</span>{" "}
                {assessment.pain_location || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Submit Treatment
        </button>
      </form>
    </div>
  );
}
