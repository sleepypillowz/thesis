"use client";
import { Stethoscope, Syringe, HeartPulse, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const services: Service[] = [
  {
    id: "general-checkup",
    title: "General Check-Up",
    description:
      "Comprehensive routine physical exams and health screenings tailored to your needs.",
    icon: <Stethoscope className="h-6 w-6" />,
    color: "blue",
  },
  {
    id: "vaccinations",
    title: "Vaccinations",
    description:
      "Preventive immunization programs for all age groups and travel requirements.",
    icon: <Syringe className="h-6 w-6" />,
    color: "green",
  },
  {
    id: "cardiology",
    title: "Cardiology",
    description:
      "Advanced heart health assessments and personalized treatment plans.",
    icon: <HeartPulse className="h-6 w-6" />,
    color: "red",
  },
  {
    id: "emergency-care",
    title: "Emergency Care",
    description:
      "24/7 urgent care services for critical injuries and acute illnesses.",
    icon: <X className="h-6 w-6" />,
    color: "yellow",
  },
];

const Services: React.FC = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl"
      >
        Our Services
      </motion.h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="group relative"
            >
              <div
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-${service.color}-50 to-white dark:to-gray-800`}
              >
                <div className="p-6">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-${service.color}-100 dark:bg-${service.color}-900/30 mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div
                      className={`text-${service.color}-600 dark:text-${service.color}-400`}
                    >
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-blue-200/50" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Services;
