import {
  House,
  User,
  Calendar,
  Pill,
  File,
  Book,
  Clock,
  Search,
  Contact,
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
    title: "Home",
    url: "/patient",
    icon: House,
  },
  {
    title: "Profile",
    url: "/patient/profile",
    icon: User,
  },
  {
    title: "Appointments",
    url: "/patient/appointments",
    icon: Calendar,
  },
  {
    title: "prescriptions",
    url: "/patient/prescriptions",
    icon: Pill,
  },
  {
    title: "Results",
    url: "/patient/results",
    icon: File,
  },
  {
    title: "Booking",
    url: "/patient/booking",
    icon: Book,
  },
  {
    title: "Queue",
    url: "/patient/queue",
    icon: Clock,
  },
  {
    title: "Find a Doctor",
    url: "/patient/find-doctor",
    icon: Search,
  },
  {
    title: "Contact",
    url: "/patient/contact",
    icon: Contact,
  },
];

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
};

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex">
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
