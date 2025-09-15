export default function QueueCard() {
  return (
    <div className="space-y-12 px-10 py-10">
      <div className="flex flex-row gap-16">
        {/* Current */}
        <div className="flex h-72 w-64 flex-col items-center justify-center rounded-xl border border-green-500 bg-green-50 p-6 shadow-lg">
          <span className="mb-4 text-7xl font-extrabold">#1</span>
          <span className="mt-1 text-sm font-bold text-green-600">Current</span>
          <span className="mt-1 text-sm">Being served now</span>
        </div>

        {/* Waiting */}
        <div className="flex h-72 w-64 flex-col items-center justify-center rounded-xl border border-yellow-500 bg-yellow-50 p-6 shadow-lg">
          <span className="mb-4 text-7xl font-extrabold">#2</span>
          <span className="mt-1 text-sm text-yellow-600">Waiting</span>
          <span className="mt-1 text-sm">~5 mins</span>
        </div>

        {/* Waiting */}
        <div className="flex h-72 w-64 flex-col items-center justify-center rounded-xl border border-red-500 bg-red-50 p-6 shadow-lg">
          <span className="mb-4 text-7xl font-extrabold">#3</span>
          <span className="mt-1 text-sm text-red-600">Waiting</span>
          <span className="mt-1 text-sm">~10 mins</span>
        </div>
      </div>
    </div>
  );
}
