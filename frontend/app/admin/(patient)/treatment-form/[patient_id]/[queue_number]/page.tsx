"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";

interface Patient {
  first_name: string;
  last_name: string;
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

export default function TreatmentForm() {
  const params = useParams();
  const { patient_id, queue_number } = params as {
    patient_id: string;
    queue_number: string;
  };
  const [patient, setPatient] = useState<Patient | null>(null);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    { diagnosis_code: "", diagnosis_description: "", diagnosis_date: "" },
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { medication: "", dosage: "", frequency: "", start_date: "", end_date: "" },
  ]);

  const [treatmentNotes, setTreatmentNotes] = useState("");

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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // IMPORTANT: Send "patient_id" (write-only field) instead of "patient"
    const treatmentData = {
      treatment_notes: treatmentNotes,
      patient_id: patient_id,  // Updated key here
      diagnoses: diagnoses,
      prescriptions: prescriptions,
    };

    console.log("Submitting Data:", treatmentData);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/queueing/patient-treatment/${patient_id}/${queue_number}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(treatmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to submit: ${JSON.stringify(errorData)}`);
      }

      alert("Treatment submitted successfully!");
    } catch (error) {
      console.error("Error submitting treatment:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-lg backdrop-blur-lg">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Patient Treatment Form {patient?.first_name} {patient?.last_name}
      </h2>
      <h4>Queueing Number: {queue_number}</h4>

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
    </div>
  );
}
