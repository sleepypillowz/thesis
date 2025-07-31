import AppointmentTable from "@/app/patient/components/appointment-table";

export default function Page() {
  const appointments = [
    {
      id: "#A003",
      doctor: "Dr. K",
      profession: "Radiologist",
      date: "June 12 2020",
      time: "9:00AM-10:00AM",
      treatment: "CT Scans",
      contact: "0912 345 6789",
      location: "Grand Plains Clinic",
      status: "Confirmed",
    },
    {
      id: "#A002",
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
      id: "#A001",
      doctor: "Dr. K",
      profession: "Radiologist",
      date: "June 12 2020",
      time: "9:00AM-10:00AM",
      treatment: "Diabetes",
      contact: "0912 345 6789",
      status: "Confirmed",
      location: "Genesis Laboratory",
    },
  ];

  return (
    <AppointmentTable appointments={appointments} title="Today's Appointment" />
  );
}
