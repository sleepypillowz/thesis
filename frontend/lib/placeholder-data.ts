// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

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

export { appointments, prescriptions, documents };
