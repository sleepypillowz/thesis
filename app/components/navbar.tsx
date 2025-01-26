import Link from "next/link";


const Navbar = () => {

  return (
    <nav className="col-span-2 rounded-lg border-2 border-solid border-gray-300 bg-white p-3">
      <ul className="flex justify-between">
        <li>
          <Link href="/"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/patient/profile"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link href="/patient/appointments"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Appointments</span>
          </Link>
        </li>
        <li>
          <Link href="/patient/prescriptions"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Prescriptions</span>
          </Link>
        </li>
        <li>
          <Link href="/patient/results"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>View Results</span>
          </Link>
        </li>
        <li>
          <Link href="/patient/booking"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Make a Booking</span>
          </Link>
        </li>
        <li>
          <Link href="/patient/queue"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Queue</span>
          </Link>
        </li>

        <li>
          <Link href="/patient/find-doctor"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Find a Doctor</span>
          </Link>
        </li>
        <li>
          <Link href="/patient/contact"
            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <span>Contact Us</span>
          </Link>
        </li>
      </ul>
    </nav>
  );

}

export default Navbar;