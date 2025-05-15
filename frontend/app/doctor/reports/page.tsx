// app/reports/page.tsx

"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function ReportDashboard() {
  // Mock data
  const patientVisitsData = [
    { month: 'Jan', count: 65 },
    { month: 'Feb', count: 85 },
    { month: 'Mar', count: 95 },
    { month: 'Apr', count: 78 },
    { month: 'May', count: 88 },
  ];

  const commonDiseases = [
    { name: 'Hypertension', value: 45 },
    { name: 'Diabetes', value: 32 },
    { name: 'Common Cold', value: 28 },
    { name: 'Arthritis', value: 20 },
  ];

  const commonMedicines = [
    { medicine: 'Paracetamol', count: 120 },
    { medicine: 'Amoxicillin', count: 85 },
    { medicine: 'Losartan', count: 65 },
    { medicine: 'Metformin', count: 58 },
  ];

  const labTestsData = [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 55 },
    { month: 'Mar', count: 60 },
    { month: 'Apr', count: 52 },
    { month: 'May', count: 65 },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Medical Reports Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-gray-500">Total Patients</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-gray-500">Monthly Visits</h3>
          <p className="text-3xl font-bold">245</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-gray-500">Lab Tests (May)</h3>
          <p className="text-3xl font-bold">89</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-gray-500">Active Prescriptions</h3>
          <p className="text-3xl font-bold">432</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Patient Visits Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Monthly Patient Visits</h2>
          <BarChart width={500} height={300} data={patientVisitsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Lab Tests Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
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
        <div className="p-6 bg-white rounded-lg shadow-sm">
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Common Medications List */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Frequent Medications</h2>
          <div className="space-y-3">
            {commonMedicines.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">{item.medicine}</span>
                <span className="px-3 py-1 text-white bg-blue-500 rounded-full">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Patient Demographics</h2>
          <div className="text-gray-500">Age/Gender distribution chart placeholder</div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Diagnosis Trends</h2>
          <div className="text-gray-500">Diagnosis patterns over time placeholder</div>
        </div>
      </div>
    </div>
  );
}