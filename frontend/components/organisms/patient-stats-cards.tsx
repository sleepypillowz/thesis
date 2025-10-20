"use client";
import { FiChevronsDown } from "react-icons/fi";
import Image from "next/image";

interface StatsCardProps {
  img: string;
  title: string;
  value: string | number;
  footer: {
    text: string;
    highlight?: string;
    trend?: {
      isPositive: boolean;
    };
  };
}

const statsData = [
  {
    img: "/blood-pressure.png",
    title: "Blood Pressure",
    value: "110/70",
    footer: {
      text: "10% Higher",
      trend: {
        isPositive: true,
      },
    },
  },
  {
    img: "/heart-rate.png",
    title: "Current Diagnosis",
    value: "Hypertension",
    footer: {
      text: "Stable Condition",
    },
  },
  {
    img: "/glucose.png",
    title: "Upcoming Appointments",
    value: "2",
    footer: {
      text: "Next: Jan 20, 2024",
    },
  },
  {
    img: "/blood-count.png",
    title: "Pulse Rate",
    value: "72 bpm",
    footer: {
      text: "5% Lower",
      trend: {
        isPositive: true,
      },
    },
  },
];

function StatsCard({ img, title, value, footer }: StatsCardProps) {
  return (
    <div className="card block w-full max-w-sm space-y-2 rounded-xl">
      <div className="grid grid-cols-2">
        <div className="relative aspect-[2/1] w-full max-w-md">
          <Image
            src={img}
            alt="blood pressure"
            width={48}
            height={48}
            className="float-start rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col text-end">
          <p className="font-semibold tracking-tighter">{title}</p>
          <p className="mt-4 text-xl font-bold text-green-600">{value}</p>
        </div>
      </div>

      <p className="flex items-center justify-center text-sm text-muted-foreground md:justify-normal">
        {footer.trend ? (
          <>
            <span
              className={
                footer.trend.isPositive ? "text-green-500" : "text-red-500"
              }
            >
              <FiChevronsDown
                className={footer.trend.isPositive ? "rotate-180" : ""}
              />
            </span>
            <span
              className={`me-1 ${
                footer.trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            ></span>
          </>
        ) : null}
        {footer.text} {footer.trend ? "Then Last Month" : ""}
      </p>
    </div>
  );
}

export default function PatientStatsCard() {
  return (
    <div className="grid grid-cols-1 place-items-center gap-6 text-card-foreground md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}