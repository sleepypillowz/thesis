"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const rolePages: Record<string, string> = {
  doctor: "/doctor",
  secretary: "/secretary",
  admin: "/admin",
  patient: "/patient",
};

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Fetch user role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        const userRole = profile as unknown as {
          role: keyof typeof rolePages;
        } | null;

        if (!profileError && userRole?.role) {
          const allowedPage = rolePages[userRole.role] ?? "/patient";
          if (pathname !== allowedPage) {
            router.replace(allowedPage);
          }
          return;
        }
      }
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkSession();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center">
      <div className="container py-10 text-center lg:py-16">
        <p className="text-lg font-medium text-gray-500">
          Your Health, Our Priority
        </p>

        {/* Title */}
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Malibiran Medical Clinic
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-3xl text-xl text-gray-600">
          Providing quality healthcare services with compassion and expertise.
          Visit our clinic to experience personalized care for all your medical
          needs.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-3">
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/login"
          >
            Login
          </Link>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
