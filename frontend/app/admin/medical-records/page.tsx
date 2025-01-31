"use client";
// import React, { useEffect, useState } from 'react';
// import { format } from 'date-fns';
// import { enGB } from 'date-fns/locale'

// interface Patient {
//   patient_id: string;
//   first_name: string;
//   middle_name: string;
//   last_name: string;
//   age: number;
//   queue_data: {
//     created_at: string;
//     status: string;
//   };
//   time: string;
//   complaint: string;

// }

// export default function Page() {
//   const [patients, setPatients] = useState<Patient[]>([]);

//   useEffect(() => {
//     // Fetch patient data from the Django API
//     const fetchPatients = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/patients/');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setPatients(data); // Set the fetched patient data
//       } catch (error) {
//         console.error('Error fetching patients:', error);
//       }
//     };
    

//     fetchPatients();
//   }, []);

//   return (
//     <div className="flex-1 px-4 pt-16 sm:px-6 lg:px-8">
//       <div className="mx-auto w-full max-w-7xl rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
//         <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">Patients</h1>
//         <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
//           <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((patient, index) => (
//               <tr key={patient.patient_id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
//                 <td className="px-6 py-4">{index + 1}</td>
//                 <td className="px-6 py-4">{patient.patient_id}</td>
//                 <td className="px-6 py-4">{patient.first_name} {patient.middle_name} {patient.last_name}</td>
//                 <td className="px-6 py-4">{patient.age}</td>
//                 <td className="px-6 py-4">{patient.queue_data && patient.queue_data.created_at ?
//                     format(new Date(patient.queue_data.created_at), "d MMMM yyyy", { locale: enGB }) :
//                     'N/A'}</td>
//                 <td className="px-6 py-4">{patient.queue_data && patient.queue_data.created_at ?
//                     format(new Date(patient.queue_data.created_at), "HH:mm:ss", { locale: enGB }) :
//                     'N/A'
//                   }</td>
//                 <td className="px-6 py-4">{patient.complaint}</td>
//                 <td className="px-6 py-4">{patient.queue_data.status}</td>
//                 <td className="px-6 py-4">
//                   <button type="submit" className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded">
//                     <i className="fas fa-eye"></i>
//                   </button>
//                   <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
//                     <i className="fas fa-edit"></i>
//                   </button>
//                   <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
//                     <i className="fas fa-trash"></i>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react"; // Importing useState and useEffect
import { Patient, columns } from "@/app/components/patient-columns";
import { DataTable } from "@/components/ui/data-table";

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Fetch patient data from the Django API or Supabase
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/patients/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPatients(data); // Set the fetched patient data
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    
    fetchPatients();
  }, []); // Empty dependency array, meaning this runs only once on mount.

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={patients} // Use the patients fetched from the API or Supabase
        filterColumn="patient_id"
        filterPlaceholder="Search patient name..."
      />
    </div>
  );
}
