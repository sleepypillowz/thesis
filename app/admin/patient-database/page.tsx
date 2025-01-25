export default function Page() {
  return (
    <main className="ml-64 flex-1 px-4 pt-16 sm:px-6 lg:px-8">
      <div
        className="mx-auto w-full max-w-7xl rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">Patients</h1>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Age</th>
              <th scope="col" className="px-6 py-3">Gender</th>
              <th scope="col" className="px-6 py-3">Mobile No.</th>
              <th scope="col" className="px-6 py-3">Birthday</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td className="px-6 py-4">87000</td>
              <td className="px-6 py-4">Jane Doe</td>
              <td className="px-6 py-4">22</td>
              <td className="px-6 py-4">Female</td>
              <td className="px-6 py-4">0912 345 6789</td>
              <td className="px-6 py-4">12/31/2002</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}