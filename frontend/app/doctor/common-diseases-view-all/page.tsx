'use client'
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Stethoscope, User, Calendar, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Diagnosis {
  diagnosis_code: string;
  diagnosis_description: string;
  diagnosis_date: string;
}

interface Treatment {
  patient_name: string;
  doctor_name: string;
  diagnoses: Diagnosis[];
  created_at: string;
  updated_at: string;
}

interface DiseaseOccurrence {
  patient_name: string;
  doctor_name: string;
  diagnosis_date: string;
  treatment_created: string;
  treatment_updated: string;
}

interface CommonDisease {
  diagnosis_code: string;
  diagnosis_description: string;
  normalized_description: string;
  occurrences: DiseaseOccurrence[];
}

const Report = () => {
  const [commonDiseases, setCommonDiseases] = useState<CommonDisease[]>([]);
  const [expandedDiseases, setExpandedDiseases] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/patient/reports/common-diseases/monthly-details/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch common diseases: ${response.status}`
        );
      }

      const data: { treatments: Treatment[] } = await response.json();

      const diseaseMap: Record<string, CommonDisease> = {};

      data.treatments.forEach((treatment) => {
        treatment.diagnoses.forEach((diag) => {
          const normalizedDesc = diag.diagnosis_description
            .toLowerCase()
            .trim();

          if (!diseaseMap[normalizedDesc]) {
            diseaseMap[normalizedDesc] = {
              diagnosis_code: diag.diagnosis_code,
              diagnosis_description: diag.diagnosis_description,
              normalized_description: normalizedDesc,
              occurrences: [],
            };
          }

          const existing = diseaseMap[normalizedDesc];
          if (
            diag.diagnosis_description.length >
              existing.diagnosis_description.length ||
            (diag.diagnosis_description === normalizedDesc &&
              existing.diagnosis_description !== normalizedDesc)
          ) {
            existing.diagnosis_description = diag.diagnosis_description;
          }

          diseaseMap[normalizedDesc].occurrences.push({
            patient_name: treatment.patient_name,
            doctor_name: treatment.doctor_name,
            diagnosis_date: diag.diagnosis_date,
            treatment_created: treatment.created_at,
            treatment_updated: treatment.updated_at,
          });
        });
      });

      const diseasesArray = Object.values(diseaseMap)
        .map((disease) => ({
          ...disease,
          occurrenceCount: disease.occurrences.length,
        }))
        .sort((a, b) => b.occurrenceCount - a.occurrenceCount);

      setCommonDiseases(diseasesArray);

      if (diseasesArray.length > 0) {
        setExpandedDiseases({
          [diseasesArray[0].normalized_description]: true,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  const toggleDiseaseExpansion = (diseaseKey: string) => {
    setExpandedDiseases(prev => ({
      ...prev,
      [diseaseKey]: !prev?.[diseaseKey]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Calculate stats
  const totalDiseases = commonDiseases?.length;
  const totalOccurrences = commonDiseases?.reduce((sum, disease) => sum + disease.occurrences.length, 0);
  const Patients = new Set(
    commonDiseases?.flatMap(disease => 
      disease.occurrences.map(o => o.patient_name)
  )).size;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <StatsCards 
          totalDiseases={totalDiseases ?? 0}
          totalOccurrences={totalOccurrences ?? 0}
          Patients={Patients ?? 0}
        />

        <DiseaseAnalysisTable 
          commonDiseases={commonDiseases ?? []}
          expandedDiseases={expandedDiseases ?? {}}
          toggleDiseaseExpansion={toggleDiseaseExpansion}
          formatDate={formatDate}
        />
      </div>
    </main>
  );
};

// Sub-components for better organization

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto p-6">
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
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="max-w-7xl mx-auto p-6">
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            Error loading common diseases: {error}
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

const Header = () => (
  <div className="flex items-center space-x-3 mb-8">
    <div className="p-2 bg-blue-600 rounded-lg">
      <ClipboardList className="h-6 w-6 text-white" />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Common Diseases Report</h1>
      <p className="text-gray-600 mt-1">Analysis of frequently diagnosed conditions across patients</p>
    </div>
  </div>
);

const StatsCards = ({ 
  totalDiseases, 
  totalOccurrences, 
  Patients 
}: { 
  totalDiseases: number;
  totalOccurrences: number;
  Patients: number;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Diseases</p>
            <p className="text-2xl font-bold text-gray-900">{totalDiseases}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Occurrences</p>
            <p className="text-2xl font-bold text-gray-900">{totalOccurrences}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Stethoscope className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Patients</p>
            <p className="text-2xl font-bold text-gray-900">{Patients}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <User className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const DiseaseAnalysisTable = ({ 
  commonDiseases, 
  expandedDiseases, 
  toggleDiseaseExpansion, 
  formatDate 
}: { 
  commonDiseases: CommonDisease[];
  expandedDiseases: Record<string, boolean>;
  toggleDiseaseExpansion: (diseaseKey: string) => void;
  formatDate: (date: string) => string;
}) => (
  <Card className="border-0 shadow-sm bg-white overflow-hidden">
    <CardContent className="p-0">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Disease Analysis</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disease
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occurrences
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commonDiseases.length > 0 ? commonDiseases.map((disease) => {
              const isExpanded = expandedDiseases[disease.normalized_description];
              const Patients = new Set(disease.occurrences.map(o => o.patient_name)).size;
              
              return (
                <React.Fragment key={disease.normalized_description}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleDiseaseExpansion(disease.normalized_description)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center">
                        <Stethoscope className="h-5 w-5 text-gray-400 mr-3" />
                        {disease.diagnosis_description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        {disease.diagnosis_code}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {disease.occurrences.length} occurrences<br/>
                      <span className="text-sm font-normal text-gray-600">
                        ({Patients} patient/s)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        {isExpanded ? 'Hide Details' : 'Show Details'}
                      </button>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Patient
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Doctor
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Diagnosis Date
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Treatment Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {disease.occurrences.map((occurrence, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 text-gray-400 mr-2" />
                                      <span className="text-sm font-medium">
                                        {occurrence.patient_name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center">
                                      <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
                                      <span className="text-sm">
                                        {occurrence.doctor_name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 border-b border-gray-200 text-sm">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                      {formatDate(occurrence.diagnosis_date)}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 border-b border-gray-200 text-sm">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                      {formatDate(occurrence.treatment_created)}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            }) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardList className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No disease data found</h3>
                    <p className="text-gray-600 max-w-md">
                      Disease reports will appear here once diagnoses are recorded.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export default Report;