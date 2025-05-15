"use client";
import {
  LayoutDashboard,
  ClipboardPlus,
  Calendar,
  Bandage,
  ChartArea,
  Database,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/molecules/nav-user";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import Link from "next/link";
import { useEffect, useState } from "react";

const menu_items = [
  {
    title: "Dashboard",
    url: "/doctor",
    icon: LayoutDashboard,
  },
  {
    title: "Patient Portal",
    url: "/staff/patient-portal",
    icon: LayoutDashboard,
  },
  {
    title: "Doctors List",
    url: "/doctor/doctors-list",
    icon: LayoutDashboard,
  },
  {
    title: "Medicine",
    url: "/staff/medicine",
    icon: Database,
  },
  {
    title: "Reports",
    url: "/doctor/reports",
    icon: ChartArea,
  },
];

const patient_items = [
  {
    title: "Medical Records",
    url: "/doctor/medical-records",
    icon: ClipboardPlus,
  },
  {
    title: "Appointments",
    url: "/doctor/appointments",
    icon: Calendar,
  },
  {
    title: "Treatment",
    url: "/doctor/treatment",
    icon: Bandage,
  },
  {
    title: "Treatment Queue",
    url: "/doctor/treatment-queue",
    icon: Bandage,
  },
];

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
};

export function AppSidebar() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        console.warn("No token found");
        window.location.href = "/login";  // Immediate redirect
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/whoami/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: process.env.NODE_ENV === 'development' ? 'same-origin' : 'include'
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("access");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentUserId(data.id);

    } catch (error) {
      console.error("Failed to fetch current user", error);
      // Show user-friendly error message
    }
  };

  fetchCurrentUser();
}, []);

  const filteredMenuItems = currentUserId === "LFG4YJ2P"
    ? menu_items
    : menu_items.filter(item => 
        ["Dashboard", "Doctors List"].includes(item.title)  // Fixed typo
      );

  const filteredPatientItems = currentUserId === "LFG4YJ2P"
    ? patient_items
    : patient_items.filter(item => 
        ["Appointments", "Treatment"].includes(item.title)
      );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex">
          <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image
              className="aspect-square h-full w-full"
              src="/logo.png"
              alt="logo"
              width={64}
              height={64}
            />
          </span>
          <h1 className="ms-2 text-2xl">MediTrakk</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarGroup>
                {filteredMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroup>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredPatientItems.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  Patients
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarGroup>
                    <CollapsibleContent>
                      {filteredPatientItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </CollapsibleContent>
                  </SidebarGroup>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
