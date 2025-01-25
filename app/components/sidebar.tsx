import Link from "next/link";
import { FaHouse, FaDatabase, FaUserPlus, FaNotesMedical } from "react-icons/fa6";

const Sidebar = () => {

  return (
    <aside
      id="logo-sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white pt-20 transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-white px-3 pb-4 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link href="/" legacyBehavior>
              <a className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                <FaHouse className="text-[#5d81ac]" />
                <span className="ms-3">Home</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/patient-database" legacyBehavior>
              <a className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                <FaDatabase className="text-yellow-600" />
                <span className="ms-3">Database</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/patient-registration" legacyBehavior>
              <a className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                <FaUserPlus className="text-green-700" />
                <span className="ms-3">Registration</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/patient-assessment" legacyBehavior>
              <a className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                <FaNotesMedical className="text-red-800" />
                <span className="ms-3">Assessment</span>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );

}

export default Sidebar;