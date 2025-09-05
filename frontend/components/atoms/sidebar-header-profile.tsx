"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRole, getName } from "@/utils/auth"; // import both

export default function SidebarHeaderProfile() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const r = getRole();
    setRole(r);

    (async () => {
      const n = await getName();
      setName(n);
    })();
  }, []);

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

        <span className="text-sm font-bold">{name ?? "Loading..."}</span>
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          {role ?? "Loading..."}
        </span>
      </div>
    </>
  );
}
