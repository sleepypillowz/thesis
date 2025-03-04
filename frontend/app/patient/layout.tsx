import Navbar from "@/components/organisms/navbar";
import Header from "@/components/organisms/header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/organisms/patient-sidebar";

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
          <Header />
          <SidebarTrigger className="fixed md:hidden" />
          <main className="flex-1 px-8 py-8 pt-24">
            <div className="flex justify-center">
              <div className="mx-auto max-w-5xl rounded-lg">
                <Navbar />

                {children}
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
