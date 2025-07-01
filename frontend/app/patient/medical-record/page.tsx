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
        <h1 className="font-bold">Records</h1>
        <div className="grid grid-cols-4 gap-6">
          <div className="flex items-center justify-end gap-4 text-end">
            <div className="flex flex-col text-sm">
              <span className="font-bold">06/30/2025</span>
              <span>8:00PM</span>
            </div>
            <Circle className="fill-current text-red-500" />
          </div>

          <div className="col-span-2 flex flex-col content-center space-y-4 rounded-xl bg-muted p-4">
            <span className="text-sm font-bold">Therapy</span>
            <span className="text-sm">Therapy with Dr. K</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="flex items-center justify-end gap-4 text-end">
            <div className="flex flex-col text-sm">
              <span className="font-bold">06/28/2025</span>
              <span>2:00PM</span>
            </div>
            <Circle className="fill-current text-yellow-500" />
          </div>

          <div className="col-span-2 flex flex-col content-center space-y-4 rounded-xl bg-muted p-4">
            <span className="text-sm font-bold">X-Ray</span>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="flex items-center justify-end gap-4 text-end">
            <div className="flex flex-col text-sm">
              <span className="font-bold">06/28/2025</span>
              <span>2:00PM</span>
            </div>
            <Circle className="fill-current text-green-600" />
          </div>
          <div className="col-span-2 flex flex-col content-center space-y-4 rounded-xl bg-muted p-4">
            <span className="text-sm font-bold">Consultation</span>
            <span className="text-sm">Consultation with Dr. John Deo</span>
          </div>
        </div>
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
