// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

import { User } from "@/app/designer/columns";

const appointments = [
  {
    id: "#A004",
    doctor: "Dr. K",
    profession: "Radiologist",
    date: "June 12 2020",
    time: "9:00AM-10:00AM",
    treatment: "Heart Checkup",
    contact: "0912 345 6789",
    status: "Confirmed",
    location: "Genesis Hospital",
  },
  {
    id: "#A003",
    doctor: "Dr. K",
    profession: "Radiologist",
    date: "June 12 2020",
    time: "9:00AM-10:00AM",
    treatment: "Heart Checkup",
    contact: "0912 345 6789",
    status: "Pending",
    location: "Genesis Hospital",
  },
  {
    id: "#A002",
    doctor: "Dr. K",
    profession: "Radiologist",
    date: "June 12 2020",
    time: "9:00AM-10:00AM",
    treatment: "Diabetes",
    contact: "0912 345 6789",
    status: "Cancelled",
    location: "Genesis Laboratory",
  },
  {
    id: "#A001",
    doctor: "Dr. K",
    profession: "Radiologist",
    date: "June 12 2020",
    time: "9:00AM-10:00AM",
    treatment: "CT Scans",
    contact: "0912 345 6789",
    status: "Done",
    location: "Grand Plains Clinic",
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



export { appointments, prescriptions, documents, users };
