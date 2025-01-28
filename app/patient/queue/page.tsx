export default function Page() {
  return (
    <div className="flex-1 px-8 py-8">
      <div className="flex flex-row justify-center gap-4">
        <div
          className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold text-gray-700">#84</p>
          <p className="font-semibold">
            <span className="text-gray-500">Your Number</span>
          </p>
        </div>

        <div
          className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold text-gray-700">#02</p>
          <p className="font-semibold">
            <span className="text-gray-500">Current</span>
          </p>
        </div>

        <div
          className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold text-gray-700">#01</p>
          <p className="font-semibold">
            <span className="text-gray-500">Next</span>
          </p>
        </div>

        <div className="flex justify-center pt-8">
          <div className="card flex w-96 max-w-sm flex-col rounded-lg">
            <p className="mb-2 text-lg font-semibold tracking-tight text-gray-900">Patient Information</p>
            <div className="flex">

              <p className="font-semibold">
                <span className="text-gray-500">Name: </span>Juan Dela Cruz
              </p>
              <p className="pl-8 font-semibold">
                <span className="text-gray-500">Age: </span>20
              </p>
            </div>

            <hr className="mt-2"></hr>

            <p className="my-2 text-lg font-semibold tracking-tight text-gray-900">Assessment</p>

            <p className="font-semibold">
              <span className="text-gray-500">Blood Pressure: </span>120/30
            </p>
            <p className="font-semibold">
              <span className="text-gray-500">Reason: </span>Checkup
            </p>
            <div className="flex flex-col pt-6">
              <button type="button"
                className="mb-2 me-2 rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300">Edit</button>
              <button type="button"
                className="mb-2 me-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300">Cancel</button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
