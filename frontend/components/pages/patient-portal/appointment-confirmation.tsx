import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AppointmentConfirmation() {
  return (
    <div className="m-6">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">Juan Dela Cruz</h2>
        <span className="cursor-pointer text-sm font-semibold text-blue-500 underline">
          View Documents
        </span>
      </div>

      <AspectRatio ratio={3 / 4}>
        <Image
          src="/receipt.jpg"
          alt="Receipt"
          fill
          className="rounded-lg object-contain p-4"
        />
      </AspectRatio>

      <div className="flex flex-row gap-4">
        <Button variant="destructive" className="w-1/2 rounded-lg">
          Reject
        </Button>
        <Button className="w-1/2 rounded-lg">Confirm</Button>
      </div>

      <div className="mt-4">
        <Label className="text-sm text-muted-foreground">
          Send Text Message
        </Label>
        <Textarea
          defaultValue="Your Appointment has been confirmed, make sure to arrive before 15 minutes"
          className="w-full text-muted-foreground"
          readOnly
        />
      </div>
    </div>
  );
}
