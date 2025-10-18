"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  Trash,
  Search,
  XCircle,
  AlertTriangle,
  Check,
} from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import userInfo from "@/hooks/userRole";

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
interface ApiResponse {
  patient: Patient;
  preliminary_assessment: PreliminaryAssessment;
}

interface Prescription {
  id?: number;
  medicine_id?: number;
  medication: string;
  dosage: string;
  frequency: string;
  quantity: string;
  start_date: string;
  end_date: string;
}

interface Medicine {
  id?: number;
  name: string;
  strength: string;
  stocks: number;
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
    {
      medication: "",
      dosage: "",
      frequency: "",
      quantity: "",
      start_date: "",
      end_date: "",
    },
  ]);

  const [treatmentNotes, setTreatmentNotes] = useState("");

  const role = userInfo();
  const [showRequestModal, setShowRequestModal] = useState(false);
  // Lab test request states
  const [labTestChoice, setLabTestChoice] = useState("");
  const [customLabTest, setCustomLabTest] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Medicine State
  const [activePrescriptionIndex, setActivePrescriptionIndex] = useState(-1);
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineResults, setMedicineResults] = useState<Medicine[]>([]);
  const [isMedicineLoading, setIsMedicineLoading] = useState(false);

  useEffect(() => {
    if (!patient_id || !queue_number) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/patient/patient-preliminary-assessment/${patient_id}/${queue_number}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        console.log("Fetched API response:", data);
        setPatient(data.patient);
        setAssessment(data.preliminary_assessment);
        console.log("assessment", data.preliminary_assessment);
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

  const searchMedicines = async (query: string) => {
    if (query.length < 2) {
      setMedicineResults([]);
      return;
    }

    setIsMedicineLoading(true);
    try {
      const token = localStorage.getItem("access");
      const url = `${
        process.env.NEXT_PUBLIC_API_BASE
      }/medicine/medicine-search/?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMedicineResults(data.medicine || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicineResults([]);
    } finally {
      setIsMedicineLoading(false);
    }
  };

  useEffect(() => {
    if (medicineQuery.length >= 2) {
      const handler = setTimeout(() => searchMedicines(medicineQuery), 300);
      return () => clearTimeout(handler);
    }
  }, [medicineQuery]);
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
      {
        medication: "",
        dosage: "",
        frequency: "",
        quantity: "",
        start_date: "",
        end_date: "",
      },
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
    setPrescriptions((prev) =>
      prev.map((prescription, i) =>
        i === index ? { ...prescription, [field]: value } : prescription
      )
    );
  };

  // LAB RESULT HANDLING COMMENTED OUT

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
    const token = localStorage.getItem("access");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/queueing/patient-treatment/${patient_id}/${queue_number}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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
      setDiagnoses([
        { diagnosis_code: "", diagnosis_description: "", diagnosis_date: "" },
      ]);
      setPrescriptions([
        {
          medication: "",
          dosage: "",
          frequency: "",
          quantity: "",
          start_date: "",
          end_date: "",
        },
      ]);
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
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    // Determine final lab test name based on selection
    const labTestName =
      labTestChoice === "Other" ? customLabTest : labTestChoice;
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found");
      return;
    }
    try {
      // Submit the lab request
      const labResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/patient/lab-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            patient: patient_id,
            test_name: labTestName,
            custom_test: labTestChoice === "Other" ? customLabTest : null,
          }),
        }
      );
      if (!labResponse.ok) {
        throw new Error(
          `Lab Request HTTP error! Status: ${labResponse.status}`
        );
      }
      const labData = await labResponse.json();
      console.log("Lab request successful:", labData);
      // Clear lab request inputs and close modal
      setShowRequestModal(false);
      setLabTestChoice("");
      setCustomLabTest("");
      setShowModal(true);
    } catch (error) {
      console.error("Failed to save lab request and treatment:", error);
      alert(
        "Failed to submit lab request and save treatment. Please try again."
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
  if (!role || (role.role !== "doctor" && role.role !== "on-call-doctor")) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Not Authorized
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-6 border-b border-gray-100 pb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">
            Patient Treatment
          </h2>
          <div className="mt-2 flex items-center">
            <span className="text-lg font-medium text-gray-700">
              {patient?.first_name} {patient?.last_name}
            </span>
            <span className="mx-3 text-gray-400">•</span>
            <span className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Queue #{queue_number}
            </span>
          </div>
        </div>

        {assessment ? (
          <div className="mb-8 overflow-hidden rounded-xl border border-blue-100 bg-blue-50 shadow-sm">
            <div className="border-b border-blue-100 bg-blue-100/40 px-6 py-4">
              <h3 className="font-semibold text-blue-900">
                Preliminary Assessment
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Vital Signs
                    </h4>
                    <div className="mt-1 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Blood Pressure
                        </p>
                        <p className="text-sm font-medium">
                          {assessment.blood_pressure || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Temperature
                        </p>
                        <p className="text-sm font-medium">
                          {assessment.temperature || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Heart Rate
                        </p>
                        <p className="text-sm font-medium">
                          {assessment.heart_rate || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Respiratory Rate
                        </p>
                        <p className="text-sm font-medium">
                          {assessment.respiratory_rate || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Pulse Rate
                        </p>
                        <p className="text-sm font-medium">
                          {assessment.pulse_rate || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Patient History
                    </h4>
                    <div className="mt-1 space-y-2">
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Allergies
                        </p>
                        <p className="text-sm">
                          {assessment.allergies || "None reported"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Medical History
                        </p>
                        <p className="text-sm">
                          {assessment.medical_history || "None reported"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Current Condition
                    </h4>
                    <div className="mt-1 space-y-2">
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Symptoms
                        </p>
                        <p className="text-sm">
                          {assessment.symptoms || "None reported"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Current Medications
                        </p>
                        <p className="text-sm">
                          {assessment.current_medications || "None"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                          <p className="text-xs font-medium text-gray-500">
                            Pain Scale
                          </p>
                          <p className="text-sm font-medium">
                            {assessment.pain_scale || "N/A"}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                          <p className="text-xs font-medium text-gray-500">
                            Pain Location
                          </p>
                          <p className="text-sm">
                            {assessment.pain_location || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Lifestyle
                    </h4>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Smoking Status
                        </p>
                        <p className="text-sm">
                          {assessment.smoking_status || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Alcohol Use
                        </p>
                        <p className="text-sm">
                          {assessment.alcohol_use || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <p className="text-xs font-medium text-gray-500">
                      Final Assessment
                    </p>
                    <p className="text-sm">{assessment.assessment || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-gray-600">
              No preliminary assessment available for this patient.
            </p>
          </div>
        )}

        <div className="mb-8">
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
            onClick={() => setShowRequestModal(true)}
          >
            <Plus size={16} />
            Request Laboratory Examination
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Diagnoses Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Diagnoses</h3>
              <button
                type="button"
                onClick={addDiagnosis}
                className="flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <Plus size={14} className="mr-1" /> Add Diagnosis
              </button>
            </div>
            <div className="space-y-4">
              {diagnoses.map((diag, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Diagnosis Code
                      </label>
                      <input
                        type="text"
                        value={diag.diagnosis_code}
                        onChange={(e) =>
                          handleDiagnosisChange(
                            index,
                            "diagnosis_code",
                            e.target.value
                          )
                        }
                        placeholder="Enter diagnosis code"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Diagnosis Date
                      </label>
                      <input
                        type="date"
                        value={diag.diagnosis_date}
                        onChange={(e) =>
                          handleDiagnosisChange(
                            index,
                            "diagnosis_date",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Diagnosis Description
                    </label>
                    <textarea
                      value={diag.diagnosis_description}
                      onChange={(e) =>
                        handleDiagnosisChange(
                          index,
                          "diagnosis_description",
                          e.target.value
                        )
                      }
                      placeholder="Describe the diagnosis in detail"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      rows={2}
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeDiagnosis(index)}
                      className="mt-3 flex items-center text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      <Trash size={14} className="mr-1" /> Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Prescriptions
              </h3>
              <button
                type="button"
                onClick={addPrescription}
                className="flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <Plus size={14} className="mr-1" /> Add Prescription
              </button>
            </div>
            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-5 shadow-sm"
                >
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative">
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Medication
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search for medications"
                          value={prescription.medication}
                          onChange={(e) => {
                            handlePrescriptionChange(
                              index,
                              "medication",
                              e.target.value
                            );
                            setMedicineQuery(e.target.value);
                            setActivePrescriptionIndex(index);
                          }}
                          onFocus={() => setActivePrescriptionIndex(index)}
                          className="w-full rounded-md border border-gray-300 p-2 pl-8 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <Search
                          size={16}
                          className="absolute left-2.5 top-2.5 text-gray-400"
                        />
                      </div>
                      {activePrescriptionIndex === index &&
                        medicineResults.length > 0 && (
                          <div className="absolute z-30 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                            <div className="max-h-56 overflow-y-auto rounded-md">
                              {isMedicineLoading ? (
                                <div className="flex items-center justify-center p-4 text-sm text-gray-500">
                                  <svg
                                    className="mr-2 h-4 w-4 animate-spin text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  Searching...
                                </div>
                              ) : (
                                medicineResults.map((medicine, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                                    onClick={() => {
                                      handlePrescriptionChange(
                                        index,
                                        "medicine_id",
                                        medicine.id?.toString() || ""
                                      );
                                      handlePrescriptionChange(
                                        index,
                                        "medication",
                                        medicine.name
                                      );
                                      handlePrescriptionChange(
                                        index,
                                        "dosage",
                                        medicine.strength
                                      );
                                      setMedicineResults([]);
                                      setActivePrescriptionIndex(-1);
                                    }}
                                  >
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {medicine.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Strength: {medicine.strength}
                                      </div>
                                    </div>
                                    <span
                                      className={`ml-4 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        medicine.stocks >= 200
                                          ? "bg-green-100 text-green-800"
                                          : medicine.stocks > 100
                                          ? "bg-yellow-100 text-yellow-800"
                                          : medicine.stocks > 0
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {medicine.stocks >= 200 ? (
                                        <Check size={12} className="mr-1" />
                                      ) : medicine.stocks > 0 ? (
                                        <AlertTriangle
                                          size={12}
                                          className="mr-1"
                                        />
                                      ) : (
                                        <XCircle size={12} className="mr-1" />
                                      )}
                                      {medicine.stocks}
                                    </span>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Dosage
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 500mg"
                        value={prescription.dosage}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Frequency
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Twice daily"
                        value={prescription.frequency}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Quantity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 30"
                        value={prescription.quantity}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={prescription.start_date}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "start_date",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={prescription.end_date}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "end_date",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePrescription(index)}
                      className="flex items-center text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      <Trash size={14} className="mr-1" /> Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Notes */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Treatment Notes
            </label>
            <textarea
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              rows={4}
              placeholder="Add any additional notes about the treatment plan..."
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              className="min-w-32 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
            >
              Submit Treatment
            </Button>
          </div>
        </form>

        {/* Laboratory Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Request Laboratory Examination
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Select Laboratory Test
                  </label>
                  <select
                    value={labTestChoice}
                    onChange={(e) => setLabTestChoice(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">-- Select a test --</option>
                    <optgroup label="Laboratory Tests">
                      <option value="Standard Chemistry">
                        Standard Chemistry
                      </option>
                      <option value="Blood Typing Urinalysis">
                        Blood Typing Urinalysis
                      </option>
                      <option value="Complete Blood Count (CBC)">
                        Complete Blood Count (CBC)
                      </option>
                      <option value="Complete Blood Count (CBC) with Platelet Count">
                        Complete Blood Count (CBC) with Platelet Count
                      </option>
                      <option value="HBA1C">HBA1C</option>
                      <option value="Electrocardiogram (ECG)">
                        Electrocardiogram (ECG)
                      </option>
                      <option value="Epidermolysis Bullosa Simplex (EBS)">
                        Epidermolysis Bullosa Simplex (EBS)
                      </option>
                      <option value="Sodium">Sodium</option>
                      <option value="Potassium">Potassium</option>
                      <option value="Rabies">Rabies</option>
                      <option value="Flu">Flu</option>
                      <option value="Pneumonia">Pneumonia</option>
                      <option value="Anti-tetanus">Anti-tetanus</option>
                      <option value="Hepatitis B Screening">
                        Hepatitis B Screening
                      </option>
                    </optgroup>
                    <optgroup label="Radiology Tests">
                      <option value="Chest (PA)">Chest (PA)</option>
                      <option value="Chest (PA-LATERAL)">
                        Chest (PA-LATERAL)
                      </option>
                      <option value="Chest (LATERAL)">Chest (LATERAL)</option>
                      <option value="Chest (APICOLORDOTIC VIEW)">
                        Chest (APICOLORDOTIC VIEW)
                      </option>
                      <option value="Elbow">Elbow</option>
                      <option value="Hand">Hand</option>
                      <option value="Pelvic">Pelvic</option>
                      <option value="Hip Joint">Hip Joint</option>
                      <option value="Knee">Knee</option>
                      <option value="Foot imaging">Foot imaging</option>
                    </optgroup>
                    <optgroup label="Other Services">
                      <option value="Rapid Antigen Testing">
                        Rapid Antigen Testing
                      </option>
                      <option value="Reverse Transcription Polymerase Chain Reaction (RT-PCR)">
                        Reverse Transcription Polymerase Chain Reaction (RT-PCR)
                      </option>
                      <option value="Saliva testing">Saliva testing</option>
                      <option value="Rapid Antibody testing">
                        Rapid Antibody testing
                      </option>
                    </optgroup>
                    <option value="Other">Other (Specify)</option>
                  </select>
                </div>

                {labTestChoice === "Other" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Custom Test Name
                    </label>
                    <input
                      type="text"
                      value={customLabTest}
                      onChange={(e) => setCustomLabTest(e.target.value)}
                      placeholder="Enter custom test name"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
              <div className="bg-green-50 px-6 py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Success!</h3>
              </div>
              <div className="p-6">
                <p className="mb-6 text-center text-gray-600">
                  Laboratory request has been successfully submitted.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => router.push("/doctor")}
                  >
                    Go To Dashboard
                  </button>
                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => router.push("/doctor/treatment-queue")}
                  >
                    Treatment Queue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
