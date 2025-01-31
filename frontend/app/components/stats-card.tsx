"use client"

import { FaUser, FaUserClock, FaCodePullRequest, FaClockRotateLeft, type Fa6 } from "react-icons/fa6"
import { FaEllipsis } from "react-icons/fa6"
import { FiChevronsDown } from "react-icons/fi";

interface StatsCardProps {
  icon: typeof Fa6
  title: string
  value: string | number
  footer: {
    text: string
    highlight?: string
    trend?: {
      value: string
      isPositive: boolean
    }
  }
}

const statsData = [
  {
    icon: FaUser,
    title: "Total Patient",
    value: 84,
    footer: {
      text: "Since last week",
      trend: {
        value: "-17.65%",
        isPositive: false,
      },
    },
  },
  {
    icon: FaUserClock,
    title: "Todays Appointment",
    value: 84,
    footer: {
      text: "Next Appointment",
      highlight: "10:00 AM",
    },
  },
  {
    icon: FaCodePullRequest,
    title: "Patient Request",
    value: 10,
    footer: {
      text: "Appointment Request",
      highlight: "+2",
    },
  },
  {
    icon: FaClockRotateLeft,
    title: "Inventory Updates",
    value: 84,
    footer: {
      text: "Low stock items",
      trend: {
        value: "",
        isPositive: false,
      },
    },
  },
]

function StatsCard({ icon: Icon, title, value, footer }: StatsCardProps) {
  return (
    <div className="card block w-full max-w-sm space-y-2 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="me-2 text-primary" />
          <p className="text-lg tracking-tight">{title}</p>
        </div>
        <FaEllipsis className="me-2 opacity-0 lg:opacity-100" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="flex items-center justify-center md:justify-normal">
        {footer.trend ? (
          <>
            <span className={footer.trend.isPositive ? "text-green-500" : "text-red-500"}>
              <FiChevronsDown className={footer.trend.isPositive ? "rotate-180" : ""} />
            </span>
            <span className={`me-1 ${footer.trend.isPositive ? "text-green-500" : "text-red-500"}`}>
              {footer.trend.value}
            </span>
          </>
        ) : null}
        {footer.highlight && (

          <span className="pe-2 text-blue-500"> {footer.highlight}</span>

        )}
        {footer.text}
      </p>
    </div>
  )
}

export default function StatsCards() {
  return (
    <div className="m-4 grid grid-cols-1 place-items-center gap-4 text-card-foreground md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}

