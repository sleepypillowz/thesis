"use client";

import Link from "next/link";
import Notification from "@/components/molecules/header/notification-dropdown";
import Profile from "@/components/molecules/header/profile";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";

interface DecodedToken {
  email?: string;
  role?: string;
}

const Header = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [role, setRole] = useState<string | undefined>(undefined); // Now undefined, instead of null
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      if (userData?.user) {
        setUser({ email: userData.user.email });

        // Fetch user role based on email
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("email", userData.user.email)
          .single();

        if (data) {
          setRole(data.role);
        } else if (error) {
          console.error("Error fetching role:", error.message);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (role) {
      // Redirect based on role
      if (role === "doctor") {
        router.push("/doctor");
      } else if (role === "secretary") {
        router.push("/secretary");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/patient"); // Default dashboard for patients
      }
    }
  }, [role, router]);

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-red-50 text-red-700 border-red-200";
      case "doctor":
        return "bg-green-50 text-green-700 border-green-200";
      case "medical secretary":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="border border-x-0 bg-card text-card-foreground shadow-sm lg:sticky lg:top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Link href={`/${role}`} className="ms-2 flex md:me-24">
              <span className="ms-2 self-center whitespace-nowrap text-2xl font-semibold">
                Malibiran Medical Clinic
              </span>
            </Link>
          </div>
          <div className="relative flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold">{user.email}</span>
                  <span
                    className={`
                      text-xs px-2 py-0.5 rounded-full 
                      ${getRoleBadgeStyle(role)}
                      font-medium border
                      transition-all duration-300 ease-in-out
                    `}
                  >
                    {role}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Notification />
                  <Profile />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
