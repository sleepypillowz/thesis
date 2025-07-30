import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import InfoHeader from "@/app/hero-header";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <SidebarInset className="flex-1">
          <main className="flex-1">
            <SidebarTrigger className="fixed md:hidden" />
            <InfoHeader />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
