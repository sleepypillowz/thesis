import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] items-center">
      <div className="flex w-full justify-center">
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg font-medium text-gray-500">
                Your Health, Our Priority
              </p>
              {/* Title */}
              <div className="mt-5 flex max-w-2xl justify-center">
                <h1 className="flex scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Malibiran Medical Clinic
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-gray-600">
                  Providing quality healthcare services with compassion and
                  expertise. Visit our clinic to experience personalized care
                  for all your medical needs.
                </p>
              </div>
              {/* Buttons */}
              <div className="mt-8 flex justify-center gap-3">
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href="/patient"
                >
                  Patient
                </Link>
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/admin"
                >
                  Admin
                </Link>
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/user//login"
                >
                  Login
                </Link>
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/user/register"
                >
                  Register
                </Link>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
