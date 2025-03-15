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
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import userInfo from "@/components/hooks/userRole";

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
          `http://127.0.0.1:8000/patient/patient-preliminary-assessment/${patient_id}/${queue_number}/`,
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
      const url = `http://127.0.0.1:8000/medicine/medicine-search/?q=${encodeURIComponent(
        query
      )}`;
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
      `http://127.0.0.1:8000/queueing/patient-treatment/${patient_id}/${queue_number}/`,
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
        "http://127.0.0.1:8000/patient/lab-request/",
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
  if (!role || role.role !== "doctor") {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Not Authorized
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

      {assessment ? (
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
      ) : (
        <div className="mb-6 rounded-lg border bg-blue-50 p-4">
          <h3 className="mb-3 text-xl font-semibold text-gray-800">
            Preliminary Assessment
          </h3>
          <p className="text-gray-600">
            No preliminary assessment available for this patient.
          </p>
        </div>
      )}
      {/* LAB RESULT UPLOAD SECTION COMMENTED OUT */}
      <div>
        {/* Button to open the lab request modal */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowRequestModal(true)}
          >
            Request Laboratory Examination
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Diagnoses Section */}
        <div className="mb-8">
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            Diagnoses
          </h3>
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
                  handleDiagnosisChange(
                    index,
                    "diagnosis_description",
                    e.target.value
                  )
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
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Prescriptions
          </h3>
          {prescriptions.map((prescription, index) => (
            <div
              key={index}
              className="mb-2 rounded-lg border bg-gray-50 p-4 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Medication Name"
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
                    className="w-full rounded-md border p-2"
                  />
                  {activePrescriptionIndex === index && (
                    <div className="absolute z-30 mt-2 w-[300px] rounded-lg border bg-white shadow-xl">
                      {isMedicineLoading ? (
                        <div className="flex items-center justify-center p-4 text-gray-500">
                          <svg
                            className="mr-2 h-5 w-5 animate-spin text-blue-600"
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
                          Searching medicines...
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto">
                          {(medicineResults || []).map((medicine, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="w-full border-b p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
                              onClick={() => {
                                console.log(
                                  "Selected medicine id:",
                                  medicine.id
                                );
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
                              <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                  <span className="block truncate font-medium text-gray-900">
                                    {medicine.name}
                                  </span>
                                  <span className="mt-0.5 block text-sm text-gray-500">
                                    Dosage: {medicine.strength}
                                  </span>
                                </div>

                                <div className="ml-4 flex-shrink-0">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                      ${
                                        medicine.stocks >= 200
                                          ? "bg-green-100 text-green-800"
                                          : medicine.stocks > 100
                                          ? "bg-orange-100 text-orange-800"
                                          : medicine.stocks > 0
                                          ? "bg-rose-100 text-rose-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                  >
                                    {medicine.stocks >= 200 ? (
                                      <Check className="mr-1 h-4 w-4" />
                                    ) : medicine.stocks > 0 ? (
                                      <AlertTriangle className="mr-1 h-4 w-4" />
                                    ) : (
                                      <XCircle className="mr-1 h-4 w-4" />
                                    )}
                                    Stock: {medicine.stocks}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {medicineResults?.length === 0 && !isMedicineLoading && (
                        <div className="p-4 text-center text-gray-500">
                          <Search className="mx-auto mb-2 h-5 w-5 text-gray-400" />
                          No medicines found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Keep other prescription fields the same */}
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
                  type="text"
                  placeholder="Quantity"
                  value={prescription.quantity}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "quantity", e.target.value)
                  }
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="date"
                  placeholder="Start Date"
                  value={prescription.start_date}
                  onChange={(e) =>
                    handlePrescriptionChange(
                      index,
                      "start_date",
                      e.target.value
                    )
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
        {/* Submit and Save Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            type="submit"
            className="ml-2 w-1/2 rounded-xl bg-blue-600 py-3 text-lg font-medium text-white transition hover:bg-blue-700"
          >
            Submit Treatment
          </button>
        </div>
      </form>

      {/* Laboratory Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Request Laboratory Examination
            </h2>
            <form onSubmit={handleSave}>
              <label className="mb-2 block text-gray-700">
                Select Laboratory Test:
              </label>
              <select
                value={labTestChoice}
                onChange={(e) => setLabTestChoice(e.target.value)}
                className="mb-4 w-full rounded-md border p-2"
                required
              >
                <option value="">-- Select a test --</option>

                <optgroup label="Laboratory Tests">
                  <option value="Standard Chemistry">Standard Chemistry</option>
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
                  <option value="Chest (PA-LATERAL)">Chest (PA-LATERAL)</option>
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

              {labTestChoice === "Other" && (
                <>
                  <label className="mb-2 block text-gray-700">
                    Please specify:
                  </label>
                  <input
                    type="text"
                    value={customLabTest}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCustomLabTest(e.target.value)
                    }
                    placeholder="Enter custom test name"
                    className="mb-4 w-full rounded-md border p-2"
                    required
                  />
                </>
              )}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            {/* Close (X) Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                className="h-6 w-6"
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
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Submission Successful
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              The laboratory request is successfully submitted
            </p>
            <div className="flex justify-between space-x-4">
              <button
                className="w-full rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => router.push("/doctor")}
              >
                Go To Dashboard
              </button>
              <button
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => router.push("/doctor/patient-treatment-queue")}
              >
                Go to Treatment Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
