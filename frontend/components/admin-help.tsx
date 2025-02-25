import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function DoctorHelp() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Managing Patient Records</AccordionTrigger>
        <AccordionContent>
          To manage patient records, go to the Patients section from the main
          dashboard. From there, you can view, edit, or delete patient
          information.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Scheduling Appointments</AccordionTrigger>
        <AccordionContent>
          The appointment scheduling tool is located in the Appointments
          section. You can add, update, or cancel patient appointments easily.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Reports and Analytics</AccordionTrigger>
        <AccordionContent>
          The Reports section offers detailed analytics on patient data,
          appointment trends, and staff performance. You can export these
          reports as PDFs.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
