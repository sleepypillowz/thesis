"use client";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import DarkModeToggle from "@/components/molecules/header/dark-mode-toggle";

const HeroHeader = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/doctors-list", label: "Doctors" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="z-50 bg-card px-6 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold">Malibiran Clinic</span>
        </div>
        <div className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "nav-link",
                pathname === link.href && "text-primary font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-4">
          <DarkModeToggle />
          <Button className="rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-md">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        <button className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default HeroHeader;
