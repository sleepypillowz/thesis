import { LayoutDashboard, Users, ClipboardPlus, Calendar, Clock, ClipboardPenLine, Bandage, ChartArea, HelpCircle, Settings, Database,UserPlus } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import Image from "next/image";


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    url: "/admin",
    icon: Users,
  },
  {
    title: "Registration",
    url: "/admin/patient-registration",
    icon: UserPlus,
  },
  {
    title: "Medical Records",
    url: "/admin/medical-records",
    icon: ClipboardPlus,
  },
  {
    title: "Appointments",
    url: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Registration Queue",
    url: "/admin/registration-queue",
    icon: Clock,
  },
  {
    title: "Assessment",
    url: "/admin/patient-assessment-queue",
    icon: ClipboardPenLine,
  },
  {
    title: "Treatment",
    url: "/admin/patient-treatment",
    icon: Bandage,
  },
  {
    title: "Patient Portal",
    url: "/admin/patient-portal",
    icon: LayoutDashboard,
  },
  {
    title: "Medicine",
    url: "/admin/medicine",
    icon: Database,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: ChartArea,
  },
  {
    title: "Help",
    url: "/admin/help",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com"
  },
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex">
          <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image className="aspect-square h-full w-full" src="/logo.png" alt="logo" width={64} height={64} />
          </span>
          <h1 className="ms-2 text-2xl">MediTrakk</h1>
        </div>

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}