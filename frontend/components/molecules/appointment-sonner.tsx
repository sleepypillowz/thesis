"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function AppointmentSonner() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Appointment Scheduled", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Submit
    </Button>
  );
}
