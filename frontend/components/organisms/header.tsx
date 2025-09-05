import DarkModeToggle from "@/components/molecules/header/dark-mode-toggle";
import Notification from "@/components/molecules/header/notification-dropdown";
import Profile from "@/components/molecules/header/profile";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 bg-card p-3 shadow-md">
      <div className="flex justify-between">
        <span className="ms-2 whitespace-nowrap text-3xl font-bold tracking-tight">
          Malibiran Medical Clinic
        </span>
        <div className="space-x-1">
          <DarkModeToggle />
          <Notification />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Header;
