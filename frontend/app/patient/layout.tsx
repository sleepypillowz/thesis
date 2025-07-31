import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PatientSidebar } from "@/app/patient/patient-sidebar";
import Header from "@/components/organisms/header";
import RouteProgress from "@/components/shared/route-progress";

export default function DoctorLayout({
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
          </div>
        </div>
      </main>
    </>
  );
}
