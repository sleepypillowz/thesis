"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-6 w-12 rounded-full bg-gray-300 transition-colors duration-300 dark:bg-gray-600"
    >
      {/* Knob */}
      <motion.div
        className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md"
        animate={{
          x: isDark ? 24 : 0, // slide knob
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-gray-800" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
        )}
      </motion.div>
    </Button>
  );
}
