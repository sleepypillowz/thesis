"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  differenceInCalendarDays,
  isValid,
} from "date-fns";
import {parseISO} from "date-fns/parseISO";


interface Referral {
  id: number;
  patient: string;
  referring_doctor: string;
  receiving_doctor: string;
  reason: string;
  notes?: string;
  status: "pending" | "scheduled" | "canceled" | string;
  created_at: string;
  appointment_date: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(
        "http://localhost:8000/appointment/referrals/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch referrals");
      }
      const data: Referral[] = await res.json();
      setReferrals(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error occurred while fetching referrals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }); // prevent infinite fetching

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.warn("No token found");
          return;
        }

        const response = await fetch(
          "http://localhost:8000/user/users/whoami/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch user:", response.status, errorText);
          return;
        }

        const data = await response.json();
        console.log("Fetched user:", data);
        setCurrentUserId(data.id);
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    fetchCurrentUser();
  }, []);
  const handleEdit = (referralId: number) => {
    router.push(`/referrals/edit/${referralId}`);
  };


  const handleCancel = async (id: number) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `http://localhost:8000/appointment/referrals/${id}/decline/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to cancel referral");
      }
      const updatedReferral = await res.json();
      setReferrals((prev) =>
        prev.map((ref) => (ref.id === id ? updatedReferral : ref))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleProceed = (patient: string) => {
    router.push(`/doctor/treatment-details/${patient}/`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 w-full">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 w-full">
        <div className="p-6 w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div className="flex-shrink-0">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
                   2.502-1.667 1.732-3L13.732 4
                   c-.77-1.333-2.694-1.333-3.464 0
                   L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <div className="text-xl font-medium text-black">Error</div>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen px-6 py-8">
      <div className="max-w-full mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Referrals</h1>
        <p className="text-gray-500 mt-2">
          Manage your patient referrals and appointments
        </p>
      </div>

      {referrals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm w-full">
          <svg
            className="h-24 w-24 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M9 12h6m-6 4h6m2 5H7
                 a2 2 0 01-2-2V5
                 a2 2 0 012-2h5.586
                 a1 1 0 01.707.293l5.414 5.414
                 a1 1 0 01.293.707V19
                 a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No referrals found</p>
        </div>
      ) : (
        <div className="space-y-6 w-full">
          {referrals.map((referral) => {
            // Parse dates safely
            const createdAt = parseISO(referral.created_at || "");
            const appointmentAt = parseISO(referral.appointment_date || "");

            const createdOK = isValid(createdAt);
            const appointOK = isValid(appointmentAt);

            const formattedCreated = createdOK
              ? format(createdAt, "MMMM d, yyyy")
              : "Unknown date";

            // Compute appointment info only if valid and scheduled
            let appointmentSection = null;
            if (appointOK && referral.status === "scheduled") {
              const formattedWhen = format(appointmentAt, "MMMM d, yyyy");
              const formattedTime = format(appointmentAt, "h:mm a");
              const daysLeft = differenceInCalendarDays(
                appointmentAt,
                new Date()
              );

              let countdownText;
              if (daysLeft > 0) {
                countdownText = `${daysLeft} day${
                  daysLeft > 1 ? "s" : ""
                } left`;
              } else if (daysLeft === 0) {
                countdownText = "Today";
              } else {
                const ago = Math.abs(daysLeft);
                countdownText = `${ago} day${ago > 1 ? "s" : ""} ago`;
              }

              appointmentSection = (
                <div className="bg-blue-50 p-4 rounded-lg h-min">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3
                             m6-3a9 9 0 11-18 0
                             9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Appointment scheduled
                      </h3>
                      <div className="mt-1 text-sm text-blue-700">
                        <p>
                          {formattedWhen} at {formattedTime}
                        </p>
                        <p className="font-semibold mt-1">
                          {countdownText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={referral.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 w-full"
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {referral.patient}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          referral.status
                        )}`}
                      >
                        {referral.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3
                             m-9 8h10M5 21h14
                             a2 2 0 002-2V7
                             a2 2 0 00-2-2H5
                             a2 2 0 00-2 2v12
                             a2 2 0 002 2z"
                        />
                      </svg>
                      Created on {formattedCreated}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Reason for referral
                        </p>
                        <p className="text-gray-700">
                          {referral.reason}
                        </p>
                      </div>

                      {referral.notes && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Additional notes
                          </p>
                          <p className="text-gray-700">
                            {referral.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Referring Doctor
                        </p>
                        <p className="text-gray-700">
                          {referral.referring_doctor}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Receiving Doctor
                        </p>
                        <p className="text-gray-700">
                          {referral.receiving_doctor}
                        </p>
                      </div>
                    </div>

                    {appointmentSection}
                  </div>
                </div>

                {referral.status === "scheduled" && (
                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    {currentUserId === "LFG4YJ2P" && (
                      <button
                        onClick={() => handleEdit(referral.id)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(referral.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleProceed(referral.patient)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Proceed to Treatment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
