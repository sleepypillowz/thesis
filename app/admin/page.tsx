import { FaUser, FaEllipsis, FaUserClock, FaCodePullRequest, FaClockRotateLeft } from "react-icons/fa6";

import Sidebar from "../components/sidebar";
import { VisitorsChart } from "@/components/visitors-chart";
import { CommonDiseasesChart } from "@/components/common-diseases-chart";

export default function Page() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 mt-16 flex-1">
        <div className="px-16 py-4">
          <p className="text-2xl font-bold">
            Good Day, Test
          </p>
          <p className="text-sm">Check out the latest updates from the past 7 days!</p>
        </div>

        <div className="mx-16 flex flex-row gap-4">

          <div className="block w-96 max-w-sm border-b-2 border-blue-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUser className="me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Total Patient</p>
              </div>
              <FaEllipsis className="me-2 text-gray-500" />
            </div>
            <p className="text-3xl font-bold text-gray-700">84</p>
            <p>
              <span className="text-red-500">↓ -17.65%</span> Since last week
            </p>
          </div>

          <div className="block w-96 max-w-sm border-b-2 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUserClock className="fa-solid fa-user-clock me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Todays Appointment</p>
              </div>
              <FaEllipsis className="me-2 text-gray-500" />
            </div>
            <p className="text-3xl font-bold text-gray-700">84</p>
            <p className="">
              Next Appointment - <span className="text-blue-500">10:00 AM</span>
            </p>
          </div>

          <div className="block w-96 max-w-sm border-b-2 border-blue-500 p-6">
            <div className="flex justify-between">
              <div className="flex items-center">
                <FaCodePullRequest className="fa-solid fa-code-pull-request me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Patient Request</p>
              </div>
              <FaEllipsis className="me-2 text-gray-500" />
            </div>
            <p className="text-3xl font-bold text-gray-700">10</p>
            <p className="">
              <span className="text-blue-500">+2</span> Appointment Request
            </p>
          </div>

          <div className="block w-96 max-w-sm border-b-2 border-red-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaClockRotateLeft className="fa-solid fa-clock-rotate-left me-2 text-blue-500" />
                <p className="text-lg tracking-tight text-gray-900">Inventory Updates</p>
              </div>
              <i className="fa-solid fa-ellipsis"></i>
            </div>
            <p className="text-3xl font-bold text-gray-700">84</p>
            <p className="text-red-500">Low stock items</p>
          </div>
        </div>

        <div className="mx-16 flex flex-row justify-center space-x-16 py-16">
          <div className="w-2/4">
            <VisitorsChart />
          </div>

          <div className="w-1/4">
            <CommonDiseasesChart />
          </div>
        </div>


      </main>
    </>
  );
}