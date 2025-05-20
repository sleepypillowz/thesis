import Link from "next/link";
import { buttonVariants } from "../ui/button";

const HeroHeader = () => {
  return (
    <nav className="z-50 bg-card px-6 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            M
          </div>
          <span className="text-xl font-bold text-gray-900">
            Malibiran Clinic
          </span>
        </div>
        <div className="hidden items-center space-x-6 md:flex">
          <Link
            href="/"
            className="text-gray-600 transition-colors hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-gray-600 transition-colors hover:text-blue-600"
          >
            Services
          </Link>
          <Link
            href="/doctors-list"
            className="text-gray-600 transition-colors hover:text-blue-600"
          >
            Doctors
          </Link>
          <Link
            href="/about"
            className="text-gray-600 transition-colors hover:text-blue-600"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 transition-colors hover:text-blue-600"
          >
            Contact
          </Link>
        </div>
        <div className="hidden md:block">
          <Link
            href="/login"
            className={buttonVariants({ variant: "default" })}
          >
            Login
          </Link>
        </div>
        <button className="text-gray-600 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default HeroHeader;
