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
        <Button variant="outline" size="icon">
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="fixed right-4 top-16 z-50 w-96 rounded-xl bg-white p-0 shadow-xl"
      >
        <DashboardTable columns={columns} data={registrations ?? []} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QueueTableToggle;
