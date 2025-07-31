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
            ONCALL-DOCTOR
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
