"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState(""); // store user's name
  const [loading, setLoading] = useState(true);

  // Fetch current user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("access"); // Retrieve token from localStorage
        if (!token) {
          console.error("No access token found");
          setLoading(false);
          return;
        }

        // Use your custom endpoint that returns the full profile info
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/user/users/current-profile/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch user profile");
          setLoading(false);
          return;
        }

        const data = await response.json();
        // Combine first_name and last_name (adjust the field names as in your model)
        const fullName = `${data.first_name} ${data.last_name}`;
        setUserName(fullName);
        console.log("Retrieved userName:", fullName);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User />
          <span className="sr-only">Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {loading ? "Loading..." : userName || "Profile"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/user-profile")}>
          <User className="h-4 w-4" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut />
          <Link href="/">Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
