import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

export default async function SidebarHeaderProfile() {
  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as string | undefined;

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
            src={user?.imageUrl ?? "/default-user.png"}
            alt="user"
            width={64}
            height={64}
          />
        </div>

        <span className="text-sm font-bold">{user?.fullName}</span>
        <span className="text-xs font-semibold text-muted-foreground">
          {String(userRole ?? "PATIENT").toUpperCase()}
        </span>
      </div>
    </>
  );
}
