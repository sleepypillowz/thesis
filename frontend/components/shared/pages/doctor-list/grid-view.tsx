"use client";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { doctors } from "@/lib/placeholder-data";
import Image from "next/image";

export default function GridView() {
  return (
    <TabsContent value="grid-view">
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {doctors?.map((item) => (
          <div
            key={item.name}
            className="card flex items-center gap-2 rounded-2xl"
          >
            <Image
              src="/default-profile.jpg"
              alt={item.name}
              height={128}
              width={128}
              quality={100}
              className="h-32 w-32 rounded-full"
            />
            <div className="ml-4 flex flex-col">
              <span className="text-2xl font-bold">{item.name}</span>
              <span>{item.specialization}</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {item.days_available?.split(",").map((day, index) => (
                  <Badge key={index} variant="outline" className="rounded-full">
                    {day.trim()}
                  </Badge>
                ))}
                <Badge variant="outline" className="rounded-full">
                  {item.working_hours}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
}
