export default function Page() {
  return (
    <div className="flex-1 px-8 py-8">

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Find a Doctor
          </h2>
          <p className="mt-4 text-lg">
            Search htmlFor doctors by name or specialty. Let us help you find the best healthcare professional htmlFor
            your needs.
          </p>
        </div>

        <div className="card mx-auto mt-12 max-w-lg rounded-xl">
          <form action="#" method="GET">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0">

              <div className="sm:col-span-1">
                <label htmlFor="doctor-name" className="block text-sm font-medium">Doctor Name</label>
                <input type="text" id="doctor-name" name="doctor_name" placeholder="Search by name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="specialty" className="block text-sm font-medium">Specialty</label>
                <select id="specialty" name="specialty"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Select a specialty</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="dermatology">Dermatology</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button type="submit"
                className="w-full rounded-lg bg-sky-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-300">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}
