'use client'
import { useState, useEffect } from 'react'
import { useParams } from "next/navigation"
import { Calendar, Clock, Activity, Heart, Clipboard, FileText, TrendingUp, User, Phone, Mail, MapPin, AlertCircle } from 'lucide-react'

interface Patient {
  patient_id: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  phone_number: string
  date_of_birth: string
  street_address: string
  barangay: string
  municipal_city: string
  gender: string
}

interface VitalSigns {
  blood_pressure: string
  temperature: string
  heart_rate: string
  respiratory_rate: string
  pulse_rate: string
  pain_scale: string
  pain_location: string
}

interface Diagnosis {
  id: number
  diagnosis_code: string
  diagnosis_date: string
  diagnosis_description: string
}

interface Medication {
  id: number
  dosage: string
  frequency: string
  start_date: string
  end_date: string
  medication: {
    id: number
    name: string
  }
}

interface LabResult {
  id: string
  image_url: string
  uploaded_at: string
  submitted_by: {
    first_name: string
    last_name: string
    role: string
  }
}

interface RecentTreatment {
  doctor_info: {
    name: string
    specialization: string
  }
  prescriptions: Medication[]
  diagnoses: Diagnosis[]
}

interface ReportData {
  patient: Patient
  preliminary_assessment: VitalSigns
  recent_treatment: RecentTreatment
  all_diagnoses: Diagnosis[]
  laboratories: LabResult[]
  all_treatment_notes: string[]
}

export default function PatientReport() {
  const { patient_id } = useParams()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const diff = Date.now() - birthDate.getTime()
    const ageDate = new Date(diff)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('pdf-content')
      if (!element) return

      // Clone the element for full content
      const clone = element.cloneNode(true) as HTMLElement
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      document.body.appendChild(clone)

      // Show all sections (they are all visible in this version, so no change needed)

      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: true,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${reportData?.patient.last_name || 'patient'}-full-report.pdf`)

      document.body.removeChild(clone)
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

  const getFileNameFromUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      return parsed.pathname.split('/').pop() || 'lab-result.pdf'
    } catch {
      return 'lab-result.pdf'
    }
  }

  useEffect(() => {
    if (!patient_id) {
      setError('Patient ID is missing')
      setLoading(false)
      return
    }

    const accessToken = localStorage.getItem('access')
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/patient/patient-report/${patient_id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return await res.json()
      })
      .then((data: ReportData) => {
        if (!data.patient) throw new Error('Invalid patient data structure')
        setReportData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setError(err.message || 'Failed to load report')
        setLoading(false)
      })
  }, [patient_id])

  if (loading) return <div className="p-4">Loading patient report...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  if (!reportData) return <div className="p-4">No patient data found</div>

  const { patient, preliminary_assessment, recent_treatment, all_diagnoses, laboratories, all_treatment_notes } = reportData

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Report</h1>
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              onClick={handleDownloadPDF}
            >
              Download
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div id="pdf-content" className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Patient Info Card */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {patient.first_name} {patient.middle_name} {patient.last_name}
                </h2>
                <p className="text-gray-500">
                  {patient.patient_id} • {calculateAge(patient.date_of_birth)} years • {patient.gender}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center text-gray-700">
                <Phone size={16} className="mr-2 text-gray-500" />
                <span>{patient.phone_number}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail size={16} className="mr-2 text-gray-500" />
                <span>{patient.email}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-gray-500" />
                <span className="text-gray-700">
                  {patient.street_address}, {patient.barangay}, {patient.municipal_city}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-500" />
                <span className="text-gray-700">
                  Date of Birth: {new Date(patient.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs & Overview */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <VitalCard
              icon={<Heart size={20} className="text-blue-600" />}
              title="Blood Pressure"
              value={`${preliminary_assessment.blood_pressure} mmHg`}
            />
            <VitalCard
              icon={<Activity size={20} className="text-blue-600" />}
              title="Heart Rate"
              value={`${preliminary_assessment.heart_rate} bpm`}
            />
            <VitalCard
              icon={<TrendingUp size={20} className="text-blue-600" />}
              title="Temperature"
              value={`${preliminary_assessment.temperature}°F`}
            />
            <VitalCard
              icon={<Clock size={20} className="text-blue-600" />}
              title="Respiratory Rate"
              value={`${preliminary_assessment.respiratory_rate} bpm`}
            />
          </div>
        </div>

        {/* Recent Medications & Conditions */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          {/* Recent Medications */}
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Medications</h3>
          <div className="space-y-4 mb-6">
            {recent_treatment?.prescriptions?.map((prescription) => (
              <div key={prescription.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-md mr-3">
                  <Clipboard size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{prescription.medication.name}</h4>
                  <p className="text-sm text-gray-500">
                    {prescription.dosage} • {prescription.frequency}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Conditions */}
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Conditions</h3>
          <div className="space-y-4">
            {all_diagnoses.map((diagnosis) => (
              <div key={diagnosis.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-md mr-3">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {diagnosis.diagnosis_code} - {diagnosis.diagnosis_description}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Diagnosed: {new Date(diagnosis.diagnosis_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnoses */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Diagnoses</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {all_diagnoses.map((diagnosis) => (
                  <tr key={diagnosis.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{diagnosis.diagnosis_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(diagnosis.diagnosis_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{diagnosis.diagnosis_description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Labs */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Laboratory Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {laboratories.map((lab) => (
                  <tr key={lab.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={lab.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {getFileNameFromUrl(lab.image_url)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lab.submitted_by.first_name} {lab.submitted_by.last_name} ({lab.submitted_by.role})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(lab.uploaded_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Treatment Notes */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Treatment Notes</h3>
          <div className="space-y-6">
            {all_treatment_notes.map((note, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{recent_treatment.doctor_info.name}</div>
                </div>
                <p className="text-gray-700">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-2 text-yellow-500" />
            <p className="text-sm text-gray-500">This report is for healthcare professional use only.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const VitalCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <div className="flex items-center mb-2">
      {icon}
      <span className="text-sm font-medium text-gray-500 ml-2">{title}</span>
    </div>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
)