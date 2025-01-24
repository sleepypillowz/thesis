export default function Page() {
  return (
    <main className="flex-1 px-8 py-8 pt-24">

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-medium text-gray-900 sm:text-4xl">
            Book an Appointment
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Please provide your details to schedule an appointment with our medical team.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg rounded-xl bg-white p-8 shadow-lg">
          <form action="#" method="POST" className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0">

              <div className="sm:col-span-1">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">Full Name</label>
                <input type="text" id="name" name="name" required
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-500 focus:ring-sky-500" />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900">Phone Number</label>
                <input type="tel" id="phone" name="phone" required
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-500 focus:ring-sky-500" />
              </div>

            </div>

            <div>
              <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-900">Preferred Appointment Date</label>
              <input type="date" id="date" name="date" required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-500 focus:ring-sky-500" />
            </div>

            <div>
              <label htmlFor="time" className="mb-2 block text-sm font-medium text-gray-900">Preferred Appointment Time</label>
              <select id="time" name="time" required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-500 focus:ring-sky-500">
                <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                <option value="afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                <option value="evening">Evening (6:00 PM - 8:00 PM)</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900">Additional Notes</label>
              <textarea id="message" name="message"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-500 focus:ring-sky-500"></textarea>
            </div>

            <div className="text-center">
              <button type="submit"
                className="w-full rounded-lg bg-sky-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-300">
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </section>

    </main>
  );
}
