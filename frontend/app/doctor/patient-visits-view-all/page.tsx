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
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import QueuePDFExport from "@/components/pdf/QueuePDFExport";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = typeof window !== "undefined" ? localStorage.getItem("access") : null;
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
        const sortedMonths = months.sort((a, b) =>
          new Date(b).getTime() - new Date(a).getTime()
        );

        // Create sorted data object
        const sortedData: GroupedVisitsResponse = {};
        sortedMonths.forEach(month => {
          sortedData[month] = response.data[month] ?? [];
        });

        setGroupedVisits(sortedData);

        // Create summaries in sorted order
        const summaries = sortedMonths.map(month => {
          const visits = response.data[month] ?? [];
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
      } catch {
        setError("Failed to load visit data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMonthExpansion = (month: string) => {
    setExpandedMonths(prev => ({
      ...(prev ?? {}),
      [month]: !(prev?.[month])
    }));
  };

  // Function to convert visits to queue data for PDF export
  const getQueueDataForMonth = (month: string): QueueData => {
    const visits = groupedVisits?.[month] ?? [];
    const [yearStr, monthStr] = month.split('-');
    const year = Number(yearStr) || 0;
    const monthNum = Number(monthStr) || 0;

    const entries: QueueEntry[] = visits.map(visit => ({
      patient_id: visit.id?.toString() ?? "",
      patient_name: visit.patient_name ?? "",
      queue_number: visit.queue_number ?? null,
      priority_level: visit.priority_level ?? "",
      complaint: visit.complaint ?? "",
      status: visit.status ?? "",
      created_at: visit.visit_created_at ?? "",
      queue_date: visit.visit_date ?? "",
    }));

    return {
      month: monthNum,
      year,
      entries,
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <CardContent className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between items-center">
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
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
  const totalMonths = monthSummaries?.length ?? 0;
  const totalVisits = monthSummaries?.reduce((sum, m) => sum + (m.totalVisits ?? 0), 0) ?? 0;
  const avgVisits = totalMonths ? (totalVisits / totalMonths).toFixed(2) : "0.00";
  const highPriority = monthSummaries?.reduce(
    (sum, m) => sum + (m.priorityDistribution?.["Priority"] ?? 0),
    0
  ) ?? 0;

  const totalCompleted = monthSummaries?.reduce(
    (sum, m) => sum + (m.statusBreakdown?.["Completed"] ?? 0),
    0
  ) ?? 0;
  const completionRate = totalVisits
    ? `${((totalCompleted / totalVisits) * 100).toFixed(2)}%`
    : "0.00%";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Monthly Visit Reports
              </h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                Comprehensive analysis of patient visits and service metrics across all departments
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          {(monthSummaries && monthSummaries.length > 0) ? monthSummaries.map((summary) => {
            const isExpanded = expandedMonths?.[summary.month] ?? false;
            const monthName = summary.month
              ? new Date(summary.month + "-01").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "";

            return (
              <Card
                key={summary.month}
                className="border-0 shadow-sm bg-white overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-t"
                  onClick={() => toggleMonthExpansion(summary.month)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {monthName}
                      </h2>
                      <Badge className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        {summary.totalVisits} {summary.totalVisits === 1 ? "Visit" : "Visits"}
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
                  <div className="p-6 border-t border-gray-100 animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Monthly Details</h3>
                      <QueuePDFExport
                        queueData={getQueueDataForMonth(summary.month)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                      />
                    </div>

                    {/* Month Summary Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <MetricCard
                        label="Avg Wait Time"
                        value={`${((summary.avgQueuePosition ?? 0) / 60).toFixed(2)} hrs`}
                        description="From registration to treatment"
                      />
                      <MetricCard
                        label="Priority Lane"
                        value={summary.priorityDistribution?.["Priority"] ?? 0}
                        description="PWD/ Pregnant/ Seniors"
                      />
                      <MetricCard
                        label="Completed"
                        value={summary.statusBreakdown?.["Completed"] ?? 0}
                        description="Successful treatments"
                      />
                      <MetricCard
                        label="Pending"
                        value={summary.statusBreakdown?.["Waiting"] ?? 0}
                        description="Requiring follow-up"
                      />
                    </div>

                    {/* Visit Details Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Visit Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Complaint
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(groupedVisits?.[summary.month] ?? []).map((visit) => {
                              const priorityColors: Record<PriorityLevel, string> = {
                                Priority: "bg-green-100 text-green-800",
                                Regular: "bg-yellow-100 text-yellow-800",
                                Emergency: "bg-red-100 text-red-800",
                              };

                            const statusColors: Record<string, string> = {
                              Completed: "bg-green-100 text-green-800",
                              Waiting: "bg-yellow-100 text-yellow-800",
                              "Queued for Treatment": "bg-blue-100 text-blue-800",
                              "Queued for Assessment": "bg-blue-100 text-blue-800",
                            };

                            return (
                              <tr
                                key={visit.id ?? Math.random()}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-gray-900">
                                    {visit.patient_name ?? ""}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={`${priorityColors[visit.priority_level as PriorityLevel] ?? "bg-gray-100 text-gray-800"} px-2 py-1 text-xs`}>
                                    {visit.priority_level ?? ""}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={`${statusColors[visit.status] ?? "bg-gray-100 text-gray-800"} px-2 py-1 text-xs`}>
                                    {visit.status ?? ""}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {visit.visit_date
                                    ? new Date(visit.visit_date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                      })
                                    : ""}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                  {visit.complaint ?? ""}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {(groupedVisits?.[summary.month]?.length ?? 0) === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
                        <ClipboardList className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No visits recorded
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          No patient visits were documented for this month.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          }) : (
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="py-12 text-center">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No visit reports available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your visit reports will appear here once data becomes available.
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
  color = "blue"
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
    <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
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
  description
}: {
  label: string;
  value: string | number;
  description?: string;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
    <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
    {description && <p className="text-xs text-gray-500">{description}</p>}
  </div>
);

// Utility functions
const calculateAverageWaitTime = (visits: Visit[]): number => {
  const validVisits = visits.filter((v) => !!v.treatment_created_at && !!v.visit_created_at);
  if (validVisits.length === 0) return 0;

  const totalMinutes = validVisits.reduce((sum, visit) => {
    const start = visit.visit_created_at ? new Date(visit.visit_created_at).getTime() : 0;
    const end = visit.treatment_created_at ? new Date(visit.treatment_created_at).getTime() : 0;
    const diffMinutes = Math.max((end - start) / 60000, 0);
    return sum + diffMinutes;
  }, 0);

  return validVisits.length > 0 ? Math.round(totalMinutes / validVisits.length) : 0;
};

const calculatePriorityDistribution = (visits: Visit[]): Record<PriorityLevel, number> => {
  return visits.reduce((acc, visit) => {
    const level = visit.priority_level ?? "Regular";
    acc[level] = (acc[level] ?? 0) + 1;
    return acc;
  }, {} as Record<PriorityLevel, number>);
};

const calculateStatusBreakdown = (visits: Visit[]): Record<VisitStatus, number> => {
  return visits.reduce((acc, visit) => {
    const status = visit.status ?? "";
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {} as Record<VisitStatus, number>);
};