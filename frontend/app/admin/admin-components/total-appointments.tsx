export function TotalAppointments() {
  return (
    <div className="card flex flex-col justify-evenly p-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-lg font-semibold ">Total Appointments</h1>
        <span className="text-4xl font-bold my-4">128</span>
      </div>

      {/* Stats */}
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-col items-center flex-1 bg-blue-100 text-blue-600 p-4 rounded-xl shadow-sm">
          <span className="text-2xl font-bold">73</span>
          <span className="text-sm font-medium">Completed</span>
        </div>
        <div className="flex flex-col items-center flex-1 bg-orange-100 text-orange-600 p-4 rounded-xl shadow-sm">
          <span className="text-2xl font-bold">55</span>
          <span className="text-sm font-medium">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
