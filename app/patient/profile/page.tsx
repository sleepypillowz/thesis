export default function Page() {
  return (
    <main className="flex-1 px-8 py-8 pt-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">Profile</h1>
        <div
          className="grid grid-cols-1 items-center justify-center gap-12 rounded-lg border-2 border-solid border-gray-300 bg-white p-2 sm:grid-cols-2">

          <div className="text-center">
            <div className="mb-4">
              <p className="text-lg font-bold text-blue-700">JUAN DELA CRUZ</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Male | 12/11/2006</p>
            </div>

            <div className="mt-4">
              <p className="text-lg font-bold text-gray-500">Contact Details</p>
              <p className="text-gray-700 dark:text-gray-300">0911 5050 143</p>
              <p className="text-gray-700 dark:text-gray-300">sampleemail@gmail.com</p>
            </div>
          </div>

          <div>
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Date of Last Consultation</p>
              <p className="text-gray-600 dark:text-gray-400">12/31/2002</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Diagnosis</p>
              <p className="text-gray-600 dark:text-gray-400">Diabetes</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Allergies</p>
              <p className="text-gray-600 dark:text-gray-400">Penicillin, Pollen</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Medical History</p>
              <p className="text-gray-600 dark:text-gray-400">Hypertension (diagnosed 1998), Hyperlipidemia (diagnosed
                2000), Appendectomy (1985)</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Family History</p>
              <p className="text-gray-600 dark:text-gray-400">Father with history of heart disease, Mother with Type 2
                Diabetes</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
