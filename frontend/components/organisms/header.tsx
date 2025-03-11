"use client";

import Link from "next/link";
import Notification from "@/components/molecules/header/notification-dropdown";
import Profile from "@/components/molecules/header/profile";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

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

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'doctor':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'medical secretary':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="border border-x-0 bg-white text-card-foreground shadow-sm lg:sticky lg:top-0">
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
                  <span className="text-sm font-semibold text-gray-800">
                    {user.email}
                  </span>
                  <span 
                    className={`
                      text-xs px-2 py-0.5 rounded-full 
                      ${getRoleBadgeStyle(user.role)}
                      font-medium border
                      transition-all duration-300 ease-in-out
                    `}
                  >
                    {user.role}
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