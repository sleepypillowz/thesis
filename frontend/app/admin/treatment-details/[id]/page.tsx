"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  queue_data: QueueData;
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

export default function TreatmentDetailsPage() {
  const params = useParams();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const router = useRouter();
  const { id } = params as { id: string };

  useEffect(() => {
    if (!id) return;

    const apiUrl = `http://127.0.0.1:8000/patient/patient-treatment-view-details/${id}/`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched treatment data:", data);
        setTreatment(data);
      })
      .catch((error) => console.error("Error fetching treatment:", error));
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center text-slate-600 hover:text-slate-800 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Treatments
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Treatment Record</h1>
            <div className="flex items-center space-x-4 text-slate-600">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{treatment ? new Date(treatment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>              
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>{treatment?.patient.first_name} {treatment?.patient.last_name}</span>
              </div>
            </div>
          </header>

          {treatment ? (
            <div className="space-y-8">
              {/* Treatment Notes */}
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Treatment Notes
                </h2>
                <p className="text-slate-600 bg-slate-50 rounded-lg p-4 leading-relaxed">
                  {treatment.treatment_notes}
                </p>
              </section>

              {/* Diagnoses */}
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                  Diagnoses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {treatment.diagnoses.map((d, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="font-medium text-blue-600 mb-1">{d.diagnosis_code}</div>
                      <div className="text-slate-600 text-sm">{d.diagnosis_description}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Prescriptions */}
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Prescriptions
                </h2>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">Medication</th>
                        <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">Dosage</th>
                        <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treatment.prescriptions.map((p, index) => (
                        <tr key={index} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-slate-800 font-medium">{p.medication}</td>
                          <td className="py-3 px-4 text-slate-600">{p.dosage}</td>
                          <td className="py-3 px-4 text-slate-600">{p.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
