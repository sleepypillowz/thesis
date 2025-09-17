"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Pill } from "lucide-react";
import Link from "next/link";

interface CommonMedicine {
  medication__name: string;
  prescription_count: number;
}

interface ForecastResult {
  medicine_id: number;
  name: string;
  mse: number | null;
  r2: number | null;
  forecast_next_3_months: number[];
}

// Define the API response structure
interface PredictionApiResponse {
  results?: unknown[];
}

// Define the raw prediction item structure from API
interface RawPredictionItem {
  medicine_id?: unknown;
  name?: unknown;
  mse?: unknown;
  r2?: unknown;
  forecast_next_3_months?: unknown;
}

export default function FrequentMedicinesViewAll() {
  const [medicines, setMedicines] = useState<CommonMedicine[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState<string | null>(null);

  const [predictions, setPredictions] = useState<ForecastResult[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [predictionsError, setPredictionsError] = useState<string | null>(null);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          throw new Error("Authentication required");
        }
        console.log('NEXT_PUBLIC_API_BASE=', process.env.NEXT_PUBLIC_API_BASE);
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
        setMedicinesError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setMedicinesLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const fetchPredictions = async () => {
    try {
      setPredictionsLoading(true);
      setPredictionsError(null);
      setShowPredictions(true);

      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("Authentication required");
      }

      const response = await axios.get<PredictionApiResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE}/medicine/predict/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Ensure results is always an array
      const rawResults: RawPredictionItem[] = Array.isArray(
        response.data?.results
      )
        ? (response.data.results as RawPredictionItem[])
        : [];

      // Optional debugging
      console.log("Raw prediction results:", rawResults);

      // Deduplicate by medicine_id (keep first occurrence)
      const uniqueMap = new Map<number, RawPredictionItem>();
      for (const item of rawResults) {
        // item might be missing medicine_id — guard for that
        const id = Number(item?.medicine_id);
        if (!Number.isNaN(id) && !uniqueMap.has(id)) {
          uniqueMap.set(id, item);
        }
      }

      const uniquePredictions: ForecastResult[] = Array.from(
        uniqueMap.values()
      ).map((item: RawPredictionItem) => ({
        medicine_id: Number(item.medicine_id),
        name: String(item.name ?? ""),
        mse: item.mse == null ? null : Number(item.mse),
        r2: item.r2 == null ? null : Number(item.r2),
        forecast_next_3_months: Array.isArray(item.forecast_next_3_months)
          ? (item.forecast_next_3_months as unknown[]).map((v: unknown) =>
              v == null ? 0 : Number(v)
            )
          : [],
      }));

      setPredictions(uniquePredictions);
    } catch (err) {
      setPredictionsError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setPredictionsLoading(false);
    }
  };

  if (medicinesLoading) {
    return <LoadingState />;
  }

  if (medicinesError) {
    return <ErrorState error={medicinesError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                All Frequent Medications
              </h2>
              <Link
                href="/doctor/reports"
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <p className="mt-1 text-gray-600">
              Complete list of frequently prescribed medications
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Prescription Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {medicines.length > 0 ? (
                  medicines.map((medicine, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{index + 1}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="mr-3 rounded-md bg-blue-100 p-2">
                            <Pill className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {medicine.medication__name}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold leading-5 text-blue-800">
                          {medicine.prescription_count.toLocaleString()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Pill className="mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                          No medication data found
                        </h3>
                        <p className="max-w-md text-gray-600">
                          Medication reports will appear here once prescriptions
                          are recorded.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {medicines.length} medications
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Prescription Forecast
            </h2>
            <button
              onClick={fetchPredictions}
              disabled={predictionsLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {predictionsLoading ? "Predicting..." : "Predict"}
            </button>
          </div>

          {showPredictions && (
            <div className="overflow-hidden rounded-xl bg-white shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      MSE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      R²
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Forecast (Next 3 Months)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {predictionsLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center">
                        <div className="flex justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : predictionsError ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-red-500"
                      >
                        {predictionsError}
                      </td>
                    </tr>
                  ) : predictions.length > 0 ? (
                    predictions.map((item) => (
                      <tr
                        key={item.medicine_id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="flex items-center whitespace-nowrap px-6 py-4">
                          <div className="mr-3 rounded-md bg-blue-100 p-2">
                            <Pill className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.name}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {typeof item.mse === "number"
                            ? item.mse.toFixed(2)
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {typeof item.r2 === "number"
                            ? item.r2.toFixed(3)
                            : "N/A"}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {Array.isArray(item.forecast_next_3_months)
                            ? item.forecast_next_3_months.map((val, idx) => (
                                <span
                                  key={idx}
                                  className="mr-2 inline-block rounded-lg bg-green-100 px-2 py-1 text-xs text-green-800"
                                >
                                  {typeof val === "number"
                                    ? val.toFixed(1)
                                    : "N/A"}
                                </span>
                              ))
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No predictions yet. Click Predict to fetch results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Header = () => (
  <div className="mb-8 flex items-center space-x-3">
    <div className="rounded-lg bg-blue-600 p-2">
      <Pill className="h-6 w-6 text-white" />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Medication Report</h1>
      <p className="mt-1 text-gray-600">
        Comprehensive view of frequently prescribed medications
      </p>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">
        Loading medication data...
      </p>
      <p className="text-gray-500">
        Please wait while we fetch the latest information
      </p>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="max-w-md rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-800">
        Error Loading Medications
      </h2>
      <p className="mb-4 text-gray-600">{error}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
        <Link
          href="/doctor/reports"
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
);
