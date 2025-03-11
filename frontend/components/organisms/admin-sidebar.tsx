"use client";

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import {
  LayoutDashboard,
  ClipboardPlus,
  Calendar,
  Clock,
  ClipboardPenLine,
  Bandage,
  ChartArea,
  HelpCircle,
  Settings,
  Database,
  UserPlus,
  GitPullRequestArrow 
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
import { NavUser } from "../molecules/nav-user";
import Image from "next/image";
import Link from "next/link";

const menu_items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    allowedRoles: ['doctor', 'secretary']
  },
  {
    title: "Registration",
    url: "/admin/patient-registration",
    icon: UserPlus,
    allowedRoles: ['secretary']
  },
  {
    title: "Doctor's Request",
    url: "/admin/doctor-request",
    icon: GitPullRequestArrow ,
    allowedRoles: ['secretary']
  },
  {
    title: "Patient Portal",
    url: "/admin/patient-portal",
    icon: LayoutDashboard,
    allowedRoles: ['doctor', 'secretary']
  },
  {
    title: "Medicine",
    url: "/admin/medicine",
    icon: Database,
    allowedRoles: ['doctor', 'secretary']
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: ChartArea,
    allowedRoles: ['doctor', 'secretary']
  },
];
const patient_items = [
  {
    title: "Medical Records",
    url: "/admin/patient-medical-records",
    icon: ClipboardPlus,
    allowedRoles: ['doctor', 'secretary']
  },
  {
    title: "Appointments",
    url: "/admin/patient-appointments",
    icon: Calendar,
    allowedRoles: ['doctor', 'secretary']
  },
  {
    title: "Registration Queue",
    url: "/admin/patient-registration-queue",
    icon: Clock,
    allowedRoles: ['secretary']
  },
  {
    title: "Assessment",
    url: "/admin/patient-assessment-queue",
    icon: ClipboardPenLine,
    allowedRoles: ['secretary']
  },
  {
    title: "Treatment",
    url: "/admin/patient-treatment",
    icon: Bandage,
    allowedRoles: ['doctor']
  },
  {
    title: "Treatment Queue",
    url: "/admin/patient-treatment-queue",
    icon: Bandage,
    allowedRoles: ['doctor']
  },
];

const help_items = [
  {
    title: "Help",
    url: "/admin/help",
    icon: HelpCircle,
    allowedRoles: ['doctor', 'secretary']
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    allowedRoles: ['doctor', 'secretary']
  },
];

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
};

interface DecodedToken {
  is_superuser: boolean;
  role?: string;
}
export function AppSidebar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        // Determine role based on decoded token:
        if (decoded.role) {
          setUserRole(decoded.role.toLowerCase());
        } else {
          // Fallback: if is_superuser is true, consider it admin; otherwise, assume doctor
          setUserRole(decoded.is_superuser ? "admin" : "doctor");
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);
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
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarGroup>
                {menu_items
                .filter((item) => userRole && item.allowedRoles.includes(userRole))
                .map((item) => (
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
        
        {/* Patients */}
        <SidebarGroup>
          <SidebarGroupLabel>Patients</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarGroup>
                {patient_items
                  .filter((item) => userRole && item.allowedRoles.includes(userRole))
                  .map((item) => (
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

        {/* Help & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Help & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarGroup>
                {help_items.map((item) => (
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
