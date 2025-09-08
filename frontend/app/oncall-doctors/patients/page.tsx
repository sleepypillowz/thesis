import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, User } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="card m-6">
      <h1 className="mb-6 font-bold">Patients</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age/Sex</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="flex">
              <User className="me-2 self-center rounded-full bg-muted" />
              <span>John Doe</span>
            </TableCell>
            <TableCell>30/M</TableCell>
            <TableCell>Fever</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="rounded-full border-red-500 text-red-500"
              >
                Sepsis
              </Badge>
            </TableCell>
            <TableCell>2:00PM</TableCell>
            <TableCell>
              <Link href="/oncall-doctors" className="text-blue-500">
                <Eye className="cursor-pointer text-green-500 hover:fill-current"></Eye>
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
