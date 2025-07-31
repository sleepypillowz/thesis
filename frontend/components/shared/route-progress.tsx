// components/RouteProgress.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function RouteProgress() {
  const pathname = usePathname();
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    NProgress.start();

    // Delay a bit to simulate loading
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      NProgress.done();
    }, 300); // Customize duration if needed

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pathname]);

  return null;
}
