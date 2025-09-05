"use client";

import Link from "next/link";
import Image from "next/image";
import { useRole } from "@/hooks/use-role";
import { useName } from "@/hooks/use-name";
import { Skeleton } from "../ui/skeleton";

export default function SidebarHeaderProfile() {
  const role = useRole();
  const name = useName();

  return (
    <>
      <Link href="/" className="flex items-center justify-center gap-2">
        <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            className="aspect-square h-full w-full"
            src="/logo.png"
            alt="logo"
            width={64}
            height={64}
          />
        </span>
        <h1 className="text-2xl">MediTrakk</h1>
      </Link>

      <div className="flex flex-col items-center">
        <div className="mb-2 mt-4">
          <Image
            className="rounded-2xl border-2 object-cover"
            src="/secretary.jpg"
            alt="user"
            width={64}
            height={64}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-bold">
            {name ?? <Skeleton className="mb-1 h-4 w-[80px]" />}
          </span>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {role ?? <Skeleton className="h-4 w-[60px]" />}
          </span>
        </div>
      </div>
    </>
  );
}
