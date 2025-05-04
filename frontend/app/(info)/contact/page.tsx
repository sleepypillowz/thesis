// app/contact/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Facebook } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Phone className="text-blue-500" size={20} />
            <span>0999 820 5684 (Smart)</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-blue-500" size={20} />
            <span>0945 239 5382 (Globe)</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-green-600" size={20} />
            <span>130 Old Samson Rd.</span>
          </div>
          <div className="flex items-center gap-3">
            <Facebook className="text-blue-600" size={20} />
            <Link
              href="https://www.facebook.com/malibiranmed"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              facebook.com/malibiran-medical-clinic
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
