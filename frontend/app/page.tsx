"use client";
import { useState, useEffect } from "react";
import {
  Phone,
  Calendar,
  MapPin,
  ChevronRight,
  Users,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HeroHeader from "@/components/organisms/hero-header";

// Simulated button variant function since we can't import the actual one
type ButtonVariant = "default" | "secondary" | "outline" | undefined;

const buttonVariants = ({ variant }: { variant?: ButtonVariant }): string => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-4 py-2";

  if (variant === "default") {
    return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
  } else if (variant === "secondary") {
    return `${baseClasses} bg-gray-100 text-gray-900 hover:bg-gray-200`;
  } else if (variant === "outline") {
    return `${baseClasses} border border-gray-300 hover:bg-gray-100`;
  }
  return baseClasses;
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: "Family Medicine",
      description:
        "Comprehensive healthcare for patients of all ages, focusing on prevention and treatment of common illnesses.",
      icon: <Users className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Preventive Care",
      description:
        "Regular check-ups and screenings to maintain your health and detect issues before they become serious.",
      icon: <Shield className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Urgent Care",
      description:
        "Immediate treatment for non-life-threatening injuries and illnesses when you need it most.",
      icon: <Clock className="h-8 w-8 text-blue-500" />,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-white">
      <HeroHeader />

      {/* Hero Section */}
      <div
        className={`flex-1 pt-16 pb-24 px-6 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-12 md:mb-0 md:w-1/2">
              <p className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                Your Health, Our Priority
              </p>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Malibiran <br />
                <span className="text-blue-600">Medical Clinic</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-gray-600">
                Providing quality healthcare services with compassion and
                expertise. Visit our clinic to experience personalized care for
                all your medical needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/appointment"
                  className={buttonVariants({ variant: "default" }) + " group"}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Our Services
                </Link>
              </div>

              <div className="mt-12 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-200"
                    >
                      <Image
                        src={`/api/placeholder/40/40`}
                        width={500}
                        height={500}
                        alt="Patient"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Trusted by 2,000+ patients
                  </p>
                </div>
              </div>
            </div>

            <div className="relative md:w-1/2">
              <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                <Image
                  src="/location.png"
                  width={1327}
                  height={717}
                  alt="location"
                  className="h-64 w-full object-cover"
                />
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Medical Services</h3>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Open Now
                    </span>
                  </div>

                  <div className="space-y-3">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className={`flex items-start p-3 rounded-lg transition-all duration-300 ${
                          activeService === index
                            ? "bg-blue-50 shadow-sm"
                            : "hover:bg-gray-50"
                        }`}
                        onMouseEnter={() => setActiveService(index)}
                      >
                        <div className="mr-4 shrink-0">{service.icon}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {service.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between">
                      <Link
                        href="/services"
                        className="flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        View all services
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                      <Link
                        href="/appointment"
                        className={buttonVariants({ variant: "default" })}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 flex items-center rounded-lg bg-white p-4 shadow-lg md:hidden lg:flex">
                <div className="mr-3 rounded-full bg-blue-100 p-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call us now</p>
                  <p className="font-bold text-gray-900">0999 820 5684</p>
                </div>
              </div>

              <div className="absolute -right-4 -top-4 flex items-center rounded-lg bg-white p-4 shadow-lg md:hidden lg:flex">
                <div className="mr-3 rounded-full bg-blue-100 p-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Our location</p>
                  <p className="font-bold text-gray-900">130 Old Samson Rd.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
