
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  email: string;
}

interface Diagnosis {
  condition: string;
  description: string;
  status: string;
}

interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

const TreatmentPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newDiagnosis, setNewDiagnosis] = useState<Diagnosis>({
    condition: '',
    description: '',
    status: 'active'
  });

  const [newPrescription, setNewPrescription] = useState<Prescription>({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/patients/${patientId}/`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
          }
        );

        if (!response.ok) throw new Error('Patient not found');
        
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patient');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) fetchPatient();
  }, [patientId]);

  const handleAddDiagnosis = () => {
    if (!newDiagnosis.condition || !newDiagnosis.description) {
      setError('Condition and description are required');
      return;
    }
    
    setDiagnoses([...diagnoses, newDiagnosis]);
    setNewDiagnosis({
      condition: '',
      description: '',
      status: 'active'
    });
  };

  const handleAddPrescription = () => {
    if (!newPrescription.medication || !newPrescription.dosage || !newPrescription.frequency) {
      setError('Medication, dosage, and frequency are required');
      return;
    }
    
    setPrescriptions([...prescriptions, newPrescription]);
    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    });
  };
  
  const handleSubmitTreatment = async () => {
    if (!treatmentNotes) {
      setError('Treatment notes are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/treatments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({
          patient_id: patientId,
          treatment_notes: treatmentNotes,
          diagnoses,
          prescriptions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save treatment');
      }

      router.push(`/doctor/treatment-details/${patientId}`);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save treatment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl p-4 border border-red-200 rounded-lg bg-red-50">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Patient Treatment</h1>
            <div className="space-x-4">
              <button
                onClick={() => router.push(`/doctor/referral-treatment/${patientId}`)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                <PlusCircle className="h-5 w-5" />
                Create Referral
              </button>
              <button
                onClick={() => router.push('/patients')}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
              >
                Back to Patients
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {patient && (
          <div className="bg-white shadow rounded-lg mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patient ID</p>
                <p className="font-medium">{patient.patient_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{patient.first_name} {patient.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{patient.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Treatment Notes</h2>
          <textarea
            value={treatmentNotes}
            onChange={(e) => setTreatmentNotes(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter detailed treatment notes..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Diagnoses</h2>
            
            <div className="space-y-4 mb-6">
              {diagnoses.map((diagnosis, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{diagnosis.condition}</h3>
                      <p className="text-gray-600 text-sm mt-1">{diagnosis.description}</p>
                      <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                        diagnosis.status === 'active' ? 'bg-green-100 text-green-800' :
                        diagnosis.status === 'chronic' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {diagnosis.status}
                      </span>
                    </div>
                    <button
                      onClick={() => setDiagnoses(diagnoses.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Condition</label>
                <input
                  type="text"
                  value={newDiagnosis.condition}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, condition: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newDiagnosis.description}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, description: e.target.value})}
                  className="w-full p-2 border rounded-lg h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newDiagnosis.status}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, status: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="chronic">Chronic</option>
                </select>
              </div>

              <button
                onClick={handleAddDiagnosis}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Diagnosis
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
            
            <div className="space-y-4 mb-6">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{prescription.medication}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {prescription.dosage} - {prescription.frequency}
                      </p>
                      {prescription.duration && (
                        <p className="text-gray-500 text-sm mt-1">Duration: {prescription.duration}</p>
                      )}
                      {prescription.notes && (
                        <p className="text-gray-500 text-sm mt-1">Notes: {prescription.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Medication</label>
                  <input
                    type="text"
                    value={newPrescription.medication}
                    onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <input
                    type="text"
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <input
                    type="text"
                    value={newPrescription.frequency}
                    onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    value={newPrescription.duration}
                    onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newPrescription.notes}
                  onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                  className="w-full p-2 border rounded-lg h-24"
                />
              </div>

              <button
                onClick={handleAddPrescription}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Prescription
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitTreatment}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Saving Treatment...' : 'Save Treatment'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default TreatmentPage;