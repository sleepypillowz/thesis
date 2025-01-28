export default function Page() {

  return (
    <div className="flex-1 px-8 py-8">
      <div className="mx-auto max-w-7xl rounded-lg">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900">Appointments</h1>

        <div className="mb-6 flex flex-wrap justify-start space-x-4">
          <button type="button"
            className="card rounded-full">
            Doctors Appointment
          </button>
          <button type="button"
            className="card rounded-full">
            Patient Appointment Request
          </button>
        </div>

        <div className="overflow-x-auto border-2 border-solid border-gray-300">
          <table className="w-full bg-card text-left text-sm text-gray-500">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-4">Type</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Doctor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-4">Chest X-Ray</td>
                <td className="px-6 py-4">December 06, 2024</td>
                <td className="px-6 py-4">Dr. Johnny</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}