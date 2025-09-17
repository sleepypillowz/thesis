"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, User, Upload, Download, ChevronDown } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

interface LabResult {
  id: string;
  requested_by: string;
  uploaded_at: string;
  submitted_by: string;
}

// PDF Document Component for Lab Results
const LabResultsPDFDocument: React.FC<{ labResults: LabResult[], periodLabel: string }> = ({ labResults, periodLabel }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
      fontSize: 10,
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
      borderBottomWidth: 2,
      borderBottomColor: '#3B82F6',
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 5,
    },
    generatedDate: {
      fontSize: 10,
      color: '#9CA3AF',
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      backgroundColor: '#F8FAFC',
      padding: 15,
      borderRadius: 5,
    },
    summaryBox: {
      alignItems: 'center',
    },
    summaryNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#3B82F6',
    },
    summaryLabel: {
      fontSize: 9,
      color: '#6B7280',
      marginTop: 2,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#3B82F6',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 9,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#E5E7EB',
      minHeight: 25,
      alignItems: 'center',
    },
    evenRow: {
      backgroundColor: '#F9FAFB',
    },
    oddRow: {
      backgroundColor: '#ffffff',
    },
    tableCell: {
      padding: 4,
      fontSize: 8,
      color: '#374151',
    },
    idCol: { width: '20%' },
    requestedCol: { width: '25%' },
    submittedCol: { width: '25%' },
    dateCol: { width: '20%' },
    statusCol: { width: '10%', textAlign: 'center' },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      paddingTop: 10,
    },
    footerText: {
      fontSize: 8,
      color: '#6B7280',
    },
    footerPage: {
      fontSize: 8,
      color: '#6B7280',
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lab Results Report</Text>
          <Text style={styles.subtitle}>{periodLabel}</Text>
          <Text style={styles.generatedDate}>
            Generated on: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{labResults.length}</Text>
            <Text style={styles.summaryLabel}>Total Results</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>
              {labResults.filter(result => {
                const resultDate = new Date(result.uploaded_at);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return resultDate >= sevenDaysAgo;
              }).length}
            </Text>
            <Text style={styles.summaryLabel}>Recent (7 days)</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.idCol]}>Result ID</Text>
          <Text style={[styles.tableCell, styles.requestedCol]}>Requested By</Text>
          <Text style={[styles.tableCell, styles.submittedCol]}>Submitted By</Text>
          <Text style={[styles.tableCell, styles.dateCol]}>Upload Date</Text>
          <Text style={[styles.tableCell, styles.statusCol]}>Status</Text>
        </View>

        {/* Table Body */}
        {labResults.map((result, index) => (
          <View key={result.id} style={[
            styles.tableRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          ]}>
            <Text style={[styles.tableCell, styles.idCol]}>
              {result.id}
            </Text>
            <Text style={[styles.tableCell, styles.requestedCol]}>
              {result.requested_by}
            </Text>
            <Text style={[styles.tableCell, styles.submittedCol]}>
              {result.submitted_by}
            </Text>
            <Text style={[styles.tableCell, styles.dateCol]}>
              {formatDate(result.uploaded_at)}
            </Text>
            <Text style={[styles.tableCell, styles.statusCol]}>
              Completed
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Report generated from Healthcare Lab Results System
          </Text>
          <Text style={styles.footerPage}>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Export Component
const LabResultsPDFExport: React.FC<{ labResults: LabResult[], periodLabel: string }> = ({ labResults, periodLabel }) => {
  const fileName = `lab-results-${periodLabel.toLowerCase().replace(/\s+/g, '-')}.pdf`;

  return (
    <PDFDownloadLink
      document={<LabResultsPDFDocument labResults={labResults} periodLabel={periodLabel} />}
      fileName={fileName}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
    >
      {({ loading }) => (
        <>
          <Download className="w-4 h-4" />
          {loading ? 'Generating PDF...' : 'Export Lab Results'}
        </>
      )}
    </PDFDownloadLink>
  );
};

const LabResultsPage = () => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly");
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        if (typeof window === "undefined") {
          setError("Cannot access authentication token");
          return;
        }

        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Please sign in to view lab results");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/lab-results/monthly-details/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch lab results: ${response.status}`);
        }

        const data = await response.json();
        setLabResults(data.lab_results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLabResults();
  }, []);

  // Group results by month for monthly view
  const groupedResults = useMemo(() => {
    const groups: Record<string, LabResult[]> = {};

    // Create a copy and sort by date descending (most recent first)
    const sortedResults = [...labResults].sort(
      (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    );

    sortedResults.forEach((result) => {
      const date = new Date(result.uploaded_at);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }

      groups[monthKey].push(result);
    });

    // Sort groups by month (most recent first)
    return Object.entries(groups)
      .sort(([aKey], [bKey]) => new Date(bKey).getTime() - new Date(aKey).getTime())
      .map(([month, results]) => ({ month, results }));
  }, [labResults]);

  // Automatically open the latest month (first groupedResults item) once groupedResults is available
  useEffect(() => {
    if (groupedResults.length > 0) {
      setExpandedMonths({ [groupedResults[0].month]: true });
    }
  }, [groupedResults]);

  // Compute currentPeriodResults and periodLabel (used by stats card)
  const { currentPeriodResults, periodLabel } = useMemo(() => {
    const now = new Date();

    if (viewMode === "weekly") {
      // Start on Monday
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day; // Sunday -> previous Monday
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const current = labResults.filter((r) => {
        const d = new Date(r.uploaded_at);
        return d >= startOfWeek && d <= endOfWeek;
      });

      const startLabel = startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const endLabel = endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      return {
        currentPeriodResults: current,
        periodLabel: `Week of ${startLabel} - ${endLabel}`,
      };
    } else {
      // monthly
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);

      const current = labResults.filter((r) => {
        const d = new Date(r.uploaded_at);
        return d >= firstDay && d <= lastDay;
      });

      const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      return {
        currentPeriodResults: current,
        periodLabel: monthLabel,
      };
    }
  }, [labResults, viewMode]);

  // Accordion behavior: open clicked month exclusively; close if already open
  const toggleMonthExpansion = (month: string) => {
    setExpandedMonths(prev => {
      if (prev[month]) {
        // if already open, close it
        return {};
      }
      // open only this month
      return { [month]: true };
    });
  };

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-900">
                    Error Loading Lab Results
                  </h3>
                  <p className="mt-1 text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 flex items-center space-x-3 md:mb-0">
            <div className="rounded-lg bg-blue-600 p-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lab Results</h1>
              <p className="mt-1 text-gray-600">
                Comprehensive analysis of laboratory test results and diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode("monthly")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setViewMode("weekly")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  viewMode === "weekly"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Results
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {labResults.length}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {viewMode === "monthly" ? "This Month" : "This Week"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentPeriodResults.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{periodLabel}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recent (7 days)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {labResults.filter(result => {
                      const resultDate = new Date(result.uploaded_at);
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                      return resultDate >= sevenDaysAgo;
                    }).length}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Since{" "}
                    {new Date(
                      new Date().setDate(new Date().getDate() - 7)
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Reports Accordion */}
        <div className="space-y-4">
          {groupedResults.length > 0 ? groupedResults.map((group) => {
            const isExpanded = !!expandedMonths[group.month];

            return (
              <Card key={group.month} className="border-0 bg-white shadow-sm overflow-hidden transition-all duration-300">
                <button
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-t"
                  onClick={() => toggleMonthExpansion(group.month)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {group.month}
                      </h2>
                      <Badge className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        {group.results.length} {group.results.length === 1 ? "Result" : "Results"}
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
                      <LabResultsPDFExport
                        labResults={group.results}
                        periodLabel={group.month}
                      />
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Result ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Requested By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Submitted By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Upload Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {group.results.map((result) => (
                            <ResultRow
                              key={result.id}
                              result={result}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>
            );
          }) : (
            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No lab results available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your lab results will appear here once they become available.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
};

// Result row component
const ResultRow = ({ result }: { result: LabResult }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const uploadedDate = new Date(result.uploaded_at);
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const isRecent = uploadedDate >= sevenDaysAgo;

  return (
    <tr className="transition-colors duration-150 hover:bg-gray-50">
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700"
          >
            {result.id.slice(0, 8)}...
          </Badge>
          {isRecent && (
            <Badge className="bg-yellow-100 text-xs text-yellow-800">New</Badge>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            {result.requested_by}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{result.submitted_by}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {formatDate(result.uploaded_at)}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Completed
        </Badge>
      </td>
    </tr>
  );
};

export default LabResultsPage;
