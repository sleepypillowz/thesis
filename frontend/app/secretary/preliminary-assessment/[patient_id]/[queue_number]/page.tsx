"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import userRole from "@/hooks/userRole";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Patient {
  first_name: string;
  last_name: string;
  allergies?: string;
  medical_history?: string;
  current_medications?: string;
}

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

export default function PreliminaryAssessmentID() {
  const params = useParams();
  const { patient_id, queue_number } = params as {
    patient_id: string;
    queue_number: string;
  };

  const [patient, setPatient] = useState<Patient | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/queueing/patient-preliminary-assessment/${patient_id}/${queue_number}/`;

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
        setPatient(data);
      })
      .catch((error) => console.error("Error fetching patient:", error));
  }, [patient_id, queue_number]);

  useEffect(() => {
    if (patient) {
      setFormData((prev) => ({
        ...prev,
        allergies: patient.allergies || "",
        medical_history: patient.medical_history || "",
        current_medications: patient.current_medications || "",
      }));
    }
  }, [patient]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient_id || !queue_number) return;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/queueing/patient-preliminary-assessment/${patient_id}/${queue_number}/`;
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

  if (!patient) return <div>Loading patient data...</div>;
  if (!role || role.role !== "secretary") {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Not Authorized
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8">
      <div className="card mx-auto max-w-4xl rounded-lg shadow-lg">
        <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
          <h2 className="mb-6 text-2xl font-semibold">
            Preliminary Assessment for {patient.first_name} {patient.last_name}
          </h2>
          <p>
            <strong>Patient ID:</strong> {patient_id}
          </p>
          <p className="mb-4">
            <strong>Queue Number:</strong> {queue_number}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="rounded-lg border p-4">
            <legend className="text-lg font-semibold">Vital Signs</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  type="number"
                  name="temperature"
                  step="0.1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                <Input
                  type="number"
                  name="heart_rate"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="blood_pressure">Blood Pressure (mmHg)</Label>
                <Input
                  type="text"
                  name="blood_pressure"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="respiratory_rate">Respiratory Rate</Label>
                <Input
                  type="number"
                  name="respiratory_rate"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="pulse_rate">Pulse Rate</Label>
                <Input
                  type="number"
                  name="pulse_rate"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-lg border p-4">
            <legend className="text-lg font-semibold">Medical Information</legend>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  name="allergies"
                  id="allergies"
                  onChange={handleChange}
                  value={formData.allergies}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="medical_history">Medical History</Label>
                <Textarea
                  name="medical_history"
                  id="medical_history"
                  onChange={handleChange}
                  value={formData.medical_history}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="current_medications">Current Medications</Label>
                <Textarea
                  name="current_medications"
                  id="current_medications"
                  onChange={handleChange}
                  value={formData.current_medications}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  name="symptoms"
                  id="symptoms"
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-lg border p-4">
            <legend className="text-lg font-semibold">Lifestyle</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="smoking_status">Smoking Status</Label>
                <select
                  name="smoking_status"
                  className="card w-full"
                  onChange={handleChange}
                >
                  <option value="non-smoker">Non-smoker</option>
                  <option value="smoker">Smoker</option>
                  <option value="former-smoker">Former Smoker</option>
                </select>
              </div>
              <div>
                <Label htmlFor="alcohol_use">Alcohol Use</Label>
                <select
                  name="alcohol_use"
                  className="card w-full"
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="frequently">Frequently</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-lg border p-4">
            <legend className="text-lg font-semibold">Patient Assessment</legend>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="assessment">Assessment</Label>
              <Textarea
                name="assessment"
                id="assessment"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="pain_scale">Pain Scale (0-10)</Label>
              <Input
                type="number"
                name="pain_scale"
                min="0"
                max="10"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="pain_location">Pain Location</Label>
              <Input
                type="text"
                name="pain_location"
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <div className="flex justify-end">
            <Button type="submit" className="rounded-md px-6 py-2 text-white shadow-md">
              Submit
            </Button>
          </div>
        </form>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="card w-1/3 rounded-lg p-4">
              <h2 className="text-xl font-semibold">Submitted Successfully!</h2>
              <div className="mt-4 flex justify-around space-x-4">
                <Button
                  className="w-full border border-blue-900 text-blue-900"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    router.push("/secretary/assessment-queue");
                  }}
                >
                  Go to Assessment Queue
                </Button>
                <Button
                  className="w-full"
                  onClick={() => router.push("/secretary/registration-queue")}
                >
                  Go to Registration Queue
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}