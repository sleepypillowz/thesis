import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin Help</h1>
      <p className="text-lg text-gray-700">
        Welcome to the Admin Help section. Here you can find answers to common
        questions and guides on how to manage the hospital system efficiently.
      </p>

      <div className="space-y-4">
        <section className="help-section">
          <h2 className="text-xl font-semibold">1. Managing Patient Records</h2>
          <p>
            To manage patient records, go to the Patients section from the main
            dashboard. From there, you can view, edit, or delete patient
            information.
          </p>
        </section>

        <section className="help-section">
          <h2 className="text-xl font-semibold">2. Scheduling Appointments</h2>
          <p>
            The appointment scheduling tool is located in the Appointments
            section. You can add, update, or cancel patient appointments easily.
          </p>
        </section>

        <section className="help-section">
          <h2 className="text-xl font-semibold">3. Managing Staff</h2>
          <p>
            In the Staff section, you can add new staff members, update their
            roles, and assign them to departments within the hospital.
          </p>
        </section>

        <section className="help-section">
          <h2 className="text-xl font-semibold">4. Reports and Analytics</h2>
          <p>
            The Reports section offers detailed analytics on patient data,
            appointment trends, and staff performance. You can export these
            reports as PDFs.
          </p>
        </section>
      </div>

      <div className="mt-6">
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
