// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

import { User } from "@/app/designer/columns";
import { Appointment } from "@/app/patient/(appointments)/columns";

export const appointments: Appointment[] = [
  {
    patient_name: "Juan Dela Cruz",
    doctor_name: "Dr. Maria Santos",
    date: "2025-09-01",
    start_time: "09:00",
    end_time: "09:30",
    location: "Room 101",
    status: "Scheduled",
  },
  {
    patient_name: "Ana Reyes",
    doctor_name: "Dr. Jose Ramirez",
    date: "2025-09-01",
    start_time: "10:00",
    end_time: "10:45",
    location: "Room 102",
    status: "Completed",
  },
  {
    patient_name: "Carlos Mendoza",
    doctor_name: "Dr. Liza Cruz",
    date: "2025-09-02",
    start_time: "11:00",
    end_time: "11:30",
    location: "Room 103",
    status: "Cancelled",
  },
  {
    patient_name: "Sofia Lopez",
    doctor_name: "Dr. Manuel Torres",
    date: "2025-09-02",
    start_time: "13:00",
    end_time: "13:30",
    location: "Room 104",
    status: "Scheduled",
  },
  {
    patient_name: "Miguel Garcia",
    doctor_name: "Dr. Elena Flores",
    date: "2025-09-03",
    start_time: "14:00",
    end_time: "14:45",
    location: "Room 105",
    status: "Scheduled",
  },
  {
    patient_name: "Isabella Cruz",
    doctor_name: "Dr. Roberto Mendoza",
    date: "2025-09-03",
    start_time: "15:00",
    end_time: "15:30",
    location: "Room 106",
    status: "Completed",
  },
  {
    patient_name: "Gabriel Ramos",
    doctor_name: "Dr. Patricia Castillo",
    date: "2025-09-04",
    start_time: "09:30",
    end_time: "10:00",
    location: "Room 107",
    status: "Scheduled",
  },
  {
    patient_name: "Camila Fernandez",
    doctor_name: "Dr. Victor Hernandez",
    date: "2025-09-04",
    start_time: "11:00",
    end_time: "11:30",
    location: "Room 108",
    status: "Rescheduled",
  },
  {
    patient_name: "Diego Santos",
    doctor_name: "Dr. Andrea Gutierrez",
    date: "2025-09-05",
    start_time: "13:00",
    end_time: "13:45",
    location: "Room 109",
    status: "Scheduled",
  },
  {
    patient_name: "Lucia Morales",
    doctor_name: "Dr. Ramon Perez",
    date: "2025-09-05",
    start_time: "14:30",
    end_time: "15:00",
    location: "Room 110",
    status: "Completed",
  },
  {
    patient_name: "Antonio Delgado",
    doctor_name: "Dr. Cristina Alvarez",
    date: "2025-09-06",
    start_time: "16:00",
    end_time: "16:30",
    location: "Room 111",
    status: "Scheduled",
  },
];


const prescriptions = [
  {
    id: "#A003",
    title: "Prescription 1",
    createdby: "Dr. Jacob Ryan",
    date: "12/05/2016",
    disease: "Fever",
  },
  {
    id: "#A002",
    title: "Prescription 1",
    createdby: "Dr. Jacob Ryan",
    date: "12/05/2016",
    disease: "Cholera",
  },
  {
    id: "#A001",
    title: "Prescription 1",
    createdby: "Dr. Jacob Ryan",
    date: "12/05/2016",
    disease: "Jaundice",
  },
];

const documents = [
  {
    id: 1,
    name: "Blood Report",
    color: "text-red-600",
  },
  {
    id: 2,
    name: "Mediclaim Documents",
    color: "text-blue-600",
  },
  {
    id: 3,
    name: "Doctor Prescriptions",
    color: "text-muted-foreground",
  },
];

const users = [
  {
    id: 1,
    email: "alice.smith@example.com",
    first_name: "Alice",
    last_name: "Smith",
    role: "admin",
    is_active: true,
  },
  {
    id: 2,
    email: "bob.jones@example.com",
    first_name: "Bob",
    last_name: "Jones",
    role: "doctor",
    is_active: true,
  },
  {
    id: 3,
    email: "carol.taylor@example.com",
    first_name: "Carol",
    last_name: "Taylor",
    role: "secretary",
    is_active: false,
  },
  {
    id: 4,
    email: "david.lee@example.com",
    first_name: "David",
    last_name: "Lee",
    role: "doctor",
    is_active: true,
  },
  {
    id: 5,
    email: "ella.wilson@example.com",
    first_name: "Ella",
    last_name: "Wilson",
    role: "secretary",
    is_active: true,
  },
  {
    id: 6,
    email: "frank.miller@example.com",
    first_name: "Frank",
    last_name: "Miller",
    role: "admin",
    is_active: false,
  },
  {
    id: 7,
    email: "grace.davis@example.com",
    first_name: "Grace",
    last_name: "Davis",
    role: "doctor",
    is_active: true,
  },
  {
    id: 8,
    email: "henry.moore@example.com",
    first_name: "Henry",
    last_name: "Moore",
    role: "secretary",
    is_active: true,
  },
  {
    id: 9,
    email: "isla.anderson@example.com",
    first_name: "Isla",
    last_name: "Anderson",
    role: "admin",
    is_active: true,
  },
  {
    id: 10,
    email: "jack.white@example.com",
    first_name: "Jack",
    last_name: "White",
    role: "doctor",
    is_active: false,
  },
  {
    id: 11,
    email: "kate.harris@example.com",
    first_name: "Kate",
    last_name: "Harris",
    role: "secretary",
    is_active: true,
  },
] as const satisfies User[];



export { prescriptions, documents, users };
