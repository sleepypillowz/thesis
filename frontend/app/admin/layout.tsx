import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/admin-sidebar";
import Header from "@/components/organisms/header";

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
            <SidebarTrigger className="fixed md:hidden" />
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
