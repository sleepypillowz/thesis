import { Patient, columns } from "@/app/components/patient-columns"
import { DataTable } from "@/components/ui/data-table"

async function getData(): Promise<Patient[]> {
  // Fetch data from your API here.
  return [
    {
      no: "01",
      idCode: "#FDAK32424",
      patientName: "Juan Dela Cruz",
      age: 20,
      createdDate: "23 November 2023",
      time: "09:22 pm",
      complaint: "Sample",
      status: "Success",
    },
    {
      no: "01",
      idCode: "#FDAK32424",
      patientName: "Juan Dela Cruz",
      age: 20,
      createdDate: "23 November 2023",
      time: "09:22 pm",
      complaint: "Sample",
      status: "Success",
    },
    {
      no: "01",
      idCode: "#FDAK32424",
      patientName: "Juan Dela Cruz",
      age: 20,
      createdDate: "23 November 2023",
      time: "09:22 pm",
      complaint: "Sample",
      status: "Pending",
    },
    // ...
  ]
}

export default async function PatientsPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} filterColumn="patientName" filterPlaceholder="Search patient name..." />
    </div>
  )
}

