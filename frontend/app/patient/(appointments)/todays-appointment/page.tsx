import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { XCircle, User, CheckCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="card m-6">
      <h1 className="mb-6 font-bold">Today&apos;s Appointment</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="flex">
              <User className="me-2 self-center rounded-full bg-muted" />
              <div className="flex flex-col">
                <span>Dr. Cara Stevens</span>
                <span className="text-xs text-muted-foreground">
                  Radiologist
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>June 12, 2020</span>
                <span className="text-xs text-muted-foreground">
                  9:00AM-10:00AM
                </span>
              </div>
            </TableCell>
            <TableCell>CT Scans</TableCell>
            <TableCell>0912 345 6789</TableCell>
            <TableCell className="text-green-600">Confirm</TableCell>
            <TableCell>Grand Plains Clinic</TableCell>
            <TableCell className="flex space-x-4">
              <CheckCircle className="cursor-pointer text-green-500 hover:fill-current" />
              <XCircle className="cursor-pointer text-red-500 hover:fill-current" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="flex">
              <User className="me-2 self-center rounded-full bg-muted" />
              <div className="flex flex-col">
                <span>Dr. Cara Stevens</span>
                <span className="text-xs text-muted-foreground">
                  Radiologist
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>June 12, 2020</span>
                <span className="text-xs text-muted-foreground">
                  9:00AM-10:00AM
                </span>
              </div>
            </TableCell>
            <TableCell>Heart Checkup</TableCell>
            <TableCell>0912 345 6789</TableCell>
            <TableCell className="text-red-600">Cancelled</TableCell>
            <TableCell>Genesis Hospital</TableCell>
            <TableCell className="flex space-x-4">
              <CheckCircle className="cursor-pointer text-green-500 hover:fill-current" />
              <XCircle className="cursor-pointer text-red-500 hover:fill-current" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="flex">
              <User className="me-2 self-center rounded-full bg-muted" />
              <div className="flex flex-col">
                <span>Dr. Cara Stevens</span>
                <span className="text-xs text-muted-foreground">
                  Radiologist
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>June 12, 2020</span>
                <span className="text-xs text-muted-foreground">
                  9:00AM-10:00AM
                </span>
              </div>
            </TableCell>
            <TableCell>Diabetes</TableCell>
            <TableCell>0912 345 6789</TableCell>
            <TableCell className="text-orange-600">Pending</TableCell>
            <TableCell>Genesis Laboratory</TableCell>
            <TableCell className="flex space-x-4">
              <CheckCircle className="cursor-pointer text-green-500 hover:fill-current" />
              <XCircle className="cursor-pointer text-red-500 hover:fill-current" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
