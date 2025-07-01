import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CloudDownload, Eye, Printer } from "lucide-react";

export default function Page() {
  return (
    <div className="card m-6">
      <h1 className="font-bold">Prescription</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No</TableHead>
            <TableHead>Doctor Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#A348</TableCell>
            <TableCell>Dr. Jacob Ryan</TableCell>
            <TableCell>04/03/2016</TableCell>
            <TableCell>$40</TableCell>
            <TableCell>10%</TableCell>
            <TableCell>$5</TableCell>
            <TableCell>$39</TableCell>
            <TableCell className="flex space-x-2">
              <CloudDownload className="h-5 w-5 cursor-pointer text-purple-500 hover:fill-current" />
              <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
              <Printer className="h-5 w-5 cursor-pointer text-blue-500 hover:fill-current" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#A348</TableCell>
            <TableCell>Dr. Jacob Ryan</TableCell>
            <TableCell>04/03/2016</TableCell>
            <TableCell>$40</TableCell>
            <TableCell>10%</TableCell>
            <TableCell>$5</TableCell>
            <TableCell>$39</TableCell>
            <TableCell className="flex space-x-2">
              <CloudDownload className="h-5 w-5 cursor-pointer text-purple-500 hover:fill-current" />
              <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
              <Printer className="h-5 w-5 cursor-pointer text-blue-500 hover:fill-current" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#A348</TableCell>
            <TableCell>Dr. Jacob Ryan</TableCell>
            <TableCell>04/03/2016</TableCell>
            <TableCell>$40</TableCell>
            <TableCell>10%</TableCell>
            <TableCell>$5</TableCell>
            <TableCell>$39</TableCell>
            <TableCell className="flex space-x-2">
              <CloudDownload className="h-5 w-5 cursor-pointer text-purple-500 hover:fill-current" />
              <Eye className="h-5 w-5 cursor-pointer text-green-500 hover:fill-current" />
              <Printer className="h-5 w-5 cursor-pointer text-blue-500 hover:fill-current" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
