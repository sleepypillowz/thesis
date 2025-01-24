export default function Page() {

  return (
    <main className="flex-1 px-8 py-8 pt-24">
      <div className="mx-auto max-w-7xl rounded-lg">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">Appointments</h1>

        <div className="mb-6 flex flex-wrap justify-start space-x-4">
          <button type="button"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-900 transition duration-200 ease-in-out hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
            Doctors Appointment
          </button>
          <button type="button"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-900 transition duration-200 ease-in-out hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
            Patient Appointment Request
          </button>
        </div>

        <div className="overflow-x-auto border-2 border-solid border-gray-300">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4">Type</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Doctor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                <td className="px-6 py-4">Chest X-Ray</td>
                <td className="px-6 py-4">December 06, 2024</td>
                <td className="px-6 py-4">Dr. Johnny</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );

}