export default function Page() {
  return (
    <div className="flex-1 px-8 py-8">
      <div className="mx-auto max-w-7xl rounded-lg">
        <h1 className="mb-4 text-3xl font-semibold">Prescriptions</h1>

        <div className="card">
          <table
            className="card w-full text-left text-sm rtl:text-right">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-4">Drug Name</th>
                <th scope="col" className="px-4 py-4">No. of Units</th>
                <th scope="col" className="px-4 py-4">Dosage</th>
                <th scope="col" className="px-4 py-4">No. of Days</th>
                <th scope="col" className="px-4 py-4">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-card">
                <td className="px-4 py-4">Paracetamol Biogesic</td>
                <td className="px-4 py-4">2</td>
                <td className="px-4 py-4">Twice</td>
                <td className="px-4 py-4">7</td>
                <td className="px-4 py-4">10:30</td>
              </tr>
              <tr className="border-b bg-card">
                <td className="px-4 py-4">Paracetamol Biogesic</td>
                <td className="px-4 py-4">2</td>
                <td className="px-4 py-4">Twice</td>
                <td className="px-4 py-4">7</td>
                <td className="px-4 py-4">10:30</td>
              </tr>
              <tr className="bg-card">
                <td className="px-4 py-4">Paracetamol Biogesic</td>
                <td className="px-4 py-4">2</td>
                <td className="px-4 py-4">Twice</td>
                <td className="px-4 py-4">7</td>
                <td className="px-4 py-4">10:30</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
