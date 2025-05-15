'use client'
import { useState } from 'react';
import { Calendar, Clock, Activity, Heart, Clipboard, FileText, TrendingUp, User, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

export default function PatientReport() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock patient data
  const patient = {
    name: "Sarah Johnson",
    id: "PTN-78945",
    age: 42,
    gender: "Female",
    phone: "(555) 123-4567",
    email: "sarah.johnson@example.com",
    address: "123 Main Street, Anytown, CA 94521",
    doctor: "Dr. Michael Chen",
    lastVisit: "May 10, 2025",
    nextAppointment: "June 15, 2025"
  };
  
  const vitals = {
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    respiratoryRate: "16 bpm",
    oxygenSaturation: "98%",
    height: "5'6\"",
    weight: "145 lbs",
    bmi: "23.4"
  };
  
  const medications = [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", purpose: "Blood pressure" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", purpose: "Blood glucose" },
    { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", purpose: "Cholesterol" }
  ];
  
  const conditions = [
    { name: "Type 2 Diabetes", diagnosedDate: "Jan 2021", status: "Controlled" },
    { name: "Hypertension", diagnosedDate: "Mar 2019", status: "Controlled" },
    { name: "Hyperlipidemia", diagnosedDate: "Mar 2019", status: "Monitoring" }
  ];
  
  const labResults = [
    { test: "HbA1c", result: "6.2%", date: "Apr 28, 2025", range: "4.0-5.6%", status: "High" },
    { test: "Cholesterol (Total)", result: "185 mg/dL", date: "Apr 28, 2025", range: "<200 mg/dL", status: "Normal" },
    { test: "HDL Cholesterol", result: "55 mg/dL", date: "Apr 28, 2025", range: ">40 mg/dL", status: "Normal" },
    { test: "LDL Cholesterol", result: "110 mg/dL", date: "Apr 28, 2025", range: "<100 mg/dL", status: "High" },
    { test: "Triglycerides", result: "120 mg/dL", date: "Apr 28, 2025", range: "<150 mg/dL", status: "Normal" }
  ];
  
  const notes = [
    { date: "May 10, 2025", provider: "Dr. Michael Chen", content: "Patient reports improved energy levels. Blood pressure well-controlled on current medication. Discussed dietary strategies to further manage blood glucose." },
    { date: "Feb 15, 2025", provider: "Dr. Michael Chen", content: "Patient experiencing occasional headaches. Recommended to monitor triggers and frequency. Maintaining medication adherence. Lab work ordered for next visit." },
    { date: "Nov 5, 2024", provider: "Dr. Sarah Williams", content: "Patient reports good compliance with medication regimen. Discussed importance of regular exercise. Adjusted metformin dosage to better control morning glucose levels." }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Report</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Edit Report
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Download
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Patient Info Card */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-gray-500">{patient.id} • {patient.age} years • {patient.gender}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center text-gray-700">
                <Phone size={16} className="mr-2 text-gray-500" />
                <span>{patient.phone}</span>
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
                <span className="text-gray-700">{patient.address}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-500" />
                <span className="text-gray-700">Primary Care: {patient.doctor}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-500" />
                <span className="text-gray-700">Next Appointment: {patient.nextAppointment}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('medications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'medications' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medications
            </button>
            <button 
              onClick={() => setActiveTab('conditions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'conditions' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Conditions
            </button>
            <button 
              onClick={() => setActiveTab('labs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'labs' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lab Results
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notes' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notes
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Heart size={20} className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Blood Pressure</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{vitals.bloodPressure}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Activity size={20} className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Heart Rate</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{vitals.heartRate}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp size={20} className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Temperature</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{vitals.temperature}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock size={20} className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Respiratory Rate</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{vitals.respiratoryRate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Medications</h3>
                  <div className="space-y-4">
                    {medications.slice(0, 3).map((med, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-md mr-3">
                          <Clipboard size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{med.name}</h4>
                          <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Active Conditions</h3>
                  <div className="space-y-4">
                    {conditions.map((condition, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-md mr-3">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{condition.name}</h4>
                          <p className="text-sm text-gray-500">Diagnosed: {condition.diagnosedDate} • Status: {condition.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Medications Tab */}
          {activeTab === 'medications' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add Medication
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medication
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dosage
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frequency
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medications.map((med, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{med.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {med.dosage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {med.frequency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {med.purpose}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Conditions Tab */}
          {activeTab === 'conditions' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Medical Conditions</h3>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add Condition
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diagnosed Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {conditions.map((condition, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{condition.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {condition.diagnosedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            condition.status === 'Controlled' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {condition.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                          <button className="text-blue-600 hover:text-blue-900">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Lab Results Tab */}
          {activeTab === 'labs' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Laboratory Results</h3>
                <div>
                  <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded mr-2 hover:bg-gray-50">
                    All Results
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Add Results
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference Range
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {labResults.map((result, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{result.test}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {result.result}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {result.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {result.range}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.status === 'Normal' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Clinical Notes</h3>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add Note
                </button>
              </div>
              
              <div className="space-y-6">
                {notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{note.date}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {note.provider}
                      </div>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                    <div className="mt-3 flex justify-end">
                      <button className="text-sm text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">Print</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">Last Updated: May 14, 2025</p>
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-2 text-yellow-500" />
            <p className="text-sm text-gray-500">This report is for healthcare professional use only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}