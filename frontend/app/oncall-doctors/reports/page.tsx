"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

interface MonthlyVisit {
  month: string;
  count: number;
}

interface MonthlyLabTest {
  month: string;
  count: number;
}

interface CommonDisease {
  diagnosis_description: string;
  count: number;
}

interface MedicineResponse {
  medicines: CommonMedicine[];
}

interface CommonMedicine {
  medication__name: string;
  prescription_count: number;
}


export default function ReportDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [patientVisitsData, setPatientVisitsData] = useState<MonthlyVisit[]>([]);
  const [labTestsData, setLabTestsData] = useState<MonthlyLabTest[]>([]);
  const [commonDiseases, setCommonDiseases] = useState<CommonDisease[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [loadingLabTests, setLoadingLabTests] = useState(true);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [commonMedicines, setCommonMedicines] = useState<CommonMedicine[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingMedicines, setLoadingMedicines] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      setLoadingPatients(true);
      setError(null);

      const accessToken = localStorage.getItem("access");
      try {
        const response = await axios.get<{ patients: unknown; count: number }>(
          `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/total-patients/`,
          {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
          }
        );
        setCount(response.data.count);
      } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        setError(axiosError.response?.data?.error || "Failed to load patients");
      } finally {
        setLoadingPatients(false);
      }
    }

    fetchPatients();
  }, []);

  useEffect(() => {
    setIsClient(true);

    const fetchAllData = async () => {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        console.error("Access token not found in localStorage.");
        return;
      }

      try {
        const [visitsRes, labRes, diseaseRes, medRes ] = await Promise.all([
          axios.get<MonthlyVisit[]>(
            `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/monthly-visits/`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
          axios.get<MonthlyLabTest[]>(
            `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/monthly-lab-results/`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
          axios.get<CommonDisease[]>(
            `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/common-diseases/`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
          axios.get<MedicineResponse>( // Use the new interface
            `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/frequent-medicines`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
        ]);

        setPatientVisitsData(visitsRes.data);
        setLabTestsData(labRes.data);
        setCommonDiseases(diseaseRes.data);
        setCommonMedicines(medRes.data.medicines);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingVisits(false);
        setLoadingLabTests(false);
        setLoadingDiseases(false);
        setLoadingMedicines(false);
      }
    };

    fetchAllData();
  }, []);

  const capitalizeWords = (text: string): string =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  if (!isClient) return null;

  const totalVisits = patientVisitsData.reduce((sum, entry) => sum + entry.count, 0);
  const totalLabTests = labTestsData.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Medical Reports Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Total Patients</h3>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-3xl font-bold">{loadingPatients ? "Loading..." : count.toLocaleString()}</p>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Monthly Visits</h3>
          <p className="text-3xl font-bold">{loadingVisits ? "Loading..." : totalVisits}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Lab Tests (Total)</h3>
          <p className="text-3xl font-bold">{loadingLabTests ? "Loading..." : totalLabTests}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Active Prescriptions</h3>
          <p className="text-3xl font-bold">432</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Monthly Patient Visits</h2>
            {loadingVisits ? (
              <p className="text-gray-500">Loading chart...</p>
            ) : (
              <BarChart width={500} height={300} data={patientVisitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link href="/oncall-doctors/patient-visits-view-all" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Laboratory Tests</h2>
            {loadingLabTests ? (
              <p className="text-gray-500">Loading chart...</p>
            ) : (
              <BarChart width={500} height={300} data={labTestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link href="/doctor/laboratory-test-view-all" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Common Diseases</h2>
            {loadingDiseases ? (
              <p className="text-gray-500">Loading common diseases...</p>
            ) : (
              <PieChart width={500} height={300}>
                <Pie
                  data={commonDiseases}
                  cx={250}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="diagnosis_descriptions"
                  label={({ name }: { name: string }) => capitalizeWords(name)}
                >
                  {commonDiseases.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value,
                    capitalizeWords(name),
                  ]}
                />
              </PieChart>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link href="/doctor/common-diseases-view-all" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Frequent Medications</h2>
            {loadingMedicines ? (
              <p className="text-gray-500">Loading medications...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="space-y-3">
                {/* Show only top 5 medicines */}
                {commonMedicines.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-gray-50 p-3"
                  >
                    <span className="font-medium">{item.medication__name}</span>
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-white">
                      {item.prescription_count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link 
              href="/doctor/frequent-medicines-view-all" 
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
        </div>

      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Patient Demographics</h2>
            <div className="text-gray-500">Age/Gender distribution chart placeholder</div>
          </div>
          <div className="mt-4 text-right">
            <Link href="/reports/visits" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Diagnosis Trends</h2>
            <div className="text-gray-500">Diagnosis patterns over time placeholder</div>
          </div>
          <div className="mt-4 text-right">
            <Link href="/reports/visits" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}