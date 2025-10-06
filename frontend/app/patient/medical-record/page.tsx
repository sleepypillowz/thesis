"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function Timeline() {
  const events = [
    {
      date: "February 2022",
      title: "Application UI code in Tailwind CSS",
      description:
        "Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.",
      link: true,
    },
    {
      date: "March 2022",
      title: "Marketing UI design in Figma",
      description:
        "All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.",
    },
    {
      date: "April 2022",
      title: "E-Commerce UI code in Tailwind CSS",
      description:
        "Get started with dozens of web components and interactive elements built on top of Tailwind CSS.",
    },
  ];

  return (
    <div className="card m-6">
      <h1 className="mb-4 font-bold">Medical Records</h1>
      {/* vertical line */}
      <div className="absolute left-16 top-[149px] h-[310px] w-px bg-muted-foreground/30" />

      <ul className="space-y-10 pl-12">
        {events.map((event, idx) => (
          <li key={idx} className="relative">
            {/* circle sits on line */}
            <span className="absolute -left-[38px] top-1 h-3 w-3 rounded-full bg-muted-foreground" />

            <div>
              <div className="flex flex-row items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <time className="text-sm text-muted-foreground">
                  {event.date}
                </time>
              </div>

              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>

              {event.link && (
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href="#">
                    Learn more <ArrowRight />
                  </Link>
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
