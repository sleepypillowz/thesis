import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"
import Header from "../components/header";

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>

        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1">
            <SidebarTrigger className="fixed" />
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
