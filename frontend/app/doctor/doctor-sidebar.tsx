import {
  LayoutDashboard,
  ClipboardPlus,
  ChartArea,
  Bandage,
  User,
  List,
  Pill,
  Clock,
  ChevronUp,
  FileText,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
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
    url: "/doctor/doctor-list",
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
];

const patient_items = [
  {
    title: "Medical Records",
    url: "/doctor/medical-records",
    icon: ClipboardPlus,
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

const appointment_items = [
  {
    title: "Today",
    url: "/doctor/todays-appointment",
  },
  {
    title: "Upcoming",
    url: "/doctor/upcoming-appointment",
  },
  {
    title: "Past",
    url: "/doctor/past-appointment",
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
                <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarGroup>
                  <CollapsibleContent>
                    {/* Appointments Collapsible */}
                    <Collapsible className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Appointments</span>
                            </div>
                            <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {appointment_items.map((item) => (
                              <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuButton asChild>
                                  <Link href={item.url}>
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
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
