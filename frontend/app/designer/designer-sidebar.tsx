import { LayoutDashboard, Calendar, ChevronUp, FileText } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import SidebarHeaderProfile from "@/components/atoms/sidebar-header-profile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const appointment_items = [
  {
    title: "Todays Appointment",
    url: "/designer/todays-appointment",
  },
  {
    title: "Upcoming Appointment",
    url: "/designer/upcoming-appointment",
  },
  {
    title: "Past Appointments",
    url: "/designer/past-appointment",
  },
];

const menu_items = [
  {
    title: "OPD Record",
    url: "/designer/opd-record",
    icon: Calendar,
  },
  {
    title: "User Management",
    url: "/designer/user-management",
    icon: Calendar,
  },
];

export default function DesignerSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeaderProfile />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard Item (Manually Rendered) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/designer">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

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

              {/* Remaining Menu Items */}
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
