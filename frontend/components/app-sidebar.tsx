import { LayoutDashboard, Users, ClipboardPlus, Calendar, Clock, ClipboardPenLine, Bandage, ChartArea, HelpCircle, Settings, Database, UserPlus  } from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    url: "#",
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
    title: "Queueing",
    url: "/admin/queue",
    icon: Clock,
  },
  {
    title: "Assessment",
    url: "/admin/assessment",
    icon: ClipboardPenLine,
  },
  {
    title: "Treatment",
    url: "/admin/treatment",
    icon: Bandage,
  },
  {
    title: "Patient Portal",
    url: "/admin/patient-portal",
    icon: LayoutDashboard,
  },
  {
    title: "Medicine Inventory",
    url: "/admin/medicine-inventory",
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Malibiran Medical Clinic</SidebarGroupLabel>
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