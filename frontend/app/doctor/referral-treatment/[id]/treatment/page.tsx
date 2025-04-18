'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Diagnosis {
  diagnosis_code: string;
  diagnosis_description: string;
  diagnosis_date: string;
}

interface Prescription {
  medication: {
    name: string;
  };
  dosage: string;
  frequency: string;
  quantity: number;
  start_date: string;
  end_date: string;
}

interface TreatmentRecord {
  id: number;
  treatment_notes: string;
  created_at: string;
  updated_at: string;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
}

interface PatientInfo {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface TreatmentDetails {
  patient_info: PatientInfo;
  recent_treatment?: TreatmentRecord;
  previous_treatments: TreatmentRecord[];
}

export default function TreatmentPage() {
  const params = useParams<{ id: string }>();
  const referralId = params.id;
  const [details, setDetails] = useState<TreatmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!referralId) return;
    const fetchTreatment = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) throw new Error('Not authenticated');

        const res = await fetch(
          `http://localhost:8000/appointment/referrals/${referralId}/treatment-details/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error('Failed to load treatment details');

        const data: TreatmentDetails = await res.json();
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [referralId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading treatment details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-6 text-gray-500 text-center">
        <p>No treatment details available.</p>
      </div>
    );
  }

  const { patient_info, recent_treatment, previous_treatments } = details;
  const fullName = `${patient_info.first_name} ${patient_info.middle_name ?? ''} ${patient_info.last_name}`.replace(/\s+/g, ' ');

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Patient Info */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <h1 className="text-2xl font-bold mb-4">Patient Information</h1>
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Email:</strong> {patient_info.email}</p>
        <p><strong>Phone:</strong> {patient_info.phone_number}</p>
      </section>

      {/* Recent Treatment */}
      {recent_treatment && (
        <section className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Most Recent Treatment</h2>
          <p className="text-sm text-gray-500 mb-2">
            Date: {new Date(recent_treatment.created_at).toLocaleString()}
          </p>
          <p className="mb-4">{recent_treatment.treatment_notes}</p>

          <div className="mb-4">
            <h3 className="font-medium mb-1">Diagnoses</h3>
            <ul className="list-disc pl-5">
              {recent_treatment.diagnoses.map((d) => (
                <li key={d.diagnosis_code}>
                  {d.diagnosis_description} ({new Date(d.diagnosis_date).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-1">Prescriptions</h3>
            <ul className="list-disc pl-5">
              {recent_treatment.prescriptions.map((p, i) => (
                <li key={i}>
                  {p.medication.name} — {p.dosage}, {p.frequency} ×{p.quantity} (
                  {new Date(p.start_date).toLocaleDateString()} to{' '}
                  {new Date(p.end_date).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Previous Treatments */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Previous Treatments</h2>
        {previous_treatments.length === 0 ? (
          <p className="text-gray-600">No previous treatments found.</p>
        ) : (
          previous_treatments.map((t) => (
            <div key={t.id} className="mb-6 border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">
                Date: {new Date(t.created_at).toLocaleString()}
              </p>
              <p className="mb-2">{t.treatment_notes}</p>

              <div className="mb-2">
                <h4 className="font-medium mb-1">Diagnoses</h4>
                <ul className="list-disc pl-5">
                  {t.diagnoses.map((d) => (
                    <li key={d.diagnosis_code}>
                      {d.diagnosis_description} ({new Date(d.diagnosis_date).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1">Prescriptions</h4>
                <ul className="list-disc pl-5">
                  {t.prescriptions.map((p, i) => (
                    <li key={i}>
                      {p.medication.name} — {p.dosage}, {p.frequency} ×{p.quantity} (
                      {new Date(p.start_date).toLocaleDateString()} to{' '}
                      {new Date(p.end_date).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
