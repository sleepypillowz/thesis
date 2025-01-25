import { FaUser, FaEllipsis, FaUserClock, FaCodePullRequest, FaClockRotateLeft } from "react-icons/fa6";
import { FiChevronsDown } from "react-icons/fi";

import { VisitorsChart } from "@/components/visitors-chart";
import { CommonDiseasesChart } from "@/components/common-diseases-chart";

export default function Page() {
  return (
    <>
      <div className="mt-16 text-center md:text-left">
        <div className="px-6 py-4 lg:ml-4">
          <p className="text-2xl font-bold">
            Good Day, Test
          </p>
          <p className="text-sm">Check out the latest updates from the past 7 days!</p>
        </div>

        <div className="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex w-full max-w-sm flex-col justify-items-center space-y-2 border-b-2 border-blue-500 p-6 pr-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUser className="me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Total Patient</p>
              </div>
              <FaEllipsis className="me-2 text-gray-500 opacity-0 lg:opacity-100" />
            </div>
            <p className="text-3xl font-bold text-gray-700">84</p>
            <p className="flex items-center justify-center md:justify-normal">
              <span className="text-red-500">
                <FiChevronsDown />
              </span>

              <span className="me-1 text-red-500">-17.65%</span> Since last week
            </p>
          </div>

          <div className="block w-full max-w-sm space-y-2 border-b-2 border-green-500 p-6 pr-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUserClock className="fa-solid fa-user-clock me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Todays Appointment</p>
              </div>
              <FaEllipsis className="me-2 text-gray-500 opacity-0 lg:opacity-100" />
            </div>
            <p className="text-3xl font-bold text-gray-700">84</p>
            <p>
              Next Appointment - <span className="text-blue-500">10:00 AM</span>
            </p>
          </div>

          <div className="block w-full max-w-sm space-y-2 border-b-2 border-blue-500 p-6 pr-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCodePullRequest className="fa-solid fa-code-pull-request me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Patient Request</p>
              </div>
              <FaEllipsis className="me-2 text-gray-500 opacity-0 lg:opacity-100" />
            </div>
            <p className="text-3xl font-bold text-gray-700">10</p>
            <p >
              <span className="text-blue-500">+2</span> Appointment Request
            </p>
          </div>

          <div className="block w-full max-w-sm space-y-2 border-b-2 border-red-500 p-6 pr-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaClockRotateLeft className="fa-solid fa-clock-rotate-left me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Inventory Updates</p>
              </div>
              <FaEllipsis className="me-2 text-gray-500 opacity-0 lg:opacity-100" />
            </div>
            <p className="text-3xl font-bold text-gray-700">84</p>
            <p className="text-red-500">Low stock items</p>
          </div>
        </div>
        <div className="lg:mx-16 lg:flex lg:justify-center lg:space-x-16 lg:pt-16">
          <div className="lg:w-full lg:max-w-3xl">
            <VisitorsChart />
          </div>

          <div className="lg:w-full lg:max-w-xs">
            <CommonDiseasesChart />
          </div>
        </div>
      </div>
    </>
  );
}