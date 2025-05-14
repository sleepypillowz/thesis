export default function Page() {
  return (
    <div className="mx-8 my-8 flex-1">
      <h1 className="mb-4 text-3xl font-semibold">Profile</h1>
      <div
        className="card grid grid-cols-1 items-center justify-center text-center sm:grid-cols-2">

        <div>
          <div className="mb-4">
            <p className="text-lg font-bold">JUAN DELA CRUZ</p>
            <p className="text-sm">Male | 12/11/2006</p>
          </div>

          <div className="mt-4">
            <p className="text-lg font-bold">Contact Details</p>
            <p className="">0911 5050 143</p>
            <p className="">sampleemail@gmail.com</p>
          </div>
        </div>

        <div className="space-y-4 sm:text-left">
          <div>
            <p className="text-lg font-semibold">Date of Last Consultation</p>
            <p className="">12/31/2002</p>
          </div>

          <div>
            <p className="text-lg font-semibold">Current Diagnosis</p>
            <p className="">Diabetes</p>
          </div>

          <div>
            <p className="text-lg font-semibold">Allergies</p>
            <p className="">Penicillin, Pollen</p>
          </div>

          <div>
            <p className="text-lg font-semibold">Medical History</p>
            <p className="">Hypertension (diagnosed 1998), Hyperlipidemia (diagnosed
              2000), Appendectomy (1985)</p>
          </div>

          <div>
            <p className="text-lg font-semibold">Family History</p>
            <p className="">Father with history of heart disease, Mother with Type 2
              Diabetes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
