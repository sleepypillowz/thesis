import Link from "next/link";
import { CircleArrowDown, FileText, Trash2 } from "lucide-react";

export default function PatientRecentDocuments() {
  return (
    <div className="card space-y-4">
      <div className="flex justify-between">
        <h1 className="font-bold">Recent Documents</h1>
        <Link href="/patient" className="text-blue-600 hover:underline">
          View All
        </Link>
      </div>
      <div className="flex justify-between rounded-xl border border-dashed border-muted-foreground p-2">
        <div className="ml-2 flex space-x-2">
          <FileText className="h-5 w-5 text-sm text-red-500" />
          <span className="text-sm">Blood Report</span>
        </div>
        <div className="mr-4 flex space-x-2">
          <Trash2 className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
          <CircleArrowDown className="h-5 w-5 cursor-pointer text-blue-600 hover:fill-current" />
        </div>
      </div>
      <div className="flex justify-between rounded-xl border border-dashed border-muted-foreground p-2">
        <div className="ml-2 flex space-x-2">
          <FileText className="h-5 w-5 text-sm text-blue-500" />
          <span className="text-sm">Mediclaim Documents</span>
        </div>
        <div className="mr-4 flex space-x-2">
          <Trash2 className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
          <CircleArrowDown className="h-5 w-5 cursor-pointer text-blue-600 hover:fill-current" />
        </div>
      </div>
      <div className="flex justify-between rounded-xl border border-dashed border-muted-foreground p-2">
        <div className="ml-2 flex space-x-2">
          <FileText className="h-5 w-5 text-sm text-muted-foreground" />
          <span className="text-sm">Doctor Prescriptions</span>
        </div>
        <div className="mr-4 flex space-x-2">
          <Trash2 className="h-5 w-5 cursor-pointer text-red-500 hover:fill-current" />
          <CircleArrowDown className="h-5 w-5 cursor-pointer text-blue-600 hover:fill-current" />
        </div>
      </div>
    </div>
  );
}
