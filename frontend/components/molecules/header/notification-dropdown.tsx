import { Notification } from "@/components/molecules/header/notification";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Bell } from "lucide-react";

const Dropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell />
          <span className="sr-only">Notification</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Notification />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
