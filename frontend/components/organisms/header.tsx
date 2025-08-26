import Notification from "@/components/molecules/header/notification-dropdown";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="z-50 bg-card text-card-foreground shadow-md lg:sticky lg:top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end"></div>
          <div className="relative flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end"></div>
              <div className="flex items-center space-x-2">
                <Notification />
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
