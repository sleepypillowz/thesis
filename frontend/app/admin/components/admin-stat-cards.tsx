"use client";
import { AdminStatChart } from "@/components/organisms/charts/admin-stat-chart";
import { Banknote, Scissors, User, UserRoundPlus } from "lucide-react";

const data = [
  { month: "January", value: 186 },
  { month: "February", value: 305 },
  { month: "March", value: 237 },
  { month: "April", value: 73 },
  { month: "May", value: 209 },
  { month: "June", value: 214 },
];

export default function AdminStatCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminStatChart
        title="Appointments"
        total={650}
        color="purple"
        icon={User}
        data={data}
      />
      <AdminStatChart
        title="Operations"
        total={54}
        color="orange"
        icon={Scissors}
        data={data}
      />
      <AdminStatChart
        title="New Patients"
        total={129}
        color="green"
        icon={UserRoundPlus}
        data={data}
      />
      <AdminStatChart
        title="Earnings"
        total={20125}
        color="blue"
        icon={Banknote}
        data={data}
      />
    </div>
  );
}
