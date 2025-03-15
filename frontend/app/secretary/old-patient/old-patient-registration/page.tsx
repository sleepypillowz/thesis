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
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(
    null
  );
  const [complaint, setComplaint] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch queue data for a given patient id
  const fetchQueueForPatient = async (
    patient_id: string
  ): Promise<QueueData> => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `http://127.0.0.1:8000/patient/get-queue/?patient_id=${patient_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
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
      const token = localStorage.getItem('access');
      const res = await fetch(
        "http://127.0.0.1:8000/patient/patient-register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

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
      const token = localStorage.getItem("access");
      const url = `http://127.0.0.1:8000/patient/search-patients/?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching queue data:", error.message);
      } else {
        console.error("An unknown error occurred.");
      }
      return { complaint: "General Illness" };
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const clearSelection = () => {
    setSelectedPatient(null);
    setComplaint("");
  };

  return (
    <div className="rounded-2xl border border-blue-50 bg-white p-8 shadow-lg">
      <header className="mb-8">
        <div className="mb-2 flex items-center space-x-3">
          <div className="rounded-full bg-blue-100 p-3">
            <FaClipboardList className="text-xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Patient Registration
          </h1>
        </div>
        <p className="ml-12 text-slate-500">
          Find a patient record and update their complaint information
        </p>

        {/* Search Bar */}
        <div className="relative mt-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <FaSearch className="text-blue-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name, email, or phone..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-12 pr-4 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 p-2 text-sm font-medium text-slate-500">
                {searchResults.length} results found
              </div>
              {searchResults.map((result) => (
                <div
                  key={result.patient_id}
                  onClick={() => handleSelectPatient(result)}
                  className="flex cursor-pointer items-center border-b border-slate-100 px-4 py-3 transition-colors last:border-0 hover:bg-blue-50"
                >
                  <div className="mr-3 flex-shrink-0 rounded-full bg-blue-100 p-2">
                    <FaUserAlt className="text-blue-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">
                      {result.first_name}{" "}
                      {result.middle_name ? result.middle_name + " " : ""}
                      {result.last_name}
                    </p>
                    <p className="text-sm text-slate-500">{result.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-400">
                    ID: {result.patient_id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {successMessage && (
        <div className="mb-4 rounded bg-green-100 p-4 text-green-800">
          {successMessage}
        </div>
      )}

      {!selectedPatient ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
          <FaUserAlt className="mx-auto mb-4 text-4xl text-slate-300" />
          <h3 className="mb-2 text-xl font-medium text-slate-600">
            No Patient Selected
          </h3>
          <p className="mx-auto max-w-md text-slate-500">
            Search for a patient using the search box above to view and update
            their information.
          </p>
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-0 top-0 text-slate-400 transition-colors hover:text-red-500"
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
            <div className="mb-6 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-white p-3 shadow-sm">
                  <FaUserAlt className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedPatient.first_name}{" "}
                    {selectedPatient.middle_name
                      ? selectedPatient.middle_name + " "
                      : ""}
                    {selectedPatient.last_name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    ID: {selectedPatient.patient_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Contact Information */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-4 flex items-center font-medium text-slate-700">
                  <FaPhoneAlt className="mr-2 text-blue-500" /> Contact
                  Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Email
                    </label>
                    <div className="flex items-center rounded border border-slate-200 bg-white p-3">
                      <FaEnvelope className="mr-3 text-slate-400" />
                      <span>{selectedPatient.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Phone Number
                    </label>
                    <div className="flex items-center rounded border border-slate-200 bg-white p-3">
                      <FaPhoneAlt className="mr-3 text-slate-400" />
                      <span>{selectedPatient.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-4 flex items-center font-medium text-slate-700">
                  <FaUserAlt className="mr-2 text-blue-500" /> Personal
                  Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Date of Birth
                    </label>
                    <div className="flex items-center rounded border border-slate-200 bg-white p-3">
                      <FaCalendarAlt className="mr-3 text-slate-400" />
                      <span>
                        {new Date(
                          selectedPatient.date_of_birth
                        ).toLocaleDateString()}
                      </span>
                      <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        Age: {selectedPatient.age}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Address
                    </label>
                    <div className="flex items-center rounded border border-slate-200 bg-white p-3">
                      <FaMapMarkerAlt className="mr-3 flex-shrink-0 text-slate-400" />
                      <span className="line-clamp-1">
                        {selectedPatient.street_address},{" "}
                        {selectedPatient.barangay},{" "}
                        {selectedPatient.municipal_city}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Field */}
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-6">
              <label className="mb-3 flex items-center font-medium text-slate-700">
                <FaRegCommentDots className="mr-2 text-blue-500" /> Current
                Complaint
              </label>
              <select
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="General Illness">General Illness</option>
                <option value="Injury">Injury</option>
                <option value="Check-up">Check-up</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-4 pt-6 md:flex-row">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg border border-slate-200 px-6 py-3 text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 md:flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 md:flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
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
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center rounded-lg bg-white px-4 py-2 text-slate-600 shadow-sm transition-colors hover:text-blue-600"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        <PatientRegistrationForm />
      </div>
    </div>
  );
}
