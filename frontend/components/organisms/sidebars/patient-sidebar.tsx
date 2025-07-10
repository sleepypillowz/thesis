import {
  Pill,
  Settings,
  Power,
  FileClock,
  FileText,
  LayoutDashboard,
  ChevronUp,
} from "lucide-react";

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
import Image from "next/image";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menu_items = [
  {
    title: "Prescriptions",
    url: "/patient/prescriptions",
    icon: Pill,
  },
  {
    title: "Medical Record",
    url: "/patient/medical-record",
    icon: FileClock,
  },
  {
    title: "Settings",
    url: "/patient/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/",
    icon: Power,
  },
];

const appointment_items = [
  {
    title: "Book Appointment",
    url: "/patient/book-appointment",
  },
  {
    title: "Todays Appointment",
    url: "/patient/todays-appointment",
  },
  {
    title: "Upcoming Appointment",
    url: "/patient/upcoming-appointment",
  },
  {
    title: "Past Appointments",
    url: "/patient/past-appointment",
  },
];

export function PatientSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/patient"
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
            PATIENT
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard Item (Manually Rendered) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/patient">
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
