'use client'
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, User, Upload } from "lucide-react";

interface LabResult {
  id: string;
  requested_by: string;
  uploaded_at: string;
  submitted_by: string;
}

const LabResultsPage = () => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly");

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        if (typeof window === 'undefined') {
          setError("Cannot access authentication token");
          return;
        }

        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Please sign in to view lab results");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/lab-results/monthly-details/`, {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
          } 
        });
        
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

  // Calculate date ranges
  const { currentPeriodResults, recentResults, periodLabel } = useMemo(() => {
    const now = new Date();
    
    // Weekly view calculations
    if (viewMode === "weekly") {
      // Start of week (Monday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
      startOfWeek.setHours(0, 0, 0, 0);
      
      // End of week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const currentResults = labResults.filter(result => {
        const uploadedDate = new Date(result.uploaded_at);
        return uploadedDate >= startOfWeek && uploadedDate <= endOfWeek;
      });
      
      return {
        currentPeriodResults: currentResults,
        recentResults: labResults.filter(result => {
          const uploadedDate = new Date(result.uploaded_at);
          return uploadedDate >= new Date(now.setDate(now.getDate() - 7));
        }),
        periodLabel: `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      };
    } 
    // Monthly view calculations
    else {
      // First day of month
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Last day of month
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      lastDayOfMonth.setHours(23, 59, 59, 999);
      
      const currentResults = labResults.filter(result => {
        const uploadedDate = new Date(result.uploaded_at);
        return uploadedDate >= firstDayOfMonth && uploadedDate <= lastDayOfMonth;
      });
      
      return {
        currentPeriodResults: currentResults,
        recentResults: labResults.filter(result => {
          const uploadedDate = new Date(result.uploaded_at);
          return uploadedDate >= new Date(now.setDate(now.getDate() - 7));
        }),
        periodLabel: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    }
  }, [labResults, viewMode]);

  // Group results by month for monthly view
  const groupedResults = useMemo(() => {
    if (viewMode !== "monthly") return [];
    
    const groups: Record<string, LabResult[]> = {};
    
    // Create a copy and sort by date descending (most recent first)
    const sortedResults = [...labResults].sort((a, b) => 
      new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    );
    
    sortedResults.forEach(result => {
      const date = new Date(result.uploaded_at);
      const monthKey = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      
      groups[monthKey].push(result);
    });
    
    // Sort groups by month (most recent first)
    return Object.entries(groups)
      .sort(([aKey], [bKey]) => 
        new Date(bKey).getTime() - new Date(aKey).getTime()
      )
      .map(([month, results]) => ({ month, results }));
  }, [labResults, viewMode]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-4">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading lab results: {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lab Results</h1>
              <p className="text-gray-600 mt-1">
                {viewMode === "monthly" 
                  ? `Viewing results for ${periodLabel}`
                  : `Viewing recent results from the last 7 days`}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Results</p>
                  <p className="text-2xl font-bold text-gray-900">{labResults.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {viewMode === "monthly" ? "This Month" : "This Week"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{currentPeriodResults.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {periodLabel}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                  <p className="text-2xl font-bold text-gray-900">{recentResults.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Since {new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {viewMode === "monthly" 
                    ? "All Lab Results" 
                    : "Recent Lab Results (Last 7 Days)"}
                </h2>
                <div className="text-sm text-gray-500">
                  {viewMode === "monthly" 
                    ? `Showing ${labResults.length} results` 
                    : `Showing ${recentResults.length} recent results`}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {viewMode === "monthly" ? (
                    groupedResults.length > 0 ? (
                      groupedResults.map((group) => (
                        <React.Fragment key={group.month}>
                          {/* Month header */}
                          <tr className="bg-gray-100">
                            <td colSpan={5} className="px-6 py-3 font-semibold text-gray-900">
                              {group.month}
                            </td>
                          </tr>
                          
                          {/* Results for this month */}
                          {group.results.map((result) => (
                            <ResultRow 
                              key={result.id} 
                              result={result} 
                              isCurrentPeriod={currentPeriodResults.some(r => r.id === result.id)}
                              viewMode={viewMode}
                            />
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <NoResults viewMode={viewMode} />
                        </td>
                      </tr>
                    )
                  ) : recentResults.length > 0 ? (
                    recentResults
                      .sort((a, b) => 
                        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
                      )
                      .map((result) => (
                        <ResultRow 
                          key={result.id} 
                          result={result} 
                          isCurrentPeriod={currentPeriodResults.some(r => r.id === result.id)}
                          viewMode={viewMode}
                        />
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <NoResults viewMode={viewMode} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

// Result row component
const ResultRow = ({ 
  result, 
  isCurrentPeriod,
  viewMode
}: { 
  result: LabResult;
  isCurrentPeriod: boolean;
  viewMode: "weekly" | "monthly";
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uploadedDate = new Date(result.uploaded_at);
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const isRecent = uploadedDate >= sevenDaysAgo;
  
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {result.id.slice(0, 8)}...
          </Badge>
          {isRecent && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              New
            </Badge>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{result.requested_by}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{result.submitted_by}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={`text-sm ${isCurrentPeriod ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
            {formatDate(result.uploaded_at)}
          </span>
          {isCurrentPeriod && viewMode === "monthly" && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              This Month
            </Badge>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Completed
        </Badge>
      </td>
    </tr>
  );
};

// No results component
const NoResults = ({ viewMode }: { viewMode: "weekly" | "monthly" }) => (
  <div className="flex flex-col items-center justify-center">
    <FileText className="h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {viewMode === "monthly" 
        ? "No lab results found for this month" 
        : "No recent lab results found"}
    </h3>
    <p className="text-gray-600 max-w-md">
      Your lab results will appear here once they become available.
    </p>
  </div>
);

export default LabResultsPage;