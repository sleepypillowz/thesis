import PatientChart from "@/components/organisms/charts/patient-chart";
import AdminStatCards from "./components/admin-stat-cards";

export default function Page() {
  return (
    <>
      <AdminStatCards />
      <div className="grid grid-cols-3">
        <PatientChart />
        <div className="card"></div>
        <div className="card"></div>
      </div>
    </>
  );
}
