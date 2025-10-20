import React, { useState } from 'react';
import { X, User, Clock, AlertCircle, Activity, TestTube, Stethoscope } from 'lucide-react';

// Updated interface to match what's actually being passed
interface Patient {
  id: number;
  patient_id: string | null;
  patient_name: string;
  queue_number: number;
  priority_level: string;
  complaint: string;
  status: string;
  created_at: string;
  queue_date: string;
}

interface RoutingOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface PatientRoutingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onRoutePatient: (patient: Patient | null, destination: string) => void; // ← FIXED
  className?: string;
}

const PatientRoutingModal: React.FC<PatientRoutingModalProps> = ({
  isOpen,
  onClose,
  patient,
  onRoutePatient,
  className = ""
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const routingOptions: RoutingOption[] = [
    {
      id: 'preliminary',
      label: 'Preliminary Assessment',
      description: 'Initial evaluation and vital signs check',
      icon: <Stethoscope className="w-6 h-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'treatment',
      label: 'Treatment',
      description: 'Direct to treatment room for immediate care',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'lab',
      label: 'Lab Test',
      description: 'Laboratory testing and diagnostic procedures',
      icon: <TestTube className="w-6 h-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
    }
  ];

  const handleSubmit = async () => {
    console.log("🔍 Modal handleSubmit called");
    console.log("🔍 Patient:", patient);
    console.log("🔍 Selected route:", selectedRoute);
    
    if (!selectedRoute || !patient) {
      console.error("❌ Missing patient or route");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onRoutePatient(patient, selectedRoute); // ← FIXED: pass entire patient object
      onClose();
      setSelectedRoute('');
    } catch (error) {
      console.error('Error routing patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'Priority' 
      ? 'text-red-600 bg-red-50 border-red-200' 
      : 'text-blue-600 bg-blue-50 border-blue-200';
  };

  if (!isOpen || !patient) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-gray-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Where would this patient go?
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Select the appropriate next step for patient care
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Patient Information */}
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{patient.patient_name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority_level)}`}>
                      {patient.priority_level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
                  <p className="text-sm text-gray-600">Queue #{patient.queue_number || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Complaint:</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{patient.complaint}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">
                      Checked in: {formatTime(patient.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Routing Options */}
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Select destination:</h4>
              <div className="space-y-3">
                {routingOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRoute === option.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRoute(option.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg text-white ${option.color.split(' ')[0]}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-semibold text-gray-900">{option.label}</h5>
                          {/* {option.estimatedTime && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Est. {option.estimatedTime}
                            </span>
                          )} */}
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedRoute === option.id
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedRoute === option.id && (
                            <div className="w-full h-full bg-white rounded-full scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedRoute && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Patient will be routed to {routingOptions.find(opt => opt.id === selectedRoute)?.label}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedRoute || isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Routing...
                    </>
                  ) : (
                    'Route Patient'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientRoutingModal;