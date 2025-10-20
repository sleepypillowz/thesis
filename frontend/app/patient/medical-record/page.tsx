import { Circle } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Page() {
  return (
    <div className="m-6">
      <div className="card space-y-6">
        {/* Header with Legend */}
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">Records</h1>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-muted-foreground">Completed</span>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line - positioned to align with circles */}
          <div className="absolute left-[calc(25%-12px)] top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {/* Item 1 */}
            <div className="grid grid-cols-4 gap-6 relative">
              <div className="flex items-start justify-end gap-4 text-end pt-2">
                <div className="flex flex-col text-sm">
                  <span className="font-bold">06/30/2025</span>
                  <span className="text-muted-foreground">8:00PM</span>
                </div>
                <div className="relative z-10">
                  <Circle className="fill-current text-red-500 bg-white border-2 border-white" size={20} />
                </div>
              </div>

              <div className="col-span-2 flex flex-col space-y-2 rounded-xl bg-muted p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative before:content-[''] before:absolute before:left-[-8px] before:top-5 before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent before:border-r-[8px] before:border-r-gray-200 after:content-[''] after:absolute after:left-[-7px] after:top-5 after:border-t-[8px] after:border-t-transparent after:border-b-[8px] after:border-b-transparent after:border-r-[8px] after:border-r-muted">
                <span className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">🩺</span>
                  Therapy
                </span>
                <span className="text-sm text-muted-foreground">Therapy with Dr. K</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="grid grid-cols-4 gap-6 relative">
              <div className="flex items-start justify-end gap-4 text-end pt-2">
                <div className="flex flex-col text-sm">
                  <span className="font-bold">06/28/2025</span>
                  <span className="text-muted-foreground">2:00PM</span>
                </div>
                <div className="relative z-10">
                  <Circle className="fill-current text-yellow-500 bg-white border-2 border-white" size={20} />
                </div>
              </div>

              <div className="col-span-2 flex flex-col space-y-2 rounded-xl bg-muted p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative before:content-[''] before:absolute before:left-[-8px] before:top-5 before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent before:border-r-[8px] before:border-r-gray-200 after:content-[''] after:absolute after:left-[-7px] after:top-5 after:border-t-[8px] after:border-t-transparent after:border-b-[8px] after:border-b-transparent after:border-r-[8px] after:border-r-muted">
                <span className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  X-Ray
                </span>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                  commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                  penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                  Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
                  sem. Nulla consequat massa quis enim.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="grid grid-cols-4 gap-6 relative">
              <div className="flex items-start justify-end gap-4 text-end pt-2">
                <div className="flex flex-col text-sm">
                  <span className="font-bold">06/28/2025</span>
                  <span className="text-muted-foreground">2:00PM</span>
                </div>
                <div className="relative z-10">
                  <Circle className="fill-current text-green-600 bg-white border-2 border-white" size={20} />
                </div>
              </div>

              <div className="col-span-2 flex flex-col space-y-2 rounded-xl bg-muted p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative before:content-[''] before:absolute before:left-[-8px] before:top-5 before:border-t-[8px] before:border-t-transparent before:border-b-[8px] before:border-b-transparent before:border-r-[8px] before:border-r-gray-200 after:content-[''] after:absolute after:left-[-7px] after:top-5 after:border-t-[8px] after:border-t-transparent after:border-b-[8px] after:border-b-transparent after:border-r-[8px] after:border-r-muted">
                <span className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  Consultation
                </span>
                <span className="text-sm text-muted-foreground">Consultation with Dr. John Deo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}