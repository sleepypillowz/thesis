import Link from "next/link";
import Notification from "@/components/notification";
import Profile from "@/components/profile";

const Header = () => {
  return (
    <div className="w-full bg-background">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Link href="/" className="ms-2 flex md:me-24">
              <span className="ms-2 self-center whitespace-nowrap text-2xl font-semibold">Malibiran
                Medical Clinic</span>
            </Link>
          </div>
          <div className="relative">
            <Notification />
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;