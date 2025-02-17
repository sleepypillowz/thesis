"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define the expected structure for patient data.
interface Patient {
  first_name: string;
  last_name: string;
  // Add additional fields if needed.
}

// Define the structure for form input values based on your Django model.
interface FormData {
  temperature: string;
  heart_rate: string;
  blood_pressure: string;
  respiratory_rate: string;
  pulse_rate: string;
  allergies: string;
  medical_history: string;
  symptoms: string;
  current_medications: string;
  current_symptoms: string;
  pain_scale: string;
  pain_location: string;
  smoking_status: string;
  alcohol_use: string;
}

export default function PreliminaryAssessmentPage() {
  // Extract parameters from the URL.
  const params = useParams();
  const { patient_id, queue_number } = params as { patient_id: string; queue_number: string };

  // State to hold fetched patient data.
  const [patient, setPatient] = useState<Patient | null>(null);

  // State for the form data.
  const [formData, setFormData] = useState<FormData>({
    temperature: "",
    heart_rate: "",
    blood_pressure: "",
    respiratory_rate: "",
    pulse_rate: "",
    allergies: "",
    medical_history: "",
    symptoms: "",
    current_medications: "",
    current_symptoms: "",
    pain_scale: "",
    pain_location: "",
    smoking_status: "non-smoker",
    alcohol_use: "none",
  });

  useEffect(() => {
    if (!patient_id || !queue_number) return;

    const apiUrl = `http://127.0.0.1:8000/queueing/patient-preliminary-assessment/${patient_id}/${queue_number}/`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched patient data:", data);
        setPatient(data);
      })
      .catch((error) => console.error("Error fetching patient:", error));
  }, [patient_id, queue_number]);

  // Handle changes for form inputs.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient_id || !queue_number) return;

    const apiUrl = `http://127.0.0.1:8000/queueing/patient-preliminary-assessment/${patient_id}/${queue_number}/`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }
      alert("Assessment submitted successfully!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
  };

  if (!patient) {
    return <div>Loading patient data...</div>;
  }

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          Preliminary Assessment for {patient.first_name} {patient.last_name}
        </h2>
        <p className="text-gray-600"><strong>Patient ID:</strong> {patient_id}</p>
        <p className="text-gray-600 mb-4"><strong>Queue Number:</strong> {queue_number}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vital Signs */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700">Vital Signs</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Temperature (°C)</label>
                <input type="number" name="temperature" step="0.1" required className="w-full rounded-md border-gray-300 p-2" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-gray-600">Heart Rate (bpm)</label>
                <input type="number" name="heart_rate" required className="w-full rounded-md border-gray-300 p-2" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-gray-600">Blood Pressure (mmHg)</label>
                <input type="text" name="blood_pressure" placeholder="e.g., 120/80" required className="w-full rounded-md border-gray-300 p-2" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-gray-600">Respiratory Rate (breaths/min)</label>
                <input type="number" name="respiratory_rate" required className="w-full rounded-md border-gray-300 p-2" onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          {/* Medical Information */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700">Medical Information</legend>
            <div className="grid grid-cols-1 gap-4">
              <textarea name="allergies" placeholder="Allergies" className="w-full rounded-md border-gray-300 p-2" onChange={handleChange} />
              <textarea name="medical_history" placeholder="Medical History" className="w-full rounded-md border-gray-300 p-2" onChange={handleChange} />
              <textarea name="symptoms" placeholder="Symptoms" className="w-full rounded-md border-gray-300 p-2" onChange={handleChange} />
            </div>
          </fieldset>

          {/* Lifestyle Information */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700">Lifestyle</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Smoking Status</label>
                <select name="smoking_status" className="w-full rounded-md border-gray-300 p-2" onChange={handleChange}>
                  <option value="non-smoker">Non-smoker</option>
                  <option value="smoker">Smoker</option>
                  <option value="former-smoker">Former Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Alcohol Use</label>
                <select name="alcohol_use" className="w-full rounded-md border-gray-300 p-2" onChange={handleChange}>
                  <option value="none">None</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="frequently">Frequently</option>
                </select>
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

