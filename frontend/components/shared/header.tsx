import DarkModeToggle from "@/components/shared/header/dark-mode-toggle";
import Notification from "@/components/shared/header/notification";
import ProfileDropdown from "@/components/shared/header/profile-dropdown";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 bg-card p-3 shadow-md">
      <div className="flex justify-between">
        <span className="ms-2 whitespace-nowrap text-3xl font-bold tracking-tight">
          Malibiran Medical Clinic
        </span>
        <div className="flex items-center space-x-1">
          <DarkModeToggle />
          <Notification />
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default Header;
