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
    url: "/staff/reports",
    icon: ChartArea,
  },
];

const patient_items = [
  {
    title: "Medical Records",
    url: "/staff/medical-records",
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
          return;
        }

        const response = await fetch(
          "http://localhost:8000/user/users/whoami/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch user: ", response.status, errorText);
          return;
        }

        const data = await response.json();
        setCurrentUserId(data.id);
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const filteredMenuItems =
    currentUserId === "LFG4YJ2P"
      ? menu_items
      : menu_items.filter((item) =>
          ["Dashboard", "Doctors"].includes(item.title)
        );

  const filteredPatientItems =
    currentUserId === "LFG4YJ2P"
      ? patient_items
      : patient_items.filter((item) =>
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
