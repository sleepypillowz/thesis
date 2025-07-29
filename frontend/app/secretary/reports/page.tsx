"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

interface MonthlyVisit {
  month: string;
  count: number;
}

export default function ReportDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [patientVisitsData, setPatientVisitsData] = useState<MonthlyVisit[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchPatientVisits = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get<MonthlyVisit[]>(
          `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/monthly-visits/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPatientVisitsData(response.data);
      } catch (error) {
        console.error("Error fetching patient visits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientVisits();
  }, []);
  if (!isClient) return null;

  const totalVisits = patientVisitsData.reduce(
    (sum, entry) => sum + entry.count,
    0
  );

  const commonDiseases = [
    { name: "Hypertension", value: 45 },
    { name: "Diabetes", value: 32 },
    { name: "Common Cold", value: 28 },
    { name: "Arthritis", value: 20 },
  ];

  const commonMedicines = [
    { medicine: "Paracetamol", count: 120 },
    { medicine: "Amoxicillin", count: 85 },
    { medicine: "Losartan", count: 65 },
    { medicine: "Metformin", count: 58 },
  ];

  const labTestsData = [
    { month: "Jan", count: 45 },
    { month: "Feb", count: 55 },
    { month: "Mar", count: 60 },
    { month: "Apr", count: 52 },
    { month: "May", count: 65 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        Medical Reports Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Total Patients</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Monthly Visits</h3>
          <p className="text-3xl font-bold">
            {loading ? "Loading..." : totalVisits}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Lab Tests (May)</h3>
          <p className="text-3xl font-bold">89</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Active Prescriptions</h3>
          <p className="text-3xl font-bold">432</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Visits Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Monthly Patient Visits</h2>
          {loading ? (
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

        {/* Lab Tests Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Laboratory Tests</h2>
          <BarChart width={500} height={300} data={labTestsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Common Diseases Pie Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Common Diseases</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={commonDiseases}
              cx={250}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {commonDiseases.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Common Medications List */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Frequent Medications</h2>
          <div className="space-y-3">
            {commonMedicines.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 p-3"
              >
                <span className="font-medium">{item.medicine}</span>
                <span className="rounded-full bg-blue-500 px-3 py-1 text-white">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Reports */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Patient Demographics</h2>
          <div className="text-gray-500">
            Age/Gender distribution chart placeholder
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Diagnosis Trends</h2>
          <div className="text-gray-500">
            Diagnosis patterns over time placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
