"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import userRole from "@/components/hooks/userRole";
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
  pain_scale: string;
  pain_location: string;
  smoking_status: string;
  alcohol_use: string;
  assessment: string;
}

export default function PreliminaryAssessmentPage() {
  // Extract parameters from the URL.
  const params = useParams();
  const { patient_id, queue_number } = params as {
    patient_id: string;
    queue_number: string;
  };

  // State to hold fetched patient data.
  const [patient, setPatient] = useState<Patient | null>(null);
  // Modal
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
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
    pain_scale: "",
    pain_location: "",
    smoking_status: "non-smoker",
    alcohol_use: "none",
    assessment: "",
  });
  const role = userRole();
  useEffect(() => {
    if (!patient_id || !queue_number) return;
    const token = localStorage.getItem("access");
    const apiUrl = `http://127.0.0.1:8000/queueing/patient-preliminary-assessment/${patient_id}/${queue_number}/`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      const token = localStorage.getItem("access");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
  };

  if (!patient) {
    return <div>Loading patient data...</div>;
  }
  if (!role || role.role !== "secretary") {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Not Authorized
      </div>
    );
  }
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          Preliminary Assessment for {patient.first_name} {patient.last_name}
        </h2>
        <p className="text-gray-600">
          <strong>Patient ID:</strong> {patient_id}
        </p>
        <p className="mb-4 text-gray-600">
          <strong>Queue Number:</strong> {queue_number}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vital Signs */}
          <fieldset className="rounded-lg border border-gray-300 p-4">
            <legend className="text-lg font-semibold text-gray-700">
              Vital Signs
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-gray-600">Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  step="0.1"
                  required
                  className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-600">Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="heart_rate"
                  required
                  className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-600">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  name="blood_pressure"
                  placeholder="e.g., 120/80"
                  required
                  className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-600">
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="number"
                  name="respiratory_rate"
                  required
                  className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          {/* Medical Information */}
          <fieldset className="relative rounded-lg border border-gray-300 p-4">
            <legend className="text-lg font-semibold text-gray-700">
              Medical Information
            </legend>
            <div className="grid grid-cols-1 gap-4">
              {/* Allergies */}
              <div className="relative">
                <textarea
                  name="allergies"
                  id="allergies"
                  className="peer w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                  onChange={handleChange}
                />
                <label
                  htmlFor="allergies"
                  className="absolute left-3 top-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:px-1 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Allergies
                </label>
              </div>

              {/* Medical History */}
              <div className="relative">
                <textarea
                  name="medical_history"
                  id="medical_history"
                  className="peer w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                  onChange={handleChange}
                />
                <label
                  htmlFor="medical_history"
                  className="absolute left-3 top-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:px-1 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Medical History
                </label>
              </div>

              {/* Current Medications */}
              <div className="relative">
                <textarea
                  name="current_medications"
                  id="current_medications"
                  className="peer w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                  onChange={handleChange}
                />
                <label
                  htmlFor="current_medications"
                  className="absolute left-3 top-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:px-1 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Current Medications
                </label>
              </div>

              {/* Symptoms */}
              <div className="relative">
                <textarea
                  name="symptoms"
                  id="symptoms"
                  className="peer w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                  onChange={handleChange}
                />
                <label
                  htmlFor="symptoms"
                  className="absolute left-3 top-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:px-1 peer-focus:text-sm peer-focus:text-blue-600"
                >
                  Symptoms
                </label>
              </div>
            </div>
          </fieldset>

          {/* Lifestyle Information */}
          <fieldset className="rounded-lg border border-gray-300 p-4">
            <legend className="text-lg font-semibold text-gray-700">
              Lifestyle
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-gray-600">Smoking Status</label>
                <select
                  name="smoking_status"
                  className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                >
                  <option value="non-smoker">Non-smoker</option>
                  <option value="smoker">Smoker</option>
                  <option value="former-smoker">Former Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Alcohol Use</label>
                <select
                  name="alcohol_use"
                  className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="frequently">Frequently</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Assessment */}
          <fieldset className="rounded-lg border border-gray-300 p-4">
            <legend className="text-lg font-semibold text-gray-700">
              Assessment
            </legend>
            <textarea
              name="assessment"
              id="assessment"
              className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the assessment here"
              onChange={handleChange}
            />

            {/* Pain Scale */}
            <div>
              <label className="block text-gray-600">Pain Scale (1-10)</label>
              <input
                type="number"
                name="pain_scale"
                min="1"
                max="10"
                className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            {/* Pain Location */}
            <div>
              <label className="block text-gray-600">Pain Location</label>
              <input
                type="text"
                name="pain_location"
                className="w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-1/3 rounded-lg bg-white p-4">
              <h2 className="text-xl font-semibold">Submitted Successfully!</h2>
              <div className="mt-4 flex justify-around">
                <button
                  className="text-blue-500"
                  onClick={() => {
                    setShowModal(false);
                    router.push("/doctor/patient-assessment-queue");
                    //setFormData({ ...formData, priority: "Regular" });  // reset priority explicitly
                  }}
                >
                  Go to Assessment Queue
                </button>
                <button
                  className="text-blue-500"
                  onClick={() =>
                    router.push("/doctor/patient-registration-queue")
                  }
                >
                  Go to Registration Queue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
