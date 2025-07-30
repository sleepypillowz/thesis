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
          <TableRow>
            <TableCell>#A348</TableCell>
            <TableCell>Prescription 1</TableCell>
            <TableCell>Dr. Jacob Ryan</TableCell>
            <TableCell>12/05/2016</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="rounded-full border-red-500 text-red-500"
              >
                Fever
              </Badge>
            </TableCell>
            <TableCell className="flex space-x-2">
              <CloudDownload className="h-5 w-5 cursor-pointer text-purple-500 hover:fill-current" />
              <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
              <Trash className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#A348</TableCell>
            <TableCell>Prescription 1</TableCell>
            <TableCell>Dr. Jacob Ryan</TableCell>
            <TableCell>12/05/2016</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="rounded-full border-green-500 text-green-500"
              >
                Cholera
              </Badge>
            </TableCell>
            <TableCell className="flex space-x-2">
              <CloudDownload className="h-5 w-5 cursor-pointer text-purple-500 hover:fill-current" />
              <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
              <Trash className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#A348</TableCell>
            <TableCell>Prescription 1</TableCell>
            <TableCell>Dr. Jacob Ryan</TableCell>
            <TableCell>12/05/2016</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="rounded-full border-purple-500 text-purple-500"
              >
                Jaundice
              </Badge>
            </TableCell>
            <TableCell className="flex space-x-2">
              <CloudDownload className="h-5 w-5 cursor-pointer text-purple-500 hover:fill-current" />
              <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
              <Trash className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
