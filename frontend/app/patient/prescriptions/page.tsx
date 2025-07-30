import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CloudDownload, Eye, Trash } from "lucide-react";

export default function PatientPrescriptions() {
  const prescriptions = [
    {
      id: "#A003",
      title: "Prescription 1",
      createdby: "Dr. Jacob Ryan",
      date: "	12/05/2016",
      disease: "Fever",
    },
    {
      id: "#A002",
      title: "Prescription 1",
      createdby: "Dr. Jacob Ryan",
      date: "	12/05/2016",
      disease: "Cholera",
    },
    {
      id: "#A001",
      title: "Prescription 1",
      createdby: "Dr. Jacob Ryan",
      date: "	12/05/2016",
      disease: "Jaundice",
    },
  ];

  return (
    <div className="card m-6">
      <h1 className="font-bold">Prescription</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Diseases</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.createdby}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`rounded-full ${
                    item.disease === "Fever"
                      ? "border-red-500 text-red-500"
                      : item.disease === "Cholera"
                      ? "border-green-500 text-green-500"
                      : item.disease === "Jaundice"
                      ? "border-purple-500 text-purple-500"
                      : item.disease === "Jaundice"
                  }`}
                >
                  {item.disease}
                </Badge>
              </TableCell>
              <TableCell className="flex space-x-2">
                <CloudDownload className="h-5 w-5 cursor-pointer text-blue-500 hover:fill-current" />
                <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
                <Trash className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
