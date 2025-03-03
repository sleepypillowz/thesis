import Help from "@/components/molecules/custom-help";
import { CustomHelpProps } from "@/app/types/types";

export default function Page() {
  const helpItems: CustomHelpProps[] = [
    {
      title: "Managing Patient Records",
      content:
        "To manage patient records, go to the Patients section from the main dashboard. From there, you can view, edit, or delete patient information.",
    },
    {
      title: "Scheduling Appointments",
      content:
        "The appointment scheduling tool is located in the Appointments section. You can add, update, or cancel patient appointments easily.",
    },
    {
      title: "Reports and Analytics",
      content:
        "The Reports section offers detailed analytics on patient data, appointment trends, and staff performance. You can export these reports as PDFs.",
    },
  ];
  return (
    <div className="space-y-6 p-6">
      <Help items={helpItems} />
    </div>
  );
}
