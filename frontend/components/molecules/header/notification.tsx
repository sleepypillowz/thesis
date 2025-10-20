import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Clock } from "lucide-react";
import { notifications } from "@/lib/placeholder-data";

export type NotificationType = {
  id?: number;
  title: string;
  time: string;
  icon: React.ElementType;
  color: string;
};

const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell />
          <span className="sr-only">Notification</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 w-64 p-0">
        <div className="flex flex-row items-center justify-between p-4">
          <span className="text-sm font-bold">Notifications</span>
          <span className="cursor-pointer text-xs hover:underline">
            Mark all as read
          </span>
        </div>

        {notifications.map((item) => (
          <div
            key={item.id}
            className="card m-0 cursor-pointer rounded-none p-4 hover:bg-muted"
          >
            <div className="grid grid-cols-5 gap-4">
              <div className="flex flex-col items-center justify-center">
                <item.icon className={item.color} />
              </div>

              <div className="col-span-4 flex flex-col">
                <span className="text-xs font-bold">{item.title}</span>
                <div className="flex flex-row items-center space-x-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />

                  <span className="text-xs">{item.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
