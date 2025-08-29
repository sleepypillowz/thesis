"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const menuItems = [
  { name: "Home", href: "/patient" },
  { name: "Profile", href: "/patient/profile" },
  { name: "Appointments", href: "/patient/appointments" },
  { name: "Prescriptions", href: "/patient/prescriptions" },
  { name: "View Results", href: "/patient/results" },
  { name: "Make a Booking", href: "/patient/booking" },
  { name: "Queue", href: "/patient/queue" },
  { name: "Find a Doctor", href: "/patient/find-doctor" },
  { name: "Contact", href: "/patient/contact" },
];
export default function Navbar() {
  return (
    <div className="hidden justify-between rounded-full border-2 bg-card p-4 pl-0 shadow-sm md:visible md:flex md:pl-4">
      {/* Desktop Navigation */}
      <NavigationMenu className="md:flex">
        <NavigationMenuList>
          <NavigationMenuItem className="space-x-2">
            {menuItems.map((item) => (
              <NavigationMenuLink key={item.name} asChild>
                <Link
                  href={item.href}
                  className="group inline-flex h-9 w-max rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  {item.name}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
