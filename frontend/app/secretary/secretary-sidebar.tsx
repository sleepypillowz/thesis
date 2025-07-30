import {
  LayoutDashboard,
  ClipboardPlus,
  Calendar,
  Clock,
  ClipboardPenLine,
  ChartArea,
  UserPlus,
  ChevronDown,
  BriefcaseMedical,
  Pill,
  Settings,
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
    url: "/secretary",
    icon: LayoutDashboard,
  },
  {
    title: "Registration",
    url: "/secretary/registration",
    icon: UserPlus,
  },
  {
    title: "Doctors Request",
    url: "/secretary/doctor-request",
    icon: BriefcaseMedical,
  },
  {
    title: "Patient Portal",
    url: "/secretary/patient-portal",
    icon: LayoutDashboard,
  },
  {
    title: "Medicine",
    url: "/secretary/medicine",
    icon: Pill,
  },
  {
    title: "Reports",
    url: "/secretary/reports",
    icon: ChartArea,
  },
  {
    title: "Settings",
    url: "/secretary/settings",
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
    url: "/secretary/medical-records",
    icon: ClipboardPlus,
  },
  {
    title: "Appointments",
    url: "/secretary/appointments",
    icon: Calendar,
  },
  {
    title: "Registration Queue",
    url: "/secretary/registration-queue",
    icon: Clock,
  },
  {
    title: "Assessment",
    url: "/secretary/assessment-queue",
    icon: ClipboardPenLine,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/secretary"
          className="flex items-center justify-center gap-2"
        >
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
            SECRETARY
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
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
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
