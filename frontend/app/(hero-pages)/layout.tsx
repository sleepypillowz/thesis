import InfoHeader from "@/app/hero-header";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-1">
        <InfoHeader />
        {children}
      </main>
    </>
  );
}
