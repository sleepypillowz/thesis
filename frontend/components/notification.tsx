import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";
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
        <DropdownMenuLabel>Notification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Notification 1</DropdownMenuItem>
        <DropdownMenuItem>Notification 2</DropdownMenuItem>
        <DropdownMenuItem>Notification 3</DropdownMenuItem>
        <DropdownMenuItem>Notification 4</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Dropdown;
