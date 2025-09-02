"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <div className="flex justify-between p-4 pl-0 lg:justify-center lg:border-2 lg:bg-card lg:pl-4 lg:shadow-sm">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium hover:underline"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            {menuItems.map((item) => (
              <NavigationMenuLink key={item.name} asChild>
                <Link
                  href={item.href}
                  className="group inline-flex h-9 w-max rounded-md px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
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
