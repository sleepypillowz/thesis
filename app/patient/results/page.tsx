export default function Page() {
  return (
    <div className="flex-1 px-8 py-8">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <h1 className="mb-4 text-3xl font-semibold text-foreground">View Results</h1>
        <div className="card flex items-center justify-between">
          <div className="flex items-center">
            <i className="fa-solid fa-file me-3"></i>
            <p className="text-left text-sm">Juan Dela Cruz Lab Result</p>
          </div>

          <div className="flex space-x-6">
            <a href="#"
              className="text-blue-500 underline visited:text-purple-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-500">
              View
            </a>
            <a href="#"
              className="text-blue-500 underline visited:text-purple-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-500">
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
