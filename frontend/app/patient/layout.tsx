import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/organisms/sidebars/patient-sidebar";
import Header from "@/components/organisms/header";
import RouteProgress from "@/components/shared/route-progress";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <PatientSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1">
            <SidebarTrigger className="fixed md:hidden" />
            <RouteProgress />
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
