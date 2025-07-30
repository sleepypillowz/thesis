"use client";
import { LayoutDashboard, Calendar, Power } from "lucide-react";

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

import Link from "next/link";
const menu_items = [
  {
    title: "Dashboard",
    url: "/design",
    icon: LayoutDashboard,
  },
  {
    title: "Appointment",
    url: "/design/appointment",
    icon: Calendar,
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
        <Link href="/design" className="flex items-center justify-center gap-2">
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
            DESIGNER
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Menu */}
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
    </Sidebar>
  );
}
