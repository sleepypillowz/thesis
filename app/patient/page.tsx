import Link from "next/link"
import { FaPenToSquare, FaFile } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="flex-1 px-8 py-8 pt-24">
      <div className="flex justify-center">
        <div className="mx-auto max-w-7xl rounded-lg">
          <div className="grid grid-cols-2 gap-4">

            <nav className="col-span-2 rounded-lg border-2 border-solid border-gray-300 p-3 bg-white">
              <ul className="flex justify-between">
                <li>
                  <Link href="/"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/profile"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/appointments"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Appointments</span>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/prescriptions"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Prescriptions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/results"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>View Results</span>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/booking"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Make a Booking</span>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/queue"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Queue</span>
                  </Link>
                </li>

                <li>
                  <Link href="/patient/find-doctor"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Find a Doctor</span>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/contact"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
            </nav>


            <section className="col-span-2">
              <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">Profile</h1>
              <div
                className="grid grid-cols-1 items-center justify-center gap-12 rounded-lg border-2 border-solid border-gray-300 py-4 sm:grid-cols-2 bg-white">

                <div className="text-center">
                  <div className="mb-4">
                    <p className="text-lg font-bold text-blue-700">JUAN DELA CRUZ</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Male | 12/31/1975</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg font-bold text-gray-500">Contact Details</p>
                    <p className="text-gray-700 dark:text-gray-300">0911 505 3143</p>
                    <p className="text-gray-700 dark:text-gray-300">sampleemail@gmail.com</p>
                  </div>
                </div>

                <div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Date of Last Consultation</p>
                    <p className="text-gray-600 dark:text-gray-400">12/31/2002</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Diagnosis</p>
                    <p className="text-gray-600 dark:text-gray-400">Diabetes</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Allergies</p>
                    <p className="text-gray-600 dark:text-gray-400">Penicillin, Pollen</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Medical History</p>
                    <p className="text-gray-600 dark:text-gray-400">Hypertension (diagnosed 1998), Hyperlipidemia (diagnosed
                      2000), Appendectomy (1985)</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Family History</p>
                    <p className="text-gray-600 dark:text-gray-400">Father with history of heart disease, Mother with Type 2
                      Diabetes</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="col-span-2">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Appointments</h1>
              <div className="flex justify-center bg-white">
                <button type="button"
                  className="mb-2 me-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">DOCTORS
                  APPOINTMENT</button>
                <button type="button"
                  className="mb-2 me-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">PATIENT
                  APPOINTMENT REQUEST</button>
              </div>

              <table
                className="w-full border-2 border-solid border-gray-300 text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-4">Type</th>
                    <th scope="col" className="px-4 py-4">Date</th>
                    <th scope="col" className="px-4 py-4">Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td className="px-4 py-4">Chest X-Ray</td>
                    <td className="px-4 py-4">December 06 2024</td>
                    <td className="px-4 py-4">Dr. Johnny</td>
                  </tr>
                </tbody>
              </table>
              <Link href="/patient{% url 'appointments' %}"
                className="flex items-center justify-end space-x-2 text-blue-500 hover:text-blue-700">
                <span>View all Appointments</span>
                <FaPenToSquare />
              </Link>
            </section>


            <section className="col-span-2">
              <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">Prescriptions</h1>
              <table
                className="w-full border-2 border-solid border-gray-300 text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-4">Drug Name</th>
                    <th scope="col" className="px-4 py-4">No. of Units</th>
                    <th scope="col" className="px-4 py-4">Dosage</th>
                    <th scope="col" className="px-4 py-4">No. of Days</th>
                    <th scope="col" className="px-4 py-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td className="px-4 py-4">Paracetamol Biogesic</td>
                    <td className="px-4 py-4">2</td>
                    <td className="px-4 py-4">Twice</td>
                    <td className="px-4 py-4">7</td>
                    <td className="px-4 py-4">10:30</td>
                  </tr>
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td className="px-4 py-4">Paracetamol Biogesic</td>
                    <td className="px-4 py-4">2</td>
                    <td className="px-4 py-4">Twice</td>
                    <td className="px-4 py-4">7</td>
                    <td className="px-4 py-4">10:30</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-4">Paracetamol Biogesic</td>
                    <td className="px-4 py-4">2</td>
                    <td className="px-4 py-4">Twice</td>
                    <td className="px-4 py-4">7</td>
                    <td className="px-4 py-4">10:30</td>
                  </tr>
                </tbody>
              </table>
              <Link href="/patient{% url 'prescriptions' %}"
                className="flex items-center justify-end space-x-2 text-blue-500 hover:text-blue-700">
                <span>View all Prescriptions</span>
                <FaPenToSquare />
              </Link>
            </section>

            <section className="block w-full rounded-lg border-2 border-solid border-gray-300 p-6 bg-white">
              <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">View Results</h1>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaFile className="text-gray-600" />
                    <p className="text-left">Juan Dela Cruz Lab Result</p>
                  </div>

                  <div className="flex space-x-4">
                    <Link href="/patient#" className="text-blue-500 hover:text-blue-700">View</Link>
                    <Link href="/patient#" className="text-blue-500 hover:text-blue-700">Download</Link>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaFile className="text-gray-600" />
                    <p className="text-left">Juan Dela Cruz Lab Result</p>
                  </div>

                  <div className="flex space-x-4">
                    <Link href="/patient#" className="text-blue-500 hover:text-blue-700">View</Link>
                    <Link href="/patient#" className="text-blue-500 hover:text-blue-700">Download</Link>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaFile className="text-gray-600" />
                    <p className="text-left">Juan Dela Cruz Lab Result</p>
                  </div>

                  <div className="flex space-x-4">
                    <Link href="/patient#" className="text-blue-500 hover:text-blue-700">View</Link>
                    <Link href="/patient#" className="text-blue-500 hover:text-blue-700">Download</Link>
                  </div>
                </div>

              </div>
            </section>

            <section className="block w-full rounded-lg border-2 border-solid border-gray-300 p-6 bg-white">
              <div className="flex-col justify-between">
                <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">Notes</h1>
                <p className="pt-4 text-lg font-semibold text-gray-500">Diagnosis: Type 2 Diabetes</p>
                <ul className="list-disc space-y-4 text-wrap break-words pl-5">
                  <li className="mt-4 ">Diet and excercise counseling recommended.</li>
                  <li>Follow up in 2 weeks for blood glucose monitoring and medication
                    adjustment</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>

    </main>
  );
}
