import {
  Pill,
  Settings,
  Power,
  MessageSquareText,
  ReceiptText,
  FileClock,
  FileText,
  LayoutDashboard,
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
    url: "/patient",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    url: "/patient/appointments",
    icon: FileText,
  },
  {
    title: "Prescriptions",
    url: "/patient/prescriptions",
    icon: Pill,
  },
  {
    title: "Medical Record",
    url: "/patient/results",
    icon: FileClock,
  },
  {
    title: "Billing",
    url: "/patient/billing",
    icon: ReceiptText,
  },
  {
    title: "Chat",
    url: "/patient/chat",
    icon: MessageSquareText,
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

export function PatientSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-center">
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
