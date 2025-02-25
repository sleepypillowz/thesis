import Navbar from "@/app/components/navbar";
import Header from "../components/header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/patient-sidebar";
import { Toaster } from "sonner";

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          <SidebarTrigger className="fixed md:hidden" />
          <Header />
          <main className="flex-1 px-8 py-8 md:pt-24">
            <div className="flex justify-center">
              <div className="mx-auto max-w-5xl rounded-lg">
                <Navbar />
                {children}
                <Toaster />
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
