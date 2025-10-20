import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/custom-pagination";

export default function DailyAppointments() {
  return (
    <div className="card">
      <div className="flex justify-between text-sm">
        <h1 className="font-bold">Appointments</h1>
        <span>August 2025</span>
      </div>
      <Pagination className="my-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              <div className="flex flex-col items-center justify-center text-xs">
                <span>Mon</span>
                <span>1</span>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <div className="flex flex-col items-center justify-center text-xs">
                <span>Tue</span>
                <span>2</span>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <div className="flex flex-col items-center justify-center text-xs">
                <span>Wed</span>
                <span>3</span>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <div className="flex flex-col items-center justify-center text-xs">
                <span>Thu</span>
                <span>4</span>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <div className="flex flex-col items-center justify-center text-xs">
                <span>Fri</span>
                <span>5</span>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <div className="flex flex-col items-center justify-center text-xs">
                <span>Sat</span>
                <span>6</span>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <div className="flex flex-col items-center justify-center text-xs">
                <span>Sun</span>
                <span>7</span>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <span className="text-sm">3 appointments today</span>
      <div className="overflow-y-auto max-h-52 space-y-4">
        <div className="card p-3 space-y-4 mt-4 me-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Eva Green</span>
              <span className="text-xs">Routine Check-Up</span>
              <span className="text-xs">Dr. Sharma</span>
            </div>
            <span className="self-center text-sm">09:00 AM</span>
          </div>
        </div>
        <div className="card p-3 me-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Eva Green</span>
              <span className="text-xs">Routine Check-Up</span>
              <span className="text-xs">Dr. Sharma</span>
            </div>
            <span className="self-center text-sm">09:00 AM</span>
          </div>
        </div>
        <div className="card p-3 me-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Eva Green</span>
              <span className="text-xs">Routine Check-Up</span>
              <span className="text-xs">Dr. Sharma</span>
            </div>
            <span className="self-center text-sm">09:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
