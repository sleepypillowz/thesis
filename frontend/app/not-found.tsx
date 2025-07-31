"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  let backhref = "/";
  if (pathname.includes("/doctor")) {
    backhref = "/doctor";
  } else if (pathname.includes("/secretary")) {
    backhref = "/secretary";
  } else if (pathname.includes("/patient")) {
    backhref = "/patient";
  } else if (pathname.includes("/admin")) {
    backhref = "/admin";
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Image
        src="/walter-white-404.png"
        alt="shocked walter white"
        width={200}
        height={200}
        className="mb-6"
      />
      <h1 className="text-5xl font-bold">Oops! 404</h1>
      <p className="mt-2 text-sm">
        The page you are looking for does not exist.
      </p>
      <Button asChild variant="link">
        <Link href={backhref}>Go back to safety</Link>
      </Button>
    </div>
  );
}
