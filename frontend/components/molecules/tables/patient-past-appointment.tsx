import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheck, User } from "lucide-react";

export default function PatientPastAppointment() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Doctor</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Treatment</TableHead>
          <TableHead>Contact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="flex">
            <User className="me-2 self-center rounded-full bg-muted" />
            <div className="flex flex-col">
              <span>Dr. Cara Stevens</span>
              <span className="text-xs text-muted-foreground">Radiologist</span>
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
          <TableCell>
            <CircleCheck className="text-green-500" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex">
            <User className="me-2 self-center rounded-full bg-muted" />
            <div className="flex flex-col">
              <span>Dr. Cara Stevens</span>
              <span className="text-xs text-muted-foreground">Radiologist</span>
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
          <TableCell>
            <CircleCheck className="text-green-500" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex">
            <User className="me-2 self-center rounded-full bg-muted" />
            <div className="flex flex-col">
              <span>Dr. Cara Stevens</span>
              <span className="text-xs text-muted-foreground">Radiologist</span>
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
          <TableCell>
            <CircleCheck className="text-green-500" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
