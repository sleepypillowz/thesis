"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRegCommentDots,
  FaSearch,
  FaArrowLeft,
  FaClipboardList,
} from "react-icons/fa";

export interface PatientData {
  patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  // Removed complaint from PatientData
  street_address: string;
  barangay: string;
  municipal_city: string;
  age: number;
}

export interface QueueData {
  complaint: string;
  // Removed priority_level input from the queue data because it will be auto-determined
}

const PatientRegistrationForm: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [complaint, setComplaint] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Fetch queue data for a given patient id
  const fetchQueueForPatient = async (patient_id: string): Promise<QueueData> => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/patient/get-queue/?patient_id=${patient_id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching queue data:", error);
      return { complaint: "General Illness" };
    }
  };

  // Handle submission for re-registration (only complaint is sent)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    setIsSubmitting(true);
    setSuccessMessage("");
    
    try {
      const payload = {
        patient_id: selectedPatient.patient_id,
        complaint: complaint,
      };
  
      const res = await fetch("http://127.0.0.1:8000/patient/patient-register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (res.ok) {
        console.log("Patient registration updated:", data);
        setSuccessMessage("Patient registration updated successfully.");
        setSelectedPatient(null);
        setComplaint("");
      } else {
        console.error("Submitted data:", data);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch matching patients from your API
  const searchPatients = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/patient/search-patients/?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSearchResults(data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search as the user types
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPatients(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // When a patient is selected, fetch their current complaint
  const handleSelectPatient = async (patient: PatientData) => {
    setSelectedPatient(patient);
    try {
      const queueData = await fetchQueueForPatient(patient.patient_id);
      setComplaint(queueData.complaint || "General Illness");
    } catch (error) {
      setComplaint("General Illness");
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const clearSelection = () => {
    setSelectedPatient(null);
    setComplaint("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-50 p-8">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaClipboardList className="text-blue-600 text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Patient Registration</h1>
        </div>
        <p className="text-slate-500 ml-12">
          Find a patient record and update their complaint information
        </p>
        
        {/* Search Bar */}
        <div className="mt-6 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-blue-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name, email, or phone..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {searchResults.length > 0 && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto">
              <div className="p-2 text-sm font-medium text-slate-500 border-b border-slate-100">
                {searchResults.length} results found
              </div>
              {searchResults.map((result) => (
                <div
                  key={result.patient_id}
                  onClick={() => handleSelectPatient(result)}
                  className="cursor-pointer px-4 py-3 hover:bg-blue-50 transition-colors flex items-center border-b border-slate-100 last:border-0"
                >
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                    <FaUserAlt className="text-blue-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">
                      {result.first_name} {result.middle_name ? result.middle_name + " " : ""}{result.last_name}
                    </p>
                    <p className="text-sm text-slate-500">{result.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-1">
                    ID: {result.patient_id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {!selectedPatient ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <FaUserAlt className="mx-auto text-4xl text-slate-300 mb-4" />
          <h3 className="text-xl font-medium text-slate-600 mb-2">No Patient Selected</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Search for a patient using the search box above to view and update their information.
          </p>
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-0 top-0 text-slate-400 hover:text-red-500 transition-colors"
          >
            <span className="sr-only">Clear selection</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                  <FaUserAlt className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {selectedPatient.first_name} {selectedPatient.middle_name ? selectedPatient.middle_name + " " : ""}{selectedPatient.last_name}
                  </h3>
                  <p className="text-slate-500 text-sm">ID: {selectedPatient.patient_id}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-4 flex items-center">
                  <FaPhoneAlt className="mr-2 text-blue-500" /> Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Email</label>
                    <div className="flex items-center bg-white p-3 rounded border border-slate-200">
                      <FaEnvelope className="text-slate-400 mr-3" />
                      <span>{selectedPatient.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Phone Number</label>
                    <div className="flex items-center bg-white p-3 rounded border border-slate-200">
                      <FaPhoneAlt className="text-slate-400 mr-3" />
                      <span>{selectedPatient.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-4 flex items-center">
                  <FaUserAlt className="mr-2 text-blue-500" /> Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Date of Birth</label>
                    <div className="flex items-center bg-white p-3 rounded border border-slate-200">
                      <FaCalendarAlt className="text-slate-400 mr-3" />
                      <span>{new Date(selectedPatient.date_of_birth).toLocaleDateString()}</span>
                      <span className="ml-auto bg-slate-100 text-slate-600 text-xs rounded-full px-2 py-1">
                        Age: {selectedPatient.age}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Address</label>
                    <div className="flex items-center bg-white p-3 rounded border border-slate-200">
                      <FaMapMarkerAlt className="text-slate-400 mr-3 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {selectedPatient.street_address}, {selectedPatient.barangay}, {selectedPatient.municipal_city}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Field */}
            <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <label className="flex items-center text-slate-700 font-medium mb-3">
                <FaRegCommentDots className="mr-2 text-blue-500" /> Current Complaint
              </label>
              <select
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="General Illness">General Illness</option>
                <option value="Injury">Injury</option>
                <option value="Check-up">Check-up</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={clearSelection}
                className="py-3 px-6 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 md:flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center md:flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  "Register Patient"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        <PatientRegistrationForm />
      </div>
    </div>
  );
}
