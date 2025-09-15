import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { DashboardTable } from "@/components/ui/dashboard-table";
import { columns } from "./columns";
import { registrations } from "@/lib/placeholder-data";
import { ChevronDown } from "lucide-react";

const QueueTableToggle = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-96 justify-between">
          Upcoming Appointments
          <ChevronDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={0}
        className="w-96 p-0 shadow-xl"
      >
        <DashboardTable columns={columns} data={registrations ?? []} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QueueTableToggle;
