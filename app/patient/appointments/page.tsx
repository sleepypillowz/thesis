import { Button } from "@/components/ui/button";

export default function Page() {

  return (
    <div className="flex-1 px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-gray-foreground mb-4 text-3xl font-semibold">Appointments</h1>

        <div className="card">
          <div className="my-4 flex flex-wrap justify-start space-x-4">
            <Button variant="outline" className="rounded-full">Doctors Appointment</Button>
            <Button variant="outline" className="rounded-full">Patient Appointment Request</Button>
          </div>

          <table
            className="card w-full text-left text-sm rtl:text-right">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-4">Type</th>
                <th scope="col" className="px-4 py-4">Date</th>
                <th scope="col" className="px-4 py-4">Doctor</th>
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
        </div>

      </div>
    </div>
  );

}