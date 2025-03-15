"use client";

import Link from "next/link";

export default function AssessmentIndexPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold">
          Patient Preliminary Assessment
        </h1>
        <p>
          This is the landing page for preliminary assessments. Navigate to the
          registration queue to begin.
        </p>
        <Link href="/doctor/registration-queue">
          <a className="text-blue-600 underline">Go to Registration Queue</a>
        </Link>
      </div>
    </div>
  );
}
