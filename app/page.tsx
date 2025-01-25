import Link from "next/link";
import { buttonVariants } from "../components/ui/button";

export default function Home() {
  return (
    <main className="mt-64">
      <div className="flex justify-center">

        <Link className={buttonVariants({ variant: "outline" })} href="/patient">Patient</Link>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">Admin</Link>

      </div>
    </main>

  );
}
