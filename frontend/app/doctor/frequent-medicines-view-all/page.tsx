"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Pill } from "lucide-react";
import Link from "next/link";

interface CommonMedicine {
  medication__name: string;
  prescription_count: number;
}

export default function FrequentMedicinesViewAll() {
  const [medicines, setMedicines] = useState<CommonMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          throw new Error("Authentication required");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/frequent-medicines/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.medicines) {
          setMedicines(response.data.medicines);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">All Frequent Medications</h2>
              <Link 
                href="/doctor/reports" 
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <p className="text-gray-600 mt-1">
              Complete list of frequently prescribed medications
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prescription Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicines.length > 0 ? (
                  medicines.map((medicine, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-md p-2 mr-3">
                            <Pill className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {medicine.medication__name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {medicine.prescription_count.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Pill className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No medication data found
                        </h3>
                        <p className="text-gray-600 max-w-md">
                          Medication reports will appear here once prescriptions are recorded.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {medicines.length} medications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Header = () => (
  <div className="mb-8 flex items-center space-x-3">
    <div className="p-2 bg-blue-600 rounded-lg">
      <Pill className="h-6 w-6 text-white" />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Medication Report</h1>
      <p className="text-gray-600 mt-1">
        Comprehensive view of frequently prescribed medications
      </p>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">Loading medication data...</p>
      <p className="text-gray-500">Please wait while we fetch the latest information</p>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Medications</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Try Again
        </button>
        <Link 
          href="/doctor/reports"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
);