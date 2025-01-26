import Navbar from "@/components/navbar";


export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 px-8 py-8 pt-24">
      <div className="flex justify-center">
        <div className="mx-auto max-w-7xl rounded-lg">
          <Navbar />
          {children}
        </div>
      </div>
    </main>
  );
}
