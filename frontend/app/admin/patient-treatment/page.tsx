import { Button } from "@/components/ui/button";

export default function TreatmentManagement() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Treatment Management</h1>
      <p className="text-lg text-gray-700">
        Manage patient treatments, add new treatments, and track ongoing
        treatments for each patient.
      </p>

      {/* Ongoing Treatments Section */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Ongoing Treatments</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Treatment ID</th>
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-left">Diagnosis</th>
              <th className="px-4 py-2 text-left">Treatment Start</th>
              <th className="px-4 py-2 text-left">Doctor</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row, you can populate it with dynamic data */}
            <tr>
              <td className="px-4 py-2">TREAT001</td>
              <td className="px-4 py-2">Jane Doe</td>
              <td className="px-4 py-2">Hypertension</td>
              <td className="px-4 py-2">Feb 15, 2025</td>
              <td className="px-4 py-2">Dr. Brown</td>
              <td className="px-4 py-2">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  View Details
                </Button>
                <Button className="ml-2 bg-yellow-500 text-white hover:bg-yellow-600">
                  Update
                </Button>
                <Button className="ml-2 bg-red-500 text-white hover:bg-red-600">
                  Cancel
                </Button>
              </td>
            </tr>
            {/* More rows for other treatments */}
          </tbody>
        </table>
      </div>

      {/* Add New Treatment Section */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Add New Treatment</h2>
        <form className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg">Patient Name</label>
            <input
              type="text"
              placeholder="Enter Patient Name"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Diagnosis</label>
            <input
              type="text"
              placeholder="Enter Diagnosis"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Start Date</label>
            <input type="date" className="w-2/3 rounded-md border p-2" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Treatment Plan</label>
            <textarea
              className="w-2/3 rounded-md border p-2"
              placeholder="Enter Treatment Plan"
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Doctor</label>
            <select className="w-2/3 rounded-md border p-2">
              <option>Select Doctor</option>
              <option>Dr. Brown</option>
              <option>Dr. Williams</option>
              <option>Dr. Lee</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button className="bg-green-500 text-white hover:bg-green-600">
              Add Treatment
            </Button>
          </div>
        </form>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          Search and Filter Treatments
        </h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Patient Name"
            className="w-1/3 rounded-md border p-2"
          />
          <input
            type="text"
            placeholder="Search by Diagnosis"
            className="w-1/3 rounded-md border p-2"
          />
          <select className="w-1/3 rounded-md border p-2">
            <option>Filter by Doctor</option>
            <option>Dr. Brown</option>
            <option>Dr. Williams</option>
            <option>Dr. Lee</option>
          </select>
          <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
