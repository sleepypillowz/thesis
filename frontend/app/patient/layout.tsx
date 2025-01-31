import Navbar from "@/components/navbar";
import Header from "../components/header";


export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 px-8 py-8 pt-24">
        <div className="flex justify-center">
          <div className="mx-auto max-w-5xl rounded-lg">
            <Navbar />
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
