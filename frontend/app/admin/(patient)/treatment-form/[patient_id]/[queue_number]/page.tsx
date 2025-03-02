"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormEvent, ChangeEvent } from "react";

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
  const [assessment, setAssessment] = useState<PreliminaryAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    { diagnosis_code: "", diagnosis_description: "", diagnosis_date: "" },
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { medication: "", dosage: "", frequency: "", start_date: "", end_date: "" },
  ]);

  const [treatmentNotes, setTreatmentNotes] = useState("");

  // LAB RESULT HANDLING COMMENTED OUT
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [uploadSuccess, setUploadSuccess] = useState(false);
  // const [showUploadModal, setShowUploadModal] = useState(false);

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

  // Diagnosis handlers
  const addDiagnosis = () => {
    setDiagnoses([
      ...diagnoses,
      { diagnosis_code: "", diagnosis_description: "", diagnosis_date: "" },
    ]);
  };

  const removeDiagnosis = (index: number) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
  };

  const handleDiagnosisChange = (
    index: number,
    field: keyof Diagnosis,
    value: string
  ) => {
    const updatedDiagnoses = diagnoses.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    );
    setDiagnoses(updatedDiagnoses);
  };

  // Prescription handlers
  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medication: "", dosage: "", frequency: "", start_date: "", end_date: "" },
    ]);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (
    index: number,
    field: keyof Prescription,
    value: string
  ) => {
    const updatedPrescriptions = prescriptions.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setPrescriptions(updatedPrescriptions);
  };

  // LAB RESULT HANDLING COMMENTED OUT
  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setSelectedFile(e.target.files[0]);
  //   }
  // };

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let response;
    // LAB RESULT HANDLING COMMENTED OUT: always send as JSON for now
    const treatmentData = {
      treatment_notes: treatmentNotes,
      patient_id: patient_id,
      diagnoses: diagnoses.filter(
        (d) => d.diagnosis_code && d.diagnosis_description && d.diagnosis_date
      ),
      prescriptions: prescriptions.filter(
        (p) =>
          p.medication && p.dosage && p.frequency && p.start_date && p.end_date
      ),
    };

    console.log("Data to serialize (JSON):", treatmentData);
    response = await fetch(
      `http://127.0.0.1:8000/queueing/patient-treatment/${patient_id}/${queue_number}/`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(treatmentData),
      }
    );
    

    try {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit treatment");
      }
      alert("Treatment submitted successfully!");
      // Reset form fields
      setDiagnoses([{ diagnosis_code: "", diagnosis_description: "", diagnosis_date: "" }]);
      setPrescriptions([{ medication: "", dosage: "", frequency: "", start_date: "", end_date: "" }]);
      setTreatmentNotes("");
      // LAB RESULT HANDLING COMMENTED OUT
      // setSelectedFile(null);
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
        <div className="text-lg font-medium text-gray-600">Loading patient data...</div>
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
          Queue Number: <span className="font-bold text-blue-600">{queue_number}</span>
        </h4>
      </div>

      {assessment && (
        <div className="mb-6 rounded-lg border bg-blue-50 p-4">
          <h3 className="mb-3 text-xl font-semibold text-gray-800">Preliminary Assessment</h3>
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
          <div className="mt-4">
            <p>
              <span className="font-medium">Smoking Status:</span>{" "}
              {assessment.smoking_status || "N/A"}
            </p>
            <p>
              <span className="font-medium">Alcohol Use:</span>{" "}
              {assessment.alcohol_use || "N/A"}
            </p>
            <p>
              <span className="font-medium">Final Assessment:</span>{" "}
              {assessment.assessment || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* LAB RESULT UPLOAD SECTION COMMENTED OUT */}
      {/* <div className="mb-8 flex items-center justify-between">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setShowUploadModal(true)}
        >
          Upload Lab Result
        </Button>
        {uploadSuccess && (
          <div className="ml-4 text-green-600">
            File uploaded successfully!
          </div>
        )}
      </div> */}

      <form onSubmit={handleSubmit}>
        {/* Diagnoses Section */}
        <div className="mb-8">
          <h3 className="mb-2 text-xl font-semibold text-gray-800">Diagnoses</h3>
          {diagnoses.map((diag, index) => (
            <div key={index} className="mb-4 rounded-lg border bg-gray-50 p-4">
              <input
                type="text"
                value={diag.diagnosis_code}
                onChange={(e) =>
                  handleDiagnosisChange(index, "diagnosis_code", e.target.value)
                }
                placeholder="Diagnosis Code"
                className="mb-2 w-full rounded-md border p-2"
              />
              <textarea
                value={diag.diagnosis_description}
                onChange={(e) =>
                  handleDiagnosisChange(index, "diagnosis_description", e.target.value)
                }
                placeholder="Diagnosis Description"
                className="mb-2 w-full rounded-md border p-2"
                rows={3}
              />
              <input
                type="date"
                value={diag.diagnosis_date}
                onChange={(e) =>
                  handleDiagnosisChange(index, "diagnosis_date", e.target.value)
                }
                className="w-full rounded-md border p-2"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDiagnosis(index)}
                  className="mt-2 flex items-center text-red-500 hover:text-red-700"
                >
                  <Trash size={18} className="mr-1" /> Remove Diagnosis
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDiagnosis}
            className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Plus size={18} className="mr-1" /> Add Diagnosis
          </button>
        </div>

        {/* Prescriptions Section */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Prescriptions</h3>
          {prescriptions.map((prescription, index) => (
            <div key={index} className="mb-2 rounded-lg border bg-gray-50 p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <input
                  type="text"
                  placeholder="Medication Name"
                  value={prescription.medication}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "medication", e.target.value)
                  }
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={prescription.dosage}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "dosage", e.target.value)
                  }
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={prescription.frequency}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "frequency", e.target.value)
                  }
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="date"
                  placeholder="Start Date"
                  value={prescription.start_date}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "start_date", e.target.value)
                  }
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={prescription.end_date}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "end_date", e.target.value)
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removePrescription(index)}
                  className="mt-2 flex items-center text-red-500 hover:text-red-700"
                >
                  <Trash size={18} className="mr-1" /> Remove Prescription
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPrescription}
            className="mt-4 flex items-center font-medium text-blue-600 hover:text-blue-800"
          >
            <Plus size={18} className="mr-1" /> Add more prescription
          </button>
        </div>

        {/* Treatment Notes */}
        <div className="mb-8">
          <label className="block font-medium text-gray-700">Notes</label>
          <textarea
            value={treatmentNotes}
            onChange={(e) => setTreatmentNotes(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 transition focus:ring focus:ring-blue-400"
            rows={4}
            placeholder="Add any treatment notes here..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-lg font-medium text-white transition hover:bg-blue-700"
        >
          Submit Treatment
        </button>
      </form>

      {/* LAB RESULT MODAL COMMENTED OUT */}
      {/*
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Upload Lab Result</h2>
            <div className="flex flex-col items-center justify-center space-y-4">
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                  <Trash
                    className="h-4 w-4 cursor-pointer text-red-500"
                    onClick={() => setSelectedFile(null)}
                  />
                </div>
              )}
              <Button
                onClick={() => setShowUploadModal(false)}
                className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
}
