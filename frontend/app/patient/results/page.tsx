import Link from "next/link";
import { FaFile } from "react-icons/fa6";

export default function Page() {
  return (
    <div className="flex-1 px-8 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <h1 className="mb-4 text-3xl font-semibold text-foreground">View Results</h1>
        <div className="card flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaFile className="text-accent" />
            <p className="text-left">Juan Dela Cruz Lab Result</p>
          </div>

          <div className="flex space-x-4">
            <Link href="/#" className="text-blue-500 hover:text-blue-700">View</Link>
            <Link href="/#" className="text-blue-500 hover:text-blue-700">Download</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
