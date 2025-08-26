"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import userRole from "@/hooks/userRole";
import { FileText, Eye, Download, PlusCircle } from "lucide-react";
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
  doctor_info?: DoctorProfile;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
}
interface QueueData {
  id: number;
  priority_level: string;
  status: string;
  created_at: string;
  complaint: string;
  queue_number: string;
}

interface PatientInfo {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  queue_data?: QueueData;
}

interface TreatmentDetails {
  patient_info: PatientInfo;
  recent_treatment?: TreatmentRecord;
  previous_treatments: TreatmentRecord[];
}
interface User {
  id: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}

interface LabResult {
  id: string;
  image_url: string;
  uploaded_at: string;
  submitted_by?: User;
}

{
  /* Doctors referral */
}
interface DoctorProfile {
  name: string;
  specialization: string;
}

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  doctor_profile: DoctorProfile;
}

export default function TreatmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { patient_id } = params;
  const [treatmentDetails, setTreatmentDetails] =
    useState<TreatmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "latest" | "history" | "laboratory"
  >("latest");

  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [labLoading, setLabLoading] = useState(false);
  const [labError, setLabError] = useState<string | null>(null);
  {
    /*Referral*/
  }
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedReferrals, setSelectedReferrals] = useState<
    Record<string, { reason: string; notes: string }>
  >({});
  const role = userRole();

  const getFileNameFromUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.pathname.split("/").pop() || `lab-result.pdf`;
    } catch {
      return `lab-result.pdf`;
    }
  };
  const handleDownload = async (result: LabResult) => {
    // Get the access token from localStorage
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    // Construct the API URL using the lab result's ID
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/patient/lab-results/${result.id}/download/`;

    try {
      // Call the API endpoint with the Bearer token for authentication
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} ${response.statusText}`
        );
      }

      // Get the file as a Blob from the response
      const blob = await response.blob();

      // Create an object URL from the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;

      // Try to extract filename from the Content-Disposition header; if not available, use a fallback function
      const disposition = response.headers.get("Content-Disposition");
      let filename = getFileNameFromUrl(result.image_url); // Fallback filename
      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      link.download = filename;

      // Append the link, click it, and remove it from the document
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Revoke the object URL to free memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "laboratory") {
      setLabLoading(true);
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/patient/lab-results/${patient_id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch lab results");
          return res.json();
        })
        .then((data) => {
          // Handle array of results from backend
          if (data.lab_results && Array.isArray(data.lab_results)) {
            setLabResults(data.lab_results);
          } else {
            throw new Error("Invalid lab results data format");
          }
          setLabLoading(false);
        })
        .catch((err) => {
          setLabError(err.message || "Something went wrong");
          setLabLoading(false);
        });
    }
  }, [activeTab, patient_id]);

  useEffect(() => {
    if (!patient_id) {
      setError("No patient ID found in route parameters.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/patient/patient-treatment-view-details/${patient_id}/`;
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
      setError("No access token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        // Optionally, if you need to massage data (e.g., mapping "patient" to "patient_info"):
        const dataWithPatientInfo = {
          ...data,
          patient_info: data.patient,
        };
        setTreatmentDetails(dataWithPatientInfo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching treatment:", error);
        setError("Failed to load treatment details. Please try again later.");
        setIsLoading(false);
      });
  }, [patient_id]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Reset states
        setIsLoading(true);
        setError(null);

        // Validate access token
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        // Make API call
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/user/users/?role=doctor`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch doctors");
        }

        // Process response data
        const data = await response.json();

        // Update both doctors and filteredDoctors state
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        // Handle errors
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load doctors list";
        setError(errorMessage);
        console.error("Doctors fetch error:", error);
      } finally {
        // Update loading state
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array = runs once on mount

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredDoctors(
      doctors.filter(
        (d) =>
          `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
          d.doctor_profile.specialization.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, doctors]);

  // Toggle doctor selection
  const toggleDoctor = (id: string) => {
    setSelectedReferrals((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { reason: "", notes: "" };
      return next;
    });
  };

  const handleFieldChange = (
    id: string,
    field: "reason" | "notes",
    value: string
  ) => {
    setSelectedReferrals((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Submit bulk referrals
  const handleSendReferrals = async () => {
    const payload = Object.entries(selectedReferrals).map(
      ([receiving_doctor, data]) => ({
        patient: patient_id,
        receiving_doctor,
        reason: data.reason,
        notes: data.notes,
      })
    );
    if (!payload.length) {
      alert("Select at least one doctor and fill details.");
      return;
    }
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/appointment-referral/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Error");
      setIsReferModalOpen(false);
      setSelectedReferrals({});
      setSearchQuery("");
      alert("Referrals sent");
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        alert(e.message);
      } else {
        console.error("Unexpected error", e);
        alert("An unexpected error occurred.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  if (!role) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Patient Information Header */}
          {treatmentDetails && !isLoading && !error && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-600">
                    {treatmentDetails.patient_info.first_name.charAt(0)}
                    {treatmentDetails.patient_info.last_name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold md:text-3xl">
                      {treatmentDetails.patient_info.first_name}{" "}
                      {treatmentDetails.patient_info.middle_name &&
                        `${treatmentDetails.patient_info.middle_name.charAt(
                          0
                        )}. `}
                      {treatmentDetails.patient_info.last_name}
                    </h1>
                    <div className="mt-1 flex flex-col text-sm text-blue-100 sm:flex-row sm:items-center">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {treatmentDetails.patient_info.email}
                      </span>
                      <span className="mt-1 flex items-center sm:ml-4 sm:mt-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {treatmentDetails.patient_info.phone_number}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                    Patient ID: {patient_id}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Treatment Title Section */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-white to-blue-50 p-6 shadow-sm md:p-8">
            <div className="flex flex-col items-start sm:flex-row sm:items-center">
              {/* Title + Subtitle */}
              <div>
                <h2 className="flex items-center text-2xl font-bold text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
               M9 5a2 2 0 002 2h2a2 2 0 002-2
               M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Treatment Records
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage patient treatment history
                </p>
              </div>

              {/* Button Group Container – flush right with extra spacing and design */}
              <div className="ml-auto flex items-center space-x-2 rounded-lg p-2 backdrop-blur-sm">
                <button
                  onClick={() => setIsReferModalOpen(true)}
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 font-medium text-white transition-shadow duration-200 hover:bg-blue-700 hover:shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M8 9a3 3 0 100-6 3 3 0 000 6z
                   M8 11a6 6 0 016 6H2a6 6 0 016-6z
                   M16 7a1 1 0 10-2 0v1h-1a1 1 
                   0 100 2h1v1a1 1 0 102 0v-1h1
                   a1 1 0 100-2h-1V7z"
                    />
                  </svg>
                  Refer Patient
                </button>

                <button
                  onClick={() => {
                    const q =
                      treatmentDetails?.patient_info?.queue_data?.queue_number;
                    if (q) {
                      router.push(
                        `/oncall-doctors/treatment-form/${patient_id}/${q}`
                      );
                    } else {
                      alert("Queue number not found for this patient");
                    }
                  }}
                  className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 font-medium text-white transition-shadow duration-200 hover:bg-green-700 hover:shadow-lg"
                >
                  <PlusCircle className="h-5 w-5" />
                  Treat Patient
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab("latest")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "latest"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Latest Treatment
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Treatment History
              </button>
              <button
                onClick={() => setActiveTab("laboratory")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "laboratory"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Laboratory Result
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                <p className="mt-4 font-medium text-gray-600">
                  Loading treatment data...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            treatmentDetails && (
              <div className="p-6 md:p-8">
                {/* Latest Treatment Tab */}
                {activeTab === "latest" && (
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Treatment on{" "}
                          {treatmentDetails.recent_treatment
                            ? formatDate(
                                treatmentDetails.recent_treatment.created_at
                              )
                            : "No treatment yet"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Record ID:{" "}
                          {treatmentDetails.recent_treatment
                            ? treatmentDetails.recent_treatment.id
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created by:{" "}
                          {treatmentDetails.recent_treatment?.doctor_info?.name}
                        </p>
                        <p className="text-sm text-blue-400">
                          {
                            treatmentDetails.recent_treatment?.doctor_info
                              ?.specialization
                          }
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-6">
                      <h3 className="mb-4 text-lg font-medium text-gray-900">
                        Treatment Notes
                      </h3>
                      <p className="rounded-lg border border-gray-100 bg-white p-4 text-gray-700 shadow-sm">
                        {treatmentDetails.recent_treatment?.treatment_notes ||
                          "No treatment notes available"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Diagnoses Section */}
                      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-blue-50 p-5">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-5 w-5 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <h3 className="font-medium text-gray-900">
                              Diagnoses
                            </h3>
                          </div>
                        </div>

                        <div className="p-5">
                          {treatmentDetails.recent_treatment?.diagnoses &&
                          treatmentDetails.recent_treatment.diagnoses.length >
                            0 ? (
                            <ul className="divide-y divide-gray-100">
                              {treatmentDetails.recent_treatment?.diagnoses?.map(
                                (d, index) => (
                                  <li
                                    key={`${d.diagnosis_code}-${index}`}
                                    className="py-3"
                                  >
                                    <div className="flex items-start">
                                      <span className="mr-3 inline-flex h-6 w-auto min-w-[3rem] items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-medium text-blue-800">
                                        {d.diagnosis_code}
                                      </span>
                                      <p className="text-gray-700">
                                        {d.diagnosis_description}
                                      </p>
                                    </div>
                                    {d.diagnosis_date && (
                                      <p className="ml-12 mt-1 text-sm text-gray-500">
                                        Diagnosed:{" "}
                                        {formatDate(d.diagnosis_date)}
                                      </p>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <div className="flex h-32 flex-col items-center justify-center text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mb-2 h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <p>No diagnoses recorded</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Prescriptions Section */}
                      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-green-50 p-5">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-5 w-5 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                              />
                            </svg>
                            <h3 className="font-medium text-gray-900">
                              Prescriptions
                            </h3>
                          </div>
                        </div>

                        <div className="p-5">
                          {treatmentDetails.recent_treatment?.prescriptions &&
                          treatmentDetails.recent_treatment.prescriptions
                            .length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                              {treatmentDetails.recent_treatment?.prescriptions?.map(
                                (p, index) => (
                                  <li
                                    key={`${p.medication}-${index}`}
                                    className="py-3"
                                  >
                                    <div className="flex items-center">
                                      <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                          />
                                        </svg>
                                      </span>
                                      <div className="flex-1">
                                        <h4 className="text-base font-medium text-gray-900">
                                          {p.medication?.name}
                                        </h4>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                            {p.dosage}
                                          </span>
                                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                            {p.frequency}
                                          </span>
                                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                            {p.quantity}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {(p.start_date || p.end_date) && (
                                      <div className="ml-11 mt-2 text-sm text-gray-500">
                                        <div className="flex space-x-4">
                                          {p.start_date && (
                                            <span>
                                              Start: {formatDate(p.start_date)}
                                            </span>
                                          )}
                                          {p.end_date && (
                                            <span>
                                              End: {formatDate(p.end_date)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <div className="flex h-32 flex-col items-center justify-center text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mb-2 h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2h.01"
                                />
                              </svg>
                              <p>No prescriptions recorded</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Treatment History Tab */}
                {activeTab === "history" && (
                  <div>
                    {treatmentDetails.previous_treatments.length > 0 ? (
                      <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Previous Treatments
                        </h2>

                        <div className="relative">
                          <div className="absolute left-5 h-full w-0.5 bg-gray-200"></div>
                          <div className="space-y-8">
                            {treatmentDetails.previous_treatments.map(
                              (treatment) => (
                                <div key={treatment.id} className="relative">
                                  {/* Timeline connector */}
                                  <div className="absolute -left-1 mt-1.5 h-10 w-10 rounded-full border-4 border-gray-200 bg-white"></div>

                                  <div className="ml-14">
                                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                      <div className="p-5">
                                        {/* Treatment Header */}
                                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                          <div className="mb-2 flex items-center sm:mb-0">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="mr-2 h-5 w-5 text-gray-400"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                              />
                                            </svg>
                                            <div>
                                              <span className="block font-medium text-gray-700">
                                                {formatDate(
                                                  treatment.created_at
                                                )}
                                              </span>
                                              {treatment.doctor_info && (
                                                <span className="text-sm text-gray-500">
                                                  Created by:{" "}
                                                  {treatment.doctor_info.name}
                                                </span>
                                              )}
                                              <p className="text-sm text-blue-400">
                                                {
                                                  treatment.doctor_info
                                                    ?.specialization
                                                }
                                              </p>
                                            </div>
                                          </div>
                                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            ID: {treatment.id}
                                          </span>
                                        </div>

                                        {/* Treatment Notes */}
                                        <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                          <h3 className="mb-2 font-medium text-gray-700">
                                            Treatment Notes
                                          </h3>
                                          <p className="text-gray-600">
                                            {treatment.treatment_notes ||
                                              "No specific notes provided"}
                                          </p>
                                        </div>

                                        {/* Expandable Details */}
                                        <details className="group">
                                          <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg p-2 font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700">
                                            <span>View Treatment Details</span>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-5 w-5 transition-transform group-open:rotate-180"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                          </summary>

                                          {/* Diagnosis and Prescriptions */}
                                          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* Diagnoses Section */}
                                            <div className="rounded-lg bg-gray-50 p-4">
                                              <h3 className="mb-3 font-medium text-gray-700">
                                                Diagnoses (
                                                {treatment.diagnoses.length})
                                              </h3>
                                              {treatment.diagnoses.length >
                                              0 ? (
                                                <ul className="space-y-2">
                                                  {treatment.diagnoses.map(
                                                    (d, idx) => (
                                                      <li
                                                        key={`${d.diagnosis_code}-${idx}`}
                                                        className="rounded-lg border border-gray-100 bg-white p-2"
                                                      >
                                                        <div className="flex items-start">
                                                          <span className="mr-2 inline-flex h-6 w-auto min-w-[3rem] items-center justify-center rounded bg-gray-100 px-2 text-xs font-medium text-gray-700">
                                                            {d.diagnosis_code}
                                                          </span>
                                                          <span className="text-gray-600">
                                                            {
                                                              d.diagnosis_description
                                                            }
                                                          </span>
                                                        </div>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              ) : (
                                                <p className="italic text-gray-500">
                                                  No diagnoses recorded
                                                </p>
                                              )}
                                            </div>

                                            {/* Prescriptions Section */}
                                            <div className="rounded-lg bg-gray-50 p-4">
                                              <h3 className="mb-3 font-medium text-gray-700">
                                                Prescriptions (
                                                {treatment.prescriptions.length}
                                                )
                                              </h3>
                                              {treatment.prescriptions.length >
                                              0 ? (
                                                <ul className="space-y-2">
                                                  {treatment.prescriptions.map(
                                                    (p, idx) => (
                                                      <li
                                                        key={`${p.medication}-${idx}`}
                                                        className="rounded-lg border border-gray-100 bg-white p-2"
                                                      >
                                                        <div className="font-medium text-gray-700">
                                                          {p.medication?.name ||
                                                            "Unnamed Medication"}
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                                                          <span className="rounded bg-gray-50 px-2 py-0.5">
                                                            Dosage: {p.dosage}
                                                          </span>
                                                          <span className="rounded bg-gray-50 px-2 py-0.5">
                                                            Frequency:{" "}
                                                            {p.frequency}
                                                          </span>
                                                          {p.quantity && (
                                                            <span className="rounded bg-gray-50 px-2 py-0.5">
                                                              Quantity:{" "}
                                                              {p.quantity}
                                                            </span>
                                                          )}
                                                        </div>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              ) : (
                                                <p className="italic text-gray-500">
                                                  No prescriptions recorded
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </details>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mb-4 h-16 w-16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mb-1 text-xl font-medium text-gray-500">
                          No Previous Treatments
                        </h3>
                        <p className="text-gray-400">
                          This patient doesnt have any treatment history
                          records.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Laboratory Results Tab Content */}
                {activeTab === "laboratory" && (
                  <div className="">
                    <div className="mb-4 rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center text-sm font-medium text-gray-500">
                        <div className="flex-1">File Name</div>
                        <div className="w-32 text-right">Upload Date</div>
                        <div className="w-24 text-right">Actions</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {labLoading && (
                        <div className="p-4 text-center text-gray-500">
                          Loading lab results...
                        </div>
                      )}

                      {labError && (
                        <div className="p-4 text-center text-red-500">
                          Error: {labError}
                        </div>
                      )}

                      {!labLoading && !labError && labResults.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No lab results found for this patient
                        </div>
                      )}

                      {labResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center rounded-md border bg-white p-4 hover:bg-gray-50"
                        >
                          <div className="flex flex-1 items-center">
                            <FileText
                              size={20}
                              className="mr-3 text-blue-500"
                            />
                            <span className="font-medium">
                              {getFileNameFromUrl(result.image_url)}
                            </span>
                          </div>

                          <div className="w-32 text-right text-sm text-gray-500">
                            {new Date(result.uploaded_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </div>

                          <div className="flex w-24 justify-end space-x-2">
                            <button
                              onClick={() =>
                                window.open(result.image_url, "_blank")
                              }
                              className="rounded-md p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                              aria-label="View file"
                            >
                              <Eye size={18} />
                            </button>

                            <button
                              onClick={() => handleDownload(result)}
                              className="rounded-md p-2 text-gray-600 hover:bg-green-50 hover:text-green-600"
                              aria-label="Download file"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {isReferModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-300 animate-in fade-in">
                    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border/50 bg-card shadow-lg duration-300 animate-in zoom-in-95">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between border-b border-border bg-muted/30 p-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-primary"
                            >
                              <path
                                d="M9 6L15 12L9 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="border-b border-gray-200 p-1">
                            <h3 className="text-lg font-medium">Referral</h3>
                            <p className="mt-0 text-sm text-gray-400">
                              You can select one or more referral
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsReferModalOpen(false)}
                          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18M6 6L18 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Modal Content */}
                      <div className="space-y-4 p-5">
                        {/* Search Input */}
                        <div className="relative">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            <path
                              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search doctors..."
                            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>

                        {/* Doctors List */}
                        <div className="h-96 overflow-y-auto rounded-lg border border-border">
                          {filteredDoctors.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                              <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mb-3 text-muted-foreground"
                              >
                                <path
                                  d="M10 21H14M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM9 9H9.01M15 9H15.01M9.5 15C9.82379 15.3358 10.7333 16 12 16C13.2667 16 14.1762 15.3358 14.5 15"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <p className="text-muted-foreground">
                                No doctors found matching your search.
                              </p>
                            </div>
                          ) : (
                            <div className="divide-y divide-border">
                              {filteredDoctors.map((doctor) => {
                                const sel = !!selectedReferrals[doctor.id];
                                return (
                                  <div
                                    key={doctor.id}
                                    className={`p-4 transition-all ${
                                      sel ? "bg-primary/5" : "hover:bg-muted/50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {sel ? (
                                          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-primary bg-primary/10">
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="text-primary"
                                            >
                                              <path
                                                d="M20 6L9 17L4 12"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </div>
                                        ) : (
                                          <div className="h-5 w-5 rounded-md border border-border"></div>
                                        )}
                                        <div>
                                          <h4 className="font-medium">
                                            {doctor.first_name}{" "}
                                            {doctor.last_name}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            {
                                              doctor.doctor_profile
                                                .specialization
                                            }
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => toggleDoctor(doctor.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                          sel
                                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        }`}
                                      >
                                        {sel ? "Deselect" : "Select"}
                                      </button>
                                    </div>

                                    {/* Referral Details - Animate in/out */}
                                    {sel && (
                                      <div className="mt-4 space-y-4 pl-8 duration-300 animate-in slide-in-from-top-2">
                                        <div>
                                          <label className="mb-1.5 block text-sm font-medium">
                                            Referral Reason
                                          </label>
                                          <input
                                            type="text"
                                            value={
                                              selectedReferrals[doctor.id]
                                                .reason
                                            }
                                            onChange={(e) =>
                                              handleFieldChange(
                                                doctor.id,
                                                "reason",
                                                e.target.value
                                              )
                                            }
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            placeholder="Enter referral reason..."
                                          />
                                        </div>
                                        <div>
                                          <label className="mb-1.5 block text-sm font-medium">
                                            Referral Notes
                                          </label>
                                          <textarea
                                            value={
                                              selectedReferrals[doctor.id].notes
                                            }
                                            onChange={(e) =>
                                              handleFieldChange(
                                                doctor.id,
                                                "notes",
                                                e.target.value
                                              )
                                            }
                                            className="h-24 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            placeholder="Add any additional notes..."
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Selected Count Banner */}
                        {Object.keys(selectedReferrals).length > 0 && (
                          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3 text-primary">
                            <span className="text-sm font-medium">
                              {Object.keys(selectedReferrals).length} doctor
                              {Object.keys(selectedReferrals).length !== 1
                                ? "s"
                                : ""}{" "}
                              selected
                            </span>
                            <button
                              onClick={() => {
                                // Clear all selections
                                setSelectedReferrals({});
                              }}
                              className="text-sm hover:underline"
                            >
                              Clear all
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      <div className="flex justify-end gap-3 border-t border-border bg-muted/30 p-5">
                        <button
                          onClick={() => setIsReferModalOpen(false)}
                          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSendReferrals}
                          disabled={Object.keys(selectedReferrals).length === 0}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            Object.keys(selectedReferrals).length === 0
                              ? "bg-primary/60 text-primary-foreground cursor-not-allowed"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          Send{" "}
                          {Object.keys(selectedReferrals).length > 0
                            ? `(${Object.keys(selectedReferrals).length})`
                            : ""}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
