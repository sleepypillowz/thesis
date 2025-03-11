"use client";
import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Upload, 
  Calendar, 
  User,
  Tag,
  Check,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
}

interface LabResult {
  id: string;
  image: string;
  uploaded_at: string;
  submitted_by?: User;
}

interface LabRequest {
  id: string;
  patient_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  test_name: string;
  custom_test: string | null;
  status: string;
  created_at: string;
  requested_by?: User;
  result?: LabResult;
}

const LabRequestsPage = () => {
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Fetch lab requests from API
    const fetchLabRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("No access token found. Please log in again.");
          setIsLoading(false);
          return;
        }
        const response = await fetch("http://127.0.0.1:8000/patient/lab-request/list/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LabRequest[] = await response.json();
        setLabRequests(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Failed to load laboratory requests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabRequests();
  }, []);

  const handleFileUpload = async (e: React.FormEvent, labRequestId: string) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadingId(labRequestId);
    const formData = new FormData();
    formData.append('lab_request', labRequestId);
    formData.append('image', selectedFile);

    try {
      const token = localStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/patient/lab-result/", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          // Let the browser set the Content-Type header
        },
        body: formData,
      });

      if (response.ok) {
        // Update UI state (e.g., mark the lab request as completed)
        setLabRequests(prev =>
          prev.map(request =>
            request.id === labRequestId ? { ...request, status: 'Completed' } : request
          )
        );
        setSelectedFile(null);
      } else {
        console.error('Upload failed with status', response.status);
        setError('Failed to upload lab results. Please try again.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload lab results. Please check your connection.');
    } finally {
      setUploadingId(null);
    }
  };

  const filteredRequests = filter === 'all' 
    ? labRequests 
    : labRequests.filter(request => request.status === filter);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFullName = (user?: User) => {
    if (!user) return 'N/A';
    return [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(' ') || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ClipboardList className="mr-3 text-blue-600" />
              Laboratory Requests
            </h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="mr-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          </div>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800 shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-800 shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Clock className="inline w-4 h-4 mr-1" />
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-100 text-green-800 shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Check className="inline w-4 h-4 mr-1" />
            Completed
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading laboratory requests...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!isLoading && labRequests.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No laboratory requests</h3>
            <p className="mt-2 text-gray-500">There are no laboratory requests available at the moment.</p>
          </div>
        )}

        {!isLoading && filteredRequests.length === 0 && labRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No matching requests</h3>
            <p className="mt-2 text-gray-500">No laboratory requests match your current filter.</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow"
            >
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 rounded-full p-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {`${request.first_name || ''} ${request.middle_name || ''} ${request.last_name || ''}`}
                        </h2>
                        <div className="flex items-center mt-1 text-gray-700">
                          <Tag className="h-4 w-4 mr-1" />
                          <p>{request.test_name || request.custom_test}</p>
                        </div>
                        <div className="flex flex-wrap items-center mt-3 gap-3">
                          <span
                            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {request.status === 'pending' ? (
                              <Clock className="mr-1 h-4 w-4" />
                            ) : (
                              <Check className="mr-1 h-4 w-4" />
                            )}
                            {request.status}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatDate(request.created_at)}
                          </span>
                          {request.requested_by && (
                            <span className="flex items-center text-sm text-gray-500">
                              <User className="mr-1 h-4 w-4" />
                              Req. by: {getFullName(request.requested_by)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequestId(selectedRequestId === request.id ? null : request.id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    {selectedRequestId === request.id ? (
                      <>Hide Details <ChevronUp className="ml-1 h-4 w-4" /></>
                    ) : (
                      <>View Details <ChevronDown className="ml-1 h-4 w-4" /></>
                    )}
                  </button>
                </div>

                {selectedRequestId === request.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Request Details</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Patient ID</dt>
                            <dd className="mt-1 text-sm text-gray-900">{request.patient_id || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Requested By</dt>
                            <dd className="mt-1 text-sm text-gray-900">{getFullName(request.requested_by)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Test Type</dt>
                            <dd className="mt-1 text-sm text-gray-900">{request.test_name || request.custom_test || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Request Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(request.created_at)}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      {request.status !== 'completed' ? (
                        <form 
                          onSubmit={(e) => handleFileUpload(e, request.id)}
                          className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                        >
                          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            <Upload className="mr-2 h-4 w-4 text-blue-600" />
                            Upload Lab Results
                          </h3>
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                              <input
                                type="file"
                                id={`file-upload-${request.id}`}
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="hidden"
                                accept=".pdf,.jpg,.png"
                                required
                              />
                              <label
                                htmlFor={`file-upload-${request.id}`}
                                className="cursor-pointer"
                              >
                                {selectedFile ? (
                                  <div className="text-sm text-gray-900">
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="mt-1 text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-sm text-gray-500">Drag & drop a file here, or <span className="text-blue-600 font-medium">browse</span></p>
                                <p className="mt-1 text-xs text-gray-400">Supported formats: JPG, PNG, PDF</p>
                              </div>
                            )}
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!selectedFile || uploadingId === request.id}
                        >
                          {uploadingId === request.id ? "Uploading..." : "Upload Result"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h3 className="text-sm font-medium text-green-900 mb-3 flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Lab Result Uploaded
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-900">Uploaded by: {getFullName(request.result?.submitted_by)}</p>
                        {request.result?.image && (
                          <a 
                            href={request.result.image} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 text-sm font-medium hover:underline"
                          >
                            View Result
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
); };
export default LabRequestsPage;