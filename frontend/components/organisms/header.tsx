"use client";

import Link from "next/link";
import Notification from "@/components/molecules/header/notification-dropdown";
import Profile from "@/components/molecules/header/profile";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email?: string;
  role?: string;
}

const Header = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded);
        setUser(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <div className="z-50 border border-x-0 bg-card text-card-foreground shadow-sm lg:sticky lg:top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Link href="/" className="ms-2 flex md:me-24">
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
