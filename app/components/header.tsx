import Link from "next/link";
import Dropdown from "@/components/dropdown";

const Header = () => {
  return (
    <div className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Link href="/" className="ms-2 flex md:me-24">
              <span className="self-center whitespace-nowrap text-2xl font-semibold">Malibiran
                Medical Clinic</span>
            </Link>
          </div>
          <div className="relative">
            <Dropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;