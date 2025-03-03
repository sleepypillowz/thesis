import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPenToSquare, FaFile, FaUser, FaNotesMedical, FaPrescription, FaRegCalendarCheck } from "react-icons/fa6";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Patient Profile</h1>
            <p className="mt-2 text-lg text-gray-500 font-medium">Medical records and health information</p>
          </div>
          <Button className="gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 border-2 border-blue-700">
            <FaPenToSquare className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Personal Information Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-150">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200">
                  <FaUser className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-normal">Juan Dela Cruz</h2>
                  <p className="text-gray-500 font-medium">Male • 48 years • 12/31/1975</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-4 border-r border-gray-100 pr-6">
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">CONTACT</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-base text-gray-700 font-medium">
                      <span className="text-gray-400">📞</span>
                      0911 505 3143
                    </p>
                    <p className="flex items-center gap-2 text-base text-gray-700 font-medium">
                      <span className="text-gray-400">✉️</span>
                      sampleemail@gmail.com
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pl-6">
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">MEDICAL DETAILS</h3>
                  <div className="space-y-2">
                    <p className="text-base text-gray-700"><span className="font-semibold">Last Consultation:</span> 12/31/2002</p>
                    <p className="text-base text-gray-700"><span className="font-semibold">Diagnosis:</span> Diabetes</p>
                    <p className="text-base text-gray-700"><span className="font-semibold">Allergies:</span> Penicillin, Pollen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-150">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 tracking-tight">
                  <FaRegCalendarCheck className="h-6 w-6 text-green-600" />
                  Appointments
                </h2>
                <Link href="/patient/appointments" className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 border-b border-transparent hover:border-blue-600">
                  View All
                  <FaPenToSquare className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg border-2 border-gray-100 p-4 hover:border-blue-200 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">Chest X-Ray</h3>
                    <p className="text-sm text-gray-500 font-medium">Dr. Johnny</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-base">December 06 2024</p>
                    <p className="text-sm text-gray-500 font-medium">10:30 AM</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-gray-100 p-4 hover:border-blue-200 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">Follow-up Consultation</h3>
                    <p className="text-sm text-gray-500 font-medium">Dr. Smith</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-base">January 15 2025</p>
                    <p className="text-sm text-gray-500 font-medium">02:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescriptions Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-150">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 tracking-tight">
                  <FaPrescription className="h-6 w-6 text-purple-600" />
                  Prescriptions
                </h2>
                <Link href="/patient/prescriptions" className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 border-b border-transparent hover:border-blue-600">
                  View All
                  <FaPenToSquare className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-150">
                    <tr className="text-left text-sm text-gray-500 font-semibold tracking-wide">
                      <th className="pb-3">Medication</th>
                      <th className="pb-3">Dosage</th>
                      <th className="pb-3">Frequency</th>
                      <th className="pb-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[1, 2, 3].map((item) => (
                      <tr key={item} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900 text-base">Paracetamol Biogesic</td>
                        <td className="py-3 text-gray-600 text-base">500mg</td>
                        <td className="py-3 text-gray-600 text-base">Twice daily</td>
                        <td className="py-3 text-gray-600 text-base">7 days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Medical History Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-l-4 border-orange-500">
              <h2 className="mb-4 flex items-center gap-2 pb-4 text-xl font-semibold text-gray-900 tracking-tight border-b border-gray-150">
                <FaNotesMedical className="h-6 w-6 text-orange-600" />
                Health Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">MEDICAL HISTORY</h3>
                  <p className="mt-2 text-gray-700 text-base leading-relaxed">Hypertension (1998), Hyperlipidemia (2000), Appendectomy (1985)</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">FAMILY HISTORY</h3>
                  <p className="mt-2 text-gray-700 text-base leading-relaxed">Father: Heart disease, Mother: Type 2 Diabetes</p>
                </div>
              </div>
            </div>

            {/* Lab Results Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-150">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 tracking-tight">
                  <FaFile className="h-6 w-6 text-red-600" />
                  Lab Results
                </h2>
                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 border-b border-transparent hover:border-blue-600">
                  View All
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border-2 border-gray-100 p-3 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaFile className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 text-base font-medium">Lab Result #{item}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg border-gray-300 font-medium">
                        View
                      </Button>
                      <Button size="sm" className="rounded-lg bg-blue-600 font-medium hover:bg-blue-700">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Card */}
            <div className="rounded-xl bg-blue-50 p-6 shadow-sm border-2 border-blue-200">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 tracking-tight">Clinical Notes</h2>
              <div className="space-y-3">
                <p className="text-gray-700 text-base font-medium">Diagnosis: Type 2 Diabetes</p>
                <ul className="list-disc space-y-2 pl-5 text-gray-600 text-base leading-relaxed">
                  <li>Diet and exercise counseling recommended</li>
                  <li>Follow up in 2 weeks for blood glucose monitoring</li>
                  <li>Consider medication adjustment if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}