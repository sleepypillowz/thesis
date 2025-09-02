export default function Page() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          Patient Preliminary Assessment
        </h2>

        <form action="#" method="POST">
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="temperature" className="block text-gray-600">
                Body Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                id="temperature"
                name="temperature"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="heartRate" className="block text-gray-600">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                id="heartRate"
                name="heartRate"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="bloodPressure" className="block text-gray-600">
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                id="bloodPressure"
                name="bloodPressure"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., 120/80"
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="medicalConditions"
                className="block text-gray-600"
              >
                Chronic Medical Conditions
              </label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="List any chronic conditions (e.g., diabetes, hypertension)"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="allergies" className="block text-gray-600">
                Known Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="List any known allergies"
                required
              ></textarea>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="currentMedications" className="block text-gray-600">
              Current Medications
            </label>
            <textarea
              id="currentMedications"
              name="currentMedications"
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="List any current medications and dosages"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="currentSymptoms" className="block text-gray-600">
              Current Symptoms
            </label>
            <textarea
              id="currentSymptoms"
              name="currentSymptoms"
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Describe any symptoms currently being experienced, including duration and intensity"
              required
            ></textarea>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="painScale" className="block text-gray-600">
                Pain Level (0-10)
              </label>
              <input
                type="number"
                id="painScale"
                name="painScale"
                min="0"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="painLocation" className="block text-gray-600">
                Pain Location
              </label>
              <input
                type="text"
                id="painLocation"
                name="painLocation"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="smokingStatus" className="block text-gray-600">
                Smoking Status
              </label>
              <select
                id="smokingStatus"
                name="smokingStatus"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="smoker">Smoker</option>
                <option value="non-smoker">Non-smoker</option>
                <option value="htmlFormer-smoker">htmlFormer Smoker</option>
              </select>
            </div>
            <div>
              <label htmlFor="alcoholUse" className="block text-gray-600">
                Alcohol Use
              </label>
              <select
                id="alcoholUse"
                name="alcoholUse"
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="none">None</option>
                <option value="occasionally">Occasionally</option>
                <option value="frequently">Frequently</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
