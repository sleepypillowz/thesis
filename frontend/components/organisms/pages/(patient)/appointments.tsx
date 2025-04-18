"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the Referral type matching your backend model
interface Referral {
  id: number;
  patient: string;
  referring_doctor: string;
  receiving_doctor: string;
  reason: string;
  notes?: string;
  status: "pending" | "scheduled" | "canceled" | string;
  created_at: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to fetch referral list
  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch("http://localhost:8000/appointment/referrals/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch referrals");
      }
      const data: Referral[] = await res.json();
      setReferrals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error occurred while fetching referrals");
    } finally {
      setLoading(false);
    }
  };

  // Fetch referrals on mount
  useEffect(() => {
    fetchReferrals();
  });

  // Handler for cancel action
  const handleCancel = async (id: number) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`http://localhost:8000/appointment/referrals/${id}/decline/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to cancel referral");
      }
      const updatedReferral = await res.json();
      // Update the referrals in state
      setReferrals((prev) =>
        prev.map((ref) => (ref.id === id ? updatedReferral : ref))
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Handler for proceeding to treatment
  const handleProceed = (patient: string) => {
    router.push(`/doctor/treatment-details/${patient}/`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading referrals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Referrals</h1>
      {referrals.length === 0 ? (
        <p className="text-gray-600">No referrals found.</p>
      ) : (
        <ul className="space-y-4">
          {referrals.map((referral) => (
            <li key={referral.id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">
                    Patient: <span className="font-normal">{referral.patient}</span>
                  </p>
                  <p>
                    <strong>Reason:</strong> {referral.reason}
                  </p>
                  <p>
                    <strong>Status:</strong> {referral.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(referral.created_at).toLocaleString()}
                  </p>
                  {referral.notes && (
                    <p className="mt-1">
                      <strong>Notes:</strong> {referral.notes}
                    </p>
                  )}
                </div>
                {referral.status === "scheduled" && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleProceed(referral.patient)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Proceed to Treatment
                    </button>
                    <button
                      onClick={() => handleCancel(referral.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
