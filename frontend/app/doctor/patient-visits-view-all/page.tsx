"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  Stethoscope,
  AlertTriangle,
  Activity,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import QueuePDFExport from "@/components/shared/QueuePDFExport";

type PriorityLevel = "Priority" | "Regular" | "Emergency";
type VisitStatus =
  | "Completed"
  | "Waiting"
  | "Queued for Treatment"
  | "Queued for Assessment"
  | string;

interface Visit {
  id: number;
  patient_name: string;
  priority_level: PriorityLevel;
  status: VisitStatus;
  complaint: string;
  queue_number: number;
  visit_date: string;
  visit_created_at: string;
  treatment_created_at: string | null;
}

interface MonthSummary {
  month: string;
  totalVisits: number;
  avgQueuePosition: number;
  priorityDistribution: Record<PriorityLevel, number>;
  statusBreakdown: Record<VisitStatus, number>;
}

interface GroupedVisitsResponse {
  [month: string]: Visit[];
}

// Queue data interface for PDF export
interface QueueEntry {
  patient_id: string;
  patient_name: string;
  queue_number: number | null;
  priority_level: string;
  complaint: string;
  status: string;
  created_at: string;
  queue_date: string;
}

interface QueueData {
  month: number;
  year: number;
  entries: QueueEntry[];
}

export default function MonthlyVisitReports() {
  const [groupedVisits, setGroupedVisits] = useState<GroupedVisitsResponse>({});
  const [monthSummaries, setMonthSummaries] = useState<MonthSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Authentication required. Please sign in.");
          setLoading(false);
          return;
        }

        const response = await axios.get<GroupedVisitsResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/visits/monthly-details/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Sort months in descending order (newest first)
        const months = Object.keys(response.data);
        const sortedMonths = months.sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );

        // Create sorted data object
        const sortedData: GroupedVisitsResponse = {};
        sortedMonths.forEach((month) => {
          sortedData[month] = response.data[month];
        });

        setGroupedVisits(sortedData);

        // Create summaries in sorted order
        const summaries = sortedMonths.map((month) => {
          const visits = response.data[month];
          return {
            month,
            totalVisits: visits.length,
            avgQueuePosition: calculateAverageWaitTime(visits),
            priorityDistribution: calculatePriorityDistribution(visits),
            statusBreakdown: calculateStatusBreakdown(visits),
          };
        });

        setMonthSummaries(summaries);

        // Expand the latest month by default
        if (sortedMonths.length > 0) {
          setExpandedMonths({ [sortedMonths[0]]: true });
        }
      } catch (err) {
        setError("Failed to load visit data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMonthExpansion = (month: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  // Function to convert visits to queue data for PDF export
  const getQueueDataForMonth = (month: string): QueueData => {
    const visits = groupedVisits[month] || [];
    const [year, monthNum] = month.split("-").map(Number);

    const entries: QueueEntry[] = visits.map((visit) => ({
      patient_id: visit.id.toString(),
      patient_name: visit.patient_name,
      queue_number: visit.queue_number,
      priority_level: visit.priority_level,
      complaint: visit.complaint,
      status: visit.status,
      created_at: visit.visit_created_at,
      queue_date: visit.visit_date,
    }));

    return {
      month: monthNum,
      year,
      entries,
    };
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-4 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-16" />
                  ))}
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, k) => (
                    <Skeleton key={k} className="h-16" />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again <span className="ml-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall stats for header cards
  const totalMonths = monthSummaries?.length;
  const totalVisits = monthSummaries?.reduce(
    (sum, m) => sum + m.totalVisits,
    0
  );
  const avgVisits = totalMonths
    ? (totalVisits / totalMonths).toFixed(2)
    : "0.00";
  const highPriority = monthSummaries?.reduce(
    (sum, m) => sum + (m.priorityDistribution["Priority"] || 0),
    0
  );

  const totalCompleted = monthSummaries?.reduce(
    (sum, m) => sum + (m.statusBreakdown["Completed"] || 0),
    0
  );
  const completionRate = totalVisits
    ? `${((totalCompleted / totalVisits) * 100).toFixed(2)}%`
    : "0.00%";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-600 p-2 shadow-md">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Monthly Visit Reports
              </h1>
              <p className="mt-1 max-w-2xl text-gray-600">
                Comprehensive analysis of patient visits and service metrics
                across all departments
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Months"
            value={totalMonths}
            icon={<Activity className="h-5 w-5" />}
            color="blue"
          />

          <StatCard
            title="Avg Visits/Month"
            value={avgVisits}
            icon={<Stethoscope className="h-5 w-5" />}
            color="green"
          />

          <StatCard
            title="High Priority Cases"
            value={highPriority}
            icon={<AlertTriangle className="h-5 w-5" />}
            color="purple"
          />

          <StatCard
            title="Completion Rate"
            value={completionRate}
            icon={<ClipboardList className="h-5 w-5" />}
            color="yellow"
          />
        </div>

        {/* Monthly Reports Accordion - LATEST FIRST */}
        <div className="space-y-4">
          {monthSummaries?.length > 0 ? (
            monthSummaries?.map((summary) => {
              const isExpanded = expandedMonths[summary.month];
              const monthName = new Date(
                summary.month + "-01"
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              });

              return (
                <Card
                  key={summary.month}
                  className="overflow-hidden border-0 bg-white shadow-sm transition-all duration-300"
                >
                  <button
                    className="w-full rounded-t p-6 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => toggleMonthExpansion(summary.month)}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {monthName}
                        </h2>
                        <Badge className="border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">
                          {summary.totalVisits}{" "}
                          {summary.totalVisits === 1 ? "Visit" : "Visits"}
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="animate-fadeIn border-t border-gray-100 p-6">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Monthly Details
                        </h3>
                        <QueuePDFExport
                          queueData={getQueueDataForMonth(summary.month)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                        />
                      </div>

                      {/* Month Summary Metrics */}
                      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <MetricCard
                          label="Avg Wait Time"
                          value={`${(summary.avgQueuePosition / 60).toFixed(
                            2
                          )} hrs`}
                          description="From registration to treatment"
                        />
                        <MetricCard
                          label="Priority Lane"
                          value={summary.priorityDistribution["Priority"] || 0}
                          description="PWD/ Pregnant/ Seniors"
                        />
                        <MetricCard
                          label="Completed"
                          value={summary.statusBreakdown["Completed"] || 0}
                          description="Successful treatments"
                        />
                        <MetricCard
                          label="Pending"
                          value={summary.statusBreakdown["Waiting"] || 0}
                          description="Requiring follow-up"
                        />
                      </div>

                      {/* Visit Details Table */}
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Patient
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Priority
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Visit Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Complaint
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {groupedVisits[summary.month]?.map((visit) => {
                              const priorityColors = {
                                Priority: "bg-green-100 text-green-800",
                                Regular: "bg-yellow-100 text-yellow-800",
                                Emergency: "bg-red-100 text-red-800",
                              };

                              const statusColors = {
                                Completed: "bg-green-100 text-green-800",
                                Waiting: "bg-yellow-100 text-yellow-800",
                                "Queued for Treatment":
                                  "bg-blue-100 text-blue-800",
                                "Queued for Assessment":
                                  "bg-blue-100 text-blue-800",
                              };

                              return (
                                <tr
                                  key={visit.id}
                                  className="transition-colors hover:bg-gray-50"
                                >
                                  <td className="whitespace-nowrap px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                      {visit.patient_name}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    <Badge
                                      className={`${
                                        priorityColors[visit.priority_level] ||
                                        "bg-gray-100 text-gray-800"
                                      } px-2 py-1 text-xs`}
                                    >
                                      {visit.priority_level}
                                    </Badge>
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    <Badge
                                      className={`${
                                        statusColors[
                                          visit.status as keyof typeof statusColors
                                        ] || "bg-gray-100 text-gray-800"
                                      } px-2 py-1 text-xs`}
                                    >
                                      {visit.status}
                                    </Badge>
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                      visit.visit_date
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </td>
                                  <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-600">
                                    {visit.complaint}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {groupedVisits[summary.month]?.length === 0 && (
                        <div className="mt-4 rounded-lg bg-gray-50 py-8 text-center">
                          <ClipboardList className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                          <h3 className="mb-1 text-lg font-medium text-gray-900">
                            No visits recorded
                          </h3>
                          <p className="mx-auto max-w-md text-gray-600">
                            No patient visits were documented for this month.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="py-12 text-center">
                <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No visit reports available
                </h3>
                <p className="mx-auto max-w-md text-gray-600">
                  Your visit reports will appear here once data becomes
                  available.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "blue" | "green" | "purple" | "yellow";
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <Card className="border-0 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Metric Card Component
const MetricCard = ({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description?: string;
}) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
    <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
    <p className="mb-1 text-xl font-bold text-gray-900">{value}</p>
    {description && <p className="text-xs text-gray-500">{description}</p>}
  </div>
);

// Utility functions
const calculateAverageWaitTime = (visits: Visit[]): number => {
  const validVisits = visits.filter(
    (v) => v.treatment_created_at && v.visit_created_at
  );
  if (validVisits.length === 0) return 0;

  const totalMinutes = validVisits.reduce((sum, visit) => {
    const start = new Date(visit.visit_created_at).getTime();
    const end = new Date(visit.treatment_created_at!).getTime();
    const diffMinutes = Math.max((end - start) / 60000, 0);
    return sum + diffMinutes;
  }, 0);

  return Math.round(totalMinutes / validVisits.length);
};

const calculatePriorityDistribution = (
  visits: Visit[]
): Record<PriorityLevel, number> => {
  return visits.reduce((acc, visit) => {
    const level = visit.priority_level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<PriorityLevel, number>);
};

const calculateStatusBreakdown = (
  visits: Visit[]
): Record<VisitStatus, number> => {
  return visits.reduce((acc, visit) => {
    const status = visit.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<VisitStatus, number>);
};
