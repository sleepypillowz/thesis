"use client";

// imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInCalendarDays, isValid } from "date-fns";
import { parseISO } from "date-fns/parseISO";

// Doctor interface to match API response
interface DoctorInfo {
  id: string;
  full_name: string;
  email?: string;
  role?: string;
  specialization?: string;
}

// shape of referral object - updated to match API
interface Referral {
  id: number;
  patient: string;
  referring_doctor: DoctorInfo; // Changed from string to DoctorInfo
  receiving_doctor: DoctorInfo; // Changed from string to DoctorInfo
  reason: string;
  notes?: string;
  status: "pending" | "scheduled" | "canceled" | string;
  created_at: string;
  appointment_date: string;
}

export default function ReferralsPage() {
  // state variables
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(
    null
  );

  // fetch referrals from backend
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/appointment/referrals/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch referrals");
        const data = await res.json();
        setReferrals(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching referrals"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [router]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/user/users/whoami/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;
        const data = await response.json();
        setCurrentUserId(data.id);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleEdit = (referral: Referral) => setSelectedReferral(referral);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = {
      reason: formData.get("reason"),
      notes: formData.get("notes"),
      appointment_date: formData.get("appointment_date"),
    };

    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/appointment/referrals/${selectedReferral.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      const updatedReferral = await res.json();
      setReferrals((prev) =>
        prev.map((ref) =>
          ref.id === updatedReferral.id ? updatedReferral : ref
        )
      );
      setSelectedReferral(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/appointment/referrals/${id}/decline/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Cancel failed");
      const updatedReferral = await res.json();
      setReferrals((prev) =>
        prev.map((ref) => (ref.id === id ? updatedReferral : ref))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleProceed = (patient: string) =>
    router.push(`/oncall-doctors/treatment-details/${patient}/`);

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

  if (loading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex animate-pulse space-x-2">
          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="mx-auto flex w-full max-w-3xl items-center space-x-4 rounded-xl bg-white p-6 shadow-md">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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

  return (
    <div className="min-h-screen w-full bg-slate-50 px-6 py-8">
      {/* Edit Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Edit Referral
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Reason for Referral
                  </label>
                  <input
                    name="reason"
                    defaultValue={selectedReferral.reason}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={selectedReferral.notes || ""}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="appointment_date"
                    defaultValue={
                      selectedReferral.appointment_date
                        ? format(
                            parseISO(selectedReferral.appointment_date),
                            "yyyy-MM-dd'T'HH:mm"
                          )
                        : ""
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedReferral(null)}
                  className="rounded-lg px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mx-auto mb-8 max-w-full">
        <h1 className="text-3xl font-bold text-gray-900">Your Referrals</h1>
        <p className="mt-2 text-gray-500">
          Manage your patient referrals and appointments
        </p>
      </div>

      {referrals.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center rounded-xl bg-white p-12 shadow-sm">
          <svg
            className="mb-4 h-24 w-24 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg text-gray-500">No referrals found</p>
        </div>
      ) : (
        <div className="w-full space-y-6">
          {referrals.map((referral) => {
            const createdAt = parseISO(referral.created_at || "");
            const appointmentAt = parseISO(referral.appointment_date || "");
            const formattedCreated = isValid(createdAt)
              ? format(createdAt, "MMMM d, yyyy")
              : "Unknown date";

            let appointmentSection = null;
            if (isValid(appointmentAt) && referral.status === "scheduled") {
              const formattedWhen = format(appointmentAt, "MMMM d, yyyy");
              const formattedTime = format(appointmentAt, "h:mm a");
              const daysLeft = differenceInCalendarDays(
                appointmentAt,
                new Date()
              );
              const countdownText =
                daysLeft > 0
                  ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
                  : daysLeft === 0
                  ? "Today"
                  : `${Math.abs(daysLeft)} day${
                      Math.abs(daysLeft) > 1 ? "s" : ""
                    } ago`;

              appointmentSection = (
                <div className="h-min rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start">
                    <div className="mt-1 flex-shrink-0">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
                        <p className="mt-1 font-semibold">{countdownText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={referral.id}
                className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between">
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
                        className="mr-1 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Created on {formattedCreated}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Reason for referral
                        </p>
                        <p className="text-gray-700">{referral.reason}</p>
                      </div>
                      {referral.notes && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Additional notes
                          </p>
                          <p className="text-gray-700">{referral.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Referring Doctor</p>
                        <p className="text-gray-700">
                          {referral.referring_doctor.full_name}
                        </p>
                        {referral.referring_doctor.specialization && (
                          <p className="text-xs text-gray-500">
                            {referral.referring_doctor.specialization}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Receiving Doctor</p>
                        <p className="text-gray-700">
                          {referral.receiving_doctor.full_name}
                        </p>
                        {referral.receiving_doctor.specialization && (
                          <p className="text-xs text-gray-500">
                            {referral.receiving_doctor.specialization}
                          </p>
                        )}
                      </div>
                    </div>

                    {appointmentSection && (
                      <div className="md:col-span-1">
                        {appointmentSection}
                      </div>
                    )}
                  </div>
                </div>

                {referral.status === "scheduled" && (
                  <div className="flex justify-end space-x-3 bg-gray-50 px-6 py-4">
                    {currentUserId === "cooper-020006" && (
                      <button
                        onClick={() => handleEdit(referral)}
                        className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(referral.id)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleProceed(referral.patient)}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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