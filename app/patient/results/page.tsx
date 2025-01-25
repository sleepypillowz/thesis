export default function Page() {
  return (
    <div className="flex-1 px-8 py-8 pt-24">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">View Results</h1>
        <div className="flex items-center justify-between rounded-lg border-2 border-solid border-gray-300 bg-white p-4">
          <div className="flex items-center">
            <i className="fa-solid fa-file me-3 text-gray-600 dark:text-gray-300"></i>
            <p className="text-left text-sm text-gray-700 dark:text-gray-400">Juan Dela Cruz Lab Result</p>
          </div>

          <div className="flex space-x-6">
            <a href="#"
              className="text-blue-500 underline visited:text-purple-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-500">
              View
            </a>
            <a href="#"
              className="text-blue-500 underline visited:text-purple-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-500">
              Download
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border-2 border-solid border-gray-300 bg-white p-4">
          <div className="flex items-center">
            <i className="fa-solid fa-file me-3 text-gray-600 dark:text-gray-300"></i>
            <p className="text-left text-sm text-gray-700 dark:text-gray-400">Juan Dela Cruz Lab Result</p>
          </div>

          <div className="flex space-x-6">
            <a href="#"
              className="text-blue-500 underline visited:text-purple-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-500">
              View
            </a>
            <a href="#"
              className="text-blue-500 underline visited:text-purple-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-500">
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
