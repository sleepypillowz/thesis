import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPenToSquare, FaFile } from "react-icons/fa6";

export default function Page() {
  return (
    <main className="flex-1 px-8 py-8">
      <div className="flex justify-center">
        <div className="mx-auto max-w-6xl rounded-lg">
          <div className="mx-8 my-8 grid grid-cols-2 gap-4 space-y-4">
            <section className="col-span-2">
              <h1 className="mb-4 text-3xl font-semibold">Profile</h1>
              <div className="card grid grid-cols-1 items-center justify-center gap-12 text-center sm:grid-cols-2 md:grid-cols-2">
                <div>
                  <div className="mb-4">
                    <p className="text-lg font-bold">JUAN DELA CRUZ</p>
                    <p className="text-sm">Male | 12/31/1975</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg font-bold">Contact Details</p>
                    <p>0911 505 3143</p>
                    <p>sampleemail@gmail.com</p>
                  </div>
                </div>

                <div className="space-y-4 sm:text-left">
                  <div>
                    <p className="text-lg font-semibold">
                      Date of Last Consultation
                    </p>
                    <p>12/31/2002</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold">Current Diagnosis</p>
                    <p>Diabetes</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold">Allergies</p>
                    <p>Penicillin, Pollen</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold">Medical History</p>
                    <p>
                      Hypertension (diagnosed 1998), Hyperlipidemia (diagnosed
                      2000), Appendectomy (1985)
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold">Family History</p>
                    <p>
                      Father with history of heart disease, Mother with Type 2
                      Diabetes
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="col-span-2">
              <h1 className="mb-4 text-3xl font-semibold">Appointments</h1>
              <div className="card overflow-x-auto">
                <div className="my-4 flex flex-wrap justify-start space-y-4 sm:space-x-4 sm:space-y-0">
                  <Button variant="outline" className="rounded-full">
                    Doctors Appointment
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Patient Appointment Request
                  </Button>
                </div>
                <table className="card w-full text-left text-sm rtl:text-right">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Doctor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-card">
                      <td className="px-4 py-4">Chest X-Ray</td>
                      <td className="px-4 py-4">December 06 2024</td>
                      <td className="px-4 py-4">Dr. Johnny</td>
                    </tr>
                  </tbody>
                </table>

                <Link
                  href="/patient/appointments"
                  className="flex items-center justify-end space-x-2 pt-4 text-blue-500 hover:text-blue-700"
                >
                  <span>View all Appointments</span>
                  <FaPenToSquare />
                </Link>
              </div>
            </section>

            <section className="col-span-2">
              <h1 className="mb-4 text-3xl font-semibold">Prescriptions</h1>
              <div className="card overflow-x-auto">
                <table className="card w-full text-left text-sm rtl:text-right">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        Drug Name
                      </th>
                      <th scope="col" className="px-4 py-4">
                        No. of Units
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Dosage
                      </th>
                      <th scope="col" className="px-4 py-4">
                        No. of Days
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-card">
                      <td className="px-4 py-4">Paracetamol Biogesic</td>
                      <td className="px-4 py-4">2</td>
                      <td className="px-4 py-4">Twice</td>
                      <td className="px-4 py-4">7</td>
                      <td className="px-4 py-4">10:30</td>
                    </tr>
                    <tr className="border-b bg-card">
                      <td className="px-4 py-4">Paracetamol Biogesic</td>
                      <td className="px-4 py-4">2</td>
                      <td className="px-4 py-4">Twice</td>
                      <td className="px-4 py-4">7</td>
                      <td className="px-4 py-4">10:30</td>
                    </tr>
                    <tr className="bg-card">
                      <td className="px-4 py-4">Paracetamol Biogesic</td>
                      <td className="px-4 py-4">2</td>
                      <td className="px-4 py-4">Twice</td>
                      <td className="px-4 py-4">7</td>
                      <td className="px-4 py-4">10:30</td>
                    </tr>
                  </tbody>
                </table>

                <Link
                  href="/patient/prescriptions"
                  className="flex items-center justify-end space-x-2 pt-4 text-blue-500 hover:text-blue-700"
                >
                  <span>View all Prescriptions</span>
                  <FaPenToSquare />
                </Link>
              </div>
            </section>

            <section className="card block w-full overflow-x-auto">
              <h1 className="mb-4 text-3xl font-semibold">View Results</h1>

              <div className="space-y-2">
                <div className="card flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaFile className="text-accent" />
                    <p className="text-left">Juan Dela Cruz Lab Result</p>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      href="/#"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </Link>
                    <Link
                      href="/#"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Download
                    </Link>
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaFile className="text-accent" />
                    <p className="text-left">Juan Dela Cruz Lab Result</p>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      href="/#"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </Link>
                    <Link
                      href="/#"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Download
                    </Link>
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaFile className="text-accent" />
                    <p className="text-left">Juan Dela Cruz Lab Result</p>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      href="/#"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </Link>
                    <Link
                      href="/#"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Download
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="card">
              <div className="flex-col justify-between">
                <h1 className="mb-4 text-3xl font-semibold">Notes</h1>
                <p className="text-lg">Diagnosis: Type 2 Diabetes</p>
                <ul className="list-disc space-y-4 text-wrap break-words pl-5">
                  <li className="mt-4">
                    Diet and excercise counseling recommended.
                  </li>
                  <li>
                    Follow up in 2 weeks for blood glucose monitoring and
                    medication adjustment
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
