"use client";
import React, { useState, useEffect } from 'react';

import { ChevronDown, Calendar, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Appointment {
  id: number | string;
  appointment_date: string;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  doctor_name: string;
  patient_name: string;
}

interface QueueTableToggleProps {
  data?: Appointment[];
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  onAppointmentClick?: (appointment: Appointment) => void;
  onViewAllClick?: () => void;
  onAcceptAppointment?: (appointmentId: number | string) => void;
  onCancelAppointment?: (appointmentId: number | string) => void;
  onRequeueAppointment?: (appointmentId: number | string) => void;
}

const QueueTableToggle: React.FC<QueueTableToggleProps> = ({
  data,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  onAppointmentClick,
  onViewAllClick,
  onAcceptAppointment,
  onCancelAppointment,
  onRequeueAppointment
}) => {
const [isOpen, setIsOpen] = useState<boolean>(false);
const [appointments, setAppointments] = useState<Appointment[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);


  // Helper: Check if date is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/appointment/upcoming-appointments/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch appointments');

      const appointmentsData = await response.json();
      if (Array.isArray(appointmentsData)) {
        setAppointments(appointmentsData);
      } else if (appointmentsData.results && Array.isArray(appointmentsData.results)) {
        setAppointments(appointmentsData.results);
      } else {
        setAppointments([]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) fetchAppointments();
  }, [data]);

  // Accept appointment
  const handleAccept = async (appointmentId: number | string) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/appointment/${appointmentId}/accept/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept appointment');
      }

      const result = await response.json();
      onAcceptAppointment?.(appointmentId);
      if (!data) fetchAppointments();
      alert(`Appointment accepted.`);
    } catch (err) {
      console.error('Error accepting appointment:', err);
      alert(err instanceof Error ? err.message : 'Failed to accept appointment');
    }
  };

  // Helpers
  const formatDate = (dateString: string | number | Date) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatTime = (dateString: string | number | Date) =>
    new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in progress': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailableActions = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return ['accept', 'cancel', 'requeue'];
      case 'confirmed': return ['cancel', 'requeue'];
      case 'in progress': return ['cancel'];
      default: return [];
    }
  };

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>, action: string, appointmentId: number | string) => {
    e.stopPropagation();
    switch (action) {
      case 'accept': handleAccept(appointmentId); break;
      case 'cancel': onCancelAppointment?.(appointmentId); alert('Cancel functionality not yet implemented'); break;
      case 'requeue': onRequeueAppointment?.(appointmentId); alert('Requeue functionality not yet implemented'); break;
    }
  };

  // Filter appointments for today
  const todayAppointments: Appointment[] = (data ?? appointments ?? []).filter(app => app && isToday(app.appointment_date));
  const displayData: Appointment[] = todayAppointments.length > 0 ? todayAppointments : [];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center justify-between w-96 px-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${buttonClassName}`}
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Today's Appointments</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {displayData.length}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 w-96 mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden ${dropdownClassName}`}>
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
            <p className="text-sm text-gray-600 mt-1">{displayData.length} appointments scheduled</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 font-medium mt-3">Loading appointments...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Error loading appointments</p>
                <p className="text-sm text-gray-400 mt-1">{error}</p>
                <button 
                  type="button"
                  onClick={fetchAppointments}
                  className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : displayData.length > 0 ? (
              displayData.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => onAppointmentClick?.(appointment)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{appointment.patient_name}</p>
                            <p className="text-xs text-gray-600">with Dr. {appointment.doctor_name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">{formatTime(appointment.appointment_date)}</span>
                            <span className="mx-1">•</span>
                            <span>{formatDate(appointment.appointment_date)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                          {getAvailableActions(appointment.status).map((action) => (
                            <button
                              key={action}
                              type="button"
                              onClick={(e) => handleActionClick(e, action, appointment.id)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 ${
                                action === 'accept'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : action === 'cancel'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              {action.charAt(0).toUpperCase() + action.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No appointments scheduled</p>
                <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
              </div>
            )}
          </div>

          {displayData.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <button 
                type="button"
                onClick={() => onViewAllClick?.()}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-1 hover:bg-blue-50 rounded transition-colors duration-150"
              >
                View All Appointments
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueueTableToggle;
