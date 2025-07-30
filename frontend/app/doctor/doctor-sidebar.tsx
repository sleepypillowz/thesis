import {
  LayoutDashboard,
  ClipboardPlus,
  Calendar,
  ChartArea,
  Bandage,
  User,
  List,
  Pill,
  Clock,
  Settings,
  ChevronUp,
  Power,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import Link from "next/link";

const menu_items = [
  {
    title: "Dashboard",
    url: "/doctor",
    icon: LayoutDashboard,
  },
  {
    title: "Patient Portal",
    url: "/doctor/patient-portal",
    icon: User,
  },
  {
    title: "Doctors List",
    url: "/doctor/doctors-list",
    icon: List,
  },
  {
    title: "Medicine",
    url: "/doctor/medicine",
    icon: Pill,
  },
  {
    title: "Reports",
    url: "/doctor/reports",
    icon: ChartArea,
  },
  {
    title: "Settings",
    url: "/doctor/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/",
    icon: Power,
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
    icon: Clock,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/doctor" className="flex items-center justify-center gap-2">
          <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image
              className="aspect-square h-full w-full"
              src="/logo.png"
              alt="logo"
              width={64}
              height={64}
            />
          </span>
          <h1 className="text-2xl">MediTrakk</h1>
        </Link>
        <div className="flex flex-col items-center">
          <div className="mb-2 mt-4">
            <Image
              className="rounded-xl border-2 border-white object-cover"
              src="/secretary.jpg"
              alt="secretary"
              width={64}
              height={64}
            />
          </div>

          <span className="text-sm font-bold">Sarah Smith</span>
          <span className="text-xs font-semibold text-muted-foreground">
            Doctor
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarGroup>
                {menu_items.map((item) => (
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

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Patients
                <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarGroup>
                  <CollapsibleContent>
                    {patient_items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </CollapsibleContent>
                </SidebarGroup>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
