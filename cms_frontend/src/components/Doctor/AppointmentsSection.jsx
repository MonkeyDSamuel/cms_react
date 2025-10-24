import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaSearch, FaFilter, FaPlus, FaSpinner, FaPlay } from 'react-icons/fa';
import { AppointmentsApi, ConsultationApi } from '../../service/DoctorApi';

const AppointmentsSection = ({ staffId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingConsultation, setStartingConsultation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load appointments from backend
  useEffect(() => {
    const loadAppointments = async () => {
      if (!staffId) return;
      
      setLoading(true);
      setError('');
      
      try {
        console.log('Loading appointments for staffId:', staffId);
        console.log('API Base URL: http://localhost:8000');
        console.log('Access token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
        
        const response = await AppointmentsApi.getAll();
        console.log('Appointments API response:', response);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        console.log('Response data type:', typeof response.data);
        console.log('Response data keys:', Object.keys(response.data || {}));
        
        // Handle Django REST Framework pagination structure
        let appointmentsData = [];
        if (response.data && Array.isArray(response.data.results)) {
          // Standard DRF pagination format
          appointmentsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          // Direct array response
          appointmentsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          // Custom data wrapper
          appointmentsData = response.data.data;
        } else if (response.data && response.data.appointments) {
          // Custom appointments wrapper
          appointmentsData = response.data.appointments;
        }
        
        console.log('Processed appointments data:', appointmentsData);
        
        // Debug: Log first appointment to see patient data structure
        if (Array.isArray(appointmentsData) && appointmentsData.length > 0) {
          console.log('First appointment data:', appointmentsData[0]);
          console.log('Patient fields in first appointment:', {
            patient_name: appointmentsData[0].patient_name,
            patient_id: appointmentsData[0].patient_id,
            patient_age: appointmentsData[0].patient_age,
            patient_gender: appointmentsData[0].patient_gender,
            patient_phone: appointmentsData[0].patient_phone
          });
        }
        
        // Ensure we have an array
        if (Array.isArray(appointmentsData)) {
          setAppointments(appointmentsData);
        } else {
          console.warn('Appointments data is not an array:', appointmentsData);
          setAppointments([]);
        }
      } catch (err) {
        console.error('Error loading appointments:', err);
        console.error('Error details:', err.response?.data || err.message);
        console.error('Error status:', err.response?.status);
        console.error('Error headers:', err.response?.headers);
        
        let errorMessage = 'Failed to load appointments';
        if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (err.response?.status === 403) {
          errorMessage = 'Access denied. You do not have permission to view appointments.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Appointments endpoint not found.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.code === 'NETWORK_ERROR' || !err.response) {
          errorMessage = 'Network error. Please check your connection and ensure the backend server is running.';
        } else {
          errorMessage = `Failed to load appointments: ${err.response?.data?.detail || err.message}`;
        }
        
        setError(errorMessage);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [staffId, refreshKey]);

  // Function to refresh appointments data
  const refreshAppointments = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Expose refresh function globally
  useEffect(() => {
    window.refreshAppointments = refreshAppointments;
  }, []);

  // Start consultation function
  const handleStartConsultation = async (appointmentId) => {
    setStartingConsultation(appointmentId);
    try {
      const response = await ConsultationApi.startConsultation(appointmentId);
      if (response.data.success) {
        // Update the appointment status in the local state
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt.id === appointmentId || apt.AppointmentId === appointmentId
              ? { ...apt, Status: 'IN_PROGRESS' }
              : apt
          )
        );
        alert('Consultation started successfully!');
        
        // Trigger dashboard refresh
        if (window.refreshDoctorDashboard) {
          window.refreshDoctorDashboard();
        }
        if (window.refreshConsultations) {
          window.refreshConsultations();
        }
      } else {
        alert(response.data.message || 'Failed to start consultation');
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      alert('Error starting consultation. Please try again.');
    } finally {
      setStartingConsultation(null);
    }
  };

  // Filter appointments safely
  const filteredAppointments = Array.isArray(appointments) ? appointments.filter(appointment => {
    const patientName = appointment.patient_name || appointment.PatientName || 'Unknown';
    const appointmentId = appointment.AppointmentId || appointment.appointmentId || 'Unknown';
    const status = appointment.Status || appointment.status || 'Unknown';
    
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         appointmentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  }) : [];

  const getStatusBadge = (status) => {
    const statusClasses = {
      'SCHEDULED': 'bg-primary',
      'IN_PROGRESS': 'bg-warning',
      'COMPLETED': 'bg-success',
      'CANCELLED': 'bg-danger',
      'Scheduled': 'bg-primary',
      'In Progress': 'bg-warning',
      'Completed': 'bg-success',
      'Cancelled': 'bg-danger'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center">
            <FaSpinner className="fa-spin text-primary mb-3" size={48} />
            <h5>Loading appointments...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Appointments</h4>
          <p>{error}</p>
          <hr />
          <div className="mb-3">
            <h6>Debug Information:</h6>
            <ul className="mb-0">
              <li>Staff ID: {staffId || 'Not available'}</li>
              <li>Access Token: {localStorage.getItem('access_token') ? 'Present' : 'Missing'}</li>
              <li>API Base: http://localhost:8000</li>
            </ul>
          </div>
          <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
          <div className="mt-3">
            <button 
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={async () => {
                try {
                  console.log('Testing API connection...');
                  const response = await fetch('http://localhost:8000/api/receptionist/appointments/', {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  console.log('Test response status:', response.status);
                  console.log('Test response:', await response.text());
                } catch (err) {
                  console.error('Test API error:', err);
                }
              }}
            >
              Test API Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            <FaCalendarAlt className="me-2 text-primary" />
            Appointments
          </h3>
          <p className="text-muted">View your scheduled appointments</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search patients or appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100">
            <FaFilter className="me-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="row">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id || appointment.AppointmentId} className="col-lg-6 col-xl-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1 fw-bold">
                      {appointment.AppointmentId || appointment.appointmentId || 'Unknown Appointment'}
                    </h6>
                    <small className="text-muted">
                      Token #{appointment.TokenNo || appointment.tokenNo || 'N/A'} - {appointment.patient_name || appointment.PatientName || 'No Patient'}
                    </small>
                  </div>
                  <span className={getStatusBadge(appointment.Status || appointment.status)}>
                    {appointment.Status || appointment.status || 'Unknown'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaCalendarAlt className="me-2 text-muted" size={14} />
                    <span>{appointment.Date || appointment.date || 'N/A'}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaUser className="me-2 text-muted" size={14} />
                    <span>Dr. {appointment.doctor_name || appointment.doctorName || 'Unknown Doctor'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2 text-muted" size={14} />
                    <span>Created: {new Date(appointment.Created_At || appointment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">Patient ID: {appointment.patient_id || appointment.PatientId || 'N/A'}</small>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Age: {appointment.patient_age || 'N/A'}</small>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Gender: {appointment.patient_gender || 'N/A'}</small>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Phone: {appointment.patient_phone || 'N/A'}</small>
                    </div>
                  </div>
                </div>

                {appointment.doctor_specialization && (
                  <div className="mb-3">
                    <small className="text-muted">Specialization: {appointment.doctor_specialization}</small>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-sm">
                    View Details
                  </button>
                  {(appointment.Status === 'SCHEDULED' || appointment.status === 'Scheduled') && (
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleStartConsultation(appointment.id || appointment.AppointmentId)}
                      disabled={startingConsultation === (appointment.id || appointment.AppointmentId)}
                    >
                      {startingConsultation === (appointment.id || appointment.AppointmentId) ? (
                        <>
                          <FaSpinner className="fa-spin me-2" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <FaPlay className="me-2" />
                      Start Consultation
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-5">
          <FaCalendarAlt size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No appointments found</h5>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;
