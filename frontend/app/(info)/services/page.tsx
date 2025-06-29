import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Syringe, HeartPulse, X } from "lucide-react";

type Service = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    title: "General Check-Up",
    description: "Routine physical exams and health screenings.",
    icon: <Stethoscope className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Vaccinations",
    description: "Preventive care for all age groups.",
    icon: <Syringe className="h-8 w-8 text-green-500" />,
  },
  {
    title: "Cardiology",
    description: "Heart health assessment and treatment.",
    icon: <HeartPulse className="h-8 w-8 text-red-500" />,
  },
  {
    title: "Emergency Care",
    description: "24/7 urgent care for serious injuries or illness.",
    icon: <X className="h-8 w-8 text-yellow-500" />,
  },
];

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Our Services</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4">
              {service.icon}
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
