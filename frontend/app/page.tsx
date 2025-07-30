import {
  Phone,
  Calendar,
  MapPin,
  ChevronRight,
  User,
  Users,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HeroHeader from "@/app/hero-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  const services = [
    {
      title: "Family Medicine",
      description:
        "Comprehensive healthcare for patients of all ages, focusing on prevention and treatment of common illnesses.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: "Preventive Care",
      description:
        "Regular check-ups and screenings to maintain your health and detect issues before they become serious.",
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
      title: "Urgent Care",
      description:
        "Immediate treatment for non-life-threatening injuries and illnesses when you need it most.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <HeroHeader />

      {/* Hero Section */}
      <div className="flex-1 px-6 pb-24 pt-16 transition-opacity duration-1000">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-12 md:mb-0 md:w-1/2">
              <p className="mb-6 inline-block rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                Your Health, Our Priority
              </p>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                Malibiran <br />
                <span className="text-primary">Medical Clinic</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg">
                Providing quality healthcare services with compassion and
                expertise. Visit our clinic to experience personalized care for
                all your medical needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="rounded-full">
                  <Link href="/login">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>

              <div className="mt-12 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-solid border-primary bg-card"
                    >
                      <User className="h-5 w-5 text-primary" />
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
                  <p className="text-sm">Trusted by 2,000+ patients</p>
                </div>
              </div>
            </div>

            <div className="relative md:w-1/2">
              <div className="overflow-hidden rounded-2xl bg-card shadow-xl">
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
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Open Now
                    </span>
                  </div>

                  <div className="space-y-3">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-start rounded-lg p-3 transition-all duration-300"
                      >
                        <div className="mr-4 shrink-0">{service.icon}</div>
                        <div>
                          <h4 className="font-medium">{service.title}</h4>
                          <p className="text-sm">{service.description}</p>
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
                      <Button asChild className="rounded-xl">
                        <Link href="/login">Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 flex items-center rounded-lg bg-card p-4 shadow-lg md:hidden lg:flex">
                <div className="mr-3 rounded-full border-2 border-solid border-primary bg-secondary p-2">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs">Call us now</p>
                  <p className="font-bold">0999 820 5684</p>
                </div>
              </div>

              <div className="absolute -right-4 -top-4 flex items-center rounded-lg bg-card p-4 shadow-lg md:hidden lg:flex">
                <div className="mr-3 rounded-full border-2 border-solid border-primary bg-secondary p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs">Our location</p>
                  <p className="font-bold">130 Old Samson Rd.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
