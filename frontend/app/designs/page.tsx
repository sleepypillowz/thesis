import SecondaryButton from "@/components/atoms/secondary-button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-[100dvh] items-center">
      <div className="flex w-full justify-center">
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              {/* Title */}
              <div className="mt-5 flex max-w-2xl justify-center">
                <h1 className="flex scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Designs
                </h1>
              </div>
              {/* End Title */}
              {/* Buttons */}
              <div className="mt-8 flex justify-center gap-3">
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href="/"
                >
                  Home
                </Link>
                <SecondaryButton buttonName="registration" />
                <SecondaryButton buttonName="login" />
                <SecondaryButton buttonName="register" />
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
