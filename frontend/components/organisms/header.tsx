import Notification from "@/components/molecules/header/notification-dropdown";
import Profile from "@/components/molecules/header/profile";
import Username from "@/components/atoms/username";
import Link from "next/link";

const Header = () => {
  return (
    <div className="z-50 bg-card text-card-foreground shadow-md lg:sticky lg:top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Link href="/" className="ms-2 flex md:me-24">
              <span className="ms-2 self-center whitespace-nowrap text-3xl font-bold tracking-tight">
                Malibiran Medical Clinic
              </span>
            </Link>
          </div>
          <div className="relative flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <Username />
              </div>
              <div className="flex items-center space-x-2">
                <Notification />
                <Profile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
