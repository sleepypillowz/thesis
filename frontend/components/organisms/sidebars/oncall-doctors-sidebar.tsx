import {
  LayoutDashboard,
  Calendar,
  Settings,
  MessageSquareText,
  Power,
  Users,
  Heart,
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
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const menu_items = [
  {
    title: "Dashboard",
    url: "/oncall-doctors",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    url: "/oncall-doctors/appointments",
    icon: Calendar,
  },
  {
    title: "Doctors",
    url: "/oncall-doctors/doctors",
    icon: Heart,
  },
  {
    title: "Patients",
    url: "/oncall-doctors/patients",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/oncall-doctors/settings",
    icon: Settings,
  },
  {
    title: "Chat",
    url: "/oncall-doctors/chat",
    icon: MessageSquareText,
  },
  {
    title: "Logout",
    url: "/",
    icon: Power,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/oncall-doctors"
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
      </SidebarContent>
    </Sidebar>
  );
}
