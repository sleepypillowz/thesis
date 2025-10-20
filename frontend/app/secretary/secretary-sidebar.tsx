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

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import SidebarHeaderProfile from "@/components/atoms/sidebar-header-profile";

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
        <SidebarHeaderProfile />
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
