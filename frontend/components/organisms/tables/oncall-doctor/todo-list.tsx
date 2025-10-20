import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function TodoList() {
  const patientGroup = [
    { id: 1, description: "Review patient charts", priority: "high" },
    {
      id: 2,
      description: "Complete patient prescriptions",
      priority: "normal",
    },
    { id: 3, description: "Follow-up with patients", priority: "low" },
  ];

  return (
    <div className="card space-y-6">
      <div className="flex justify-between">
        <span className="font-bold">Todo List</span>
        <Link
          href="/oncall-doctors"
          className="font-bold text-blue-500 hover:underline"
        >
          View All
        </Link>
      </div>
      <ul className="space-y-6">
        {patientGroup.map((item) => (
          <li key={item.id} className="flex flex-row justify-between">
            <div className="flex flex-row items-center">
              <Checkbox className="mr-2" />
              <span>{item.description}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {item.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
