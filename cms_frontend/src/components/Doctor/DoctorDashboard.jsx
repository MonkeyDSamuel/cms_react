import React, { useState, useEffect } from 'react';
import { FaUserMd, FaCalendarAlt, FaClipboardList, FaClock, FaCheckCircle, FaUsers, FaPrescriptionBottleAlt, FaSpinner, FaStethoscope } from 'react-icons/fa';
import { DashboardApi, AppointmentsApi, PatientsApi, ConsultationApi } from '../../service/DoctorApi';

const DoctorDashboard = ({ staffId, staffInfo }) => {
  console.log('DoctorDashboard received:', { staffId, staffInfo });
  
  // State for real data
  const [stats, setStats] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [todaysConsultations, setTodaysConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!staffId) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Load dashboard statistics
        const statsResponse = await DashboardApi.getStats();
        const statsData = statsResponse.data?.data || statsResponse.data || {};
        
        // Transform stats data to match our component structure
        const transformedStats = [
          { 
            title: "Today's Appointments", 
            value: statsData.todays_appointments || 0, 
            icon: <FaCalendarAlt className="text-primary" />,
            color: "primary"
          },
          { 
            title: "Total Patients", 
            value: statsData.total_patients || 0, 
            icon: <FaUsers className="text-info" />,
            color: "info"
          },
          { 
            title: "Prescriptions Today", 
            value: statsData.prescriptions_today || 0, 
            icon: <FaPrescriptionBottleAlt className="text-success" />,
            color: "success"
          },
          { 
            title: "Completed Today", 
            value: statsData.completed_today || 0, 
            icon: <FaCheckCircle className="text-success" />,
            color: "success"
          }
        ];
        setStats(transformedStats);

        // Load recent consultations
        const consultationsResponse = await ConsultationApi.getAll();
        const consultationsData = consultationsResponse.data?.results || consultationsResponse.data || [];
        setRecentConsultations(consultationsData);

        // Load today's consultations (filter for today)
        const today = new Date().toISOString().split('T')[0];
        const todaysConsultations = consultationsData.filter(consultation => 
          consultation.appointment_date === today
        );
        setTodaysConsultations(todaysConsultations);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        
        // Set empty data on error
        setStats([]);
        setRecentConsultations([]);
        setTodaysConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [staffId, refreshKey]);

  // Set up global refresh listeners
  useEffect(() => {
    const handleRefresh = () => {
      console.log('Dashboard refresh triggered');
      setRefreshKey(prev => prev + 1);
    };

    // Listen for global refresh events
    window.addEventListener('refreshDoctorDashboard', handleRefresh);
    window.addEventListener('refreshAppointments', handleRefresh);
    window.addEventListener('refreshConsultations', handleRefresh);
    window.addEventListener('refreshPrescriptions', handleRefresh);

    // Expose refresh function globally
    window.refreshDoctorDashboard = handleRefresh;

    return () => {
      window.removeEventListener('refreshDoctorDashboard', handleRefresh);
      window.removeEventListener('refreshAppointments', handleRefresh);
      window.removeEventListener('refreshConsultations', handleRefresh);
      window.removeEventListener('refreshPrescriptions', handleRefresh);
    };
  }, []);

  // Set up periodic refresh (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Periodic dashboard refresh');
      setRefreshKey(prev => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to refresh dashboard data
  const refreshDashboard = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Expose refresh function to parent component
  useEffect(() => {
    if (window.refreshDoctorDashboard) {
      window.refreshDoctorDashboard = refreshDashboard;
    } else {
      window.refreshDoctorDashboard = refreshDashboard;
    }
  }, []);

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center">
            <FaSpinner className="fa-spin text-primary mb-3" size={48} />
            <h5>Loading dashboard data...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Dashboard</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-3">
            <FaUserMd className="me-2 text-primary" />
            Doctor Dashboard
          </h2>
          <p className="text-muted">
            Welcome back, {staffInfo ? `Dr. ${staffInfo.first_name} ${staffInfo.last_name}` : 'Doctor'}. 
            {staffId && ` (Staff ID: ${staffId})`} Here's your daily overview.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, idx) => (
          <div className="col-lg-3 col-md-6 mb-3" key={idx}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 me-3">
                    <div className={`p-3 rounded-circle bg-${stat.color} bg-opacity-10`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="card-title text-muted mb-1">{stat.title}</h6>
                    <h3 className={`mb-0 text-${stat.color} fw-bold`}>{stat.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Consultations */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-gradient bg-primary text-white border-0">
              <h5 className="mb-0 text-white">
                <FaStethoscope className="me-2" />
                Recent Consultations
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                      <tr>
                        <th>Consultation ID</th>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Token</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                    {!Array.isArray(recentConsultations) || recentConsultations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No recent consultations found
                        </td>
                      </tr>
                    ) : (
                      recentConsultations.map((consultation) => (
                        <tr key={consultation.id || consultation.consultationId}>
                          <td>
                            <div className="fw-bold text-primary">
                              {consultation.consultationId || 'Unknown Consultation'}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2">
                                <span className="text-primary fw-bold">
                                  {consultation.patient_name ? 
                                    consultation.patient_name.split(' ').map(n => n[0]).join('') :
                                    'P'
                                  }
                                </span>
                              </div>
                              <div>
                                <div className="fw-bold">{consultation.patient_name || 'No Patient'}</div>
                                <small className="text-muted">ID: {consultation.patient_id || 'N/A'}</small>
                              </div>
                            </div>
                          </td>
                          <td>{consultation.appointment_date || 'N/A'}</td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-info">
                              Token #{consultation.token_no || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              consultation.Status === 'COMPLETED' ? 'bg-success' :
                              consultation.Status === 'IN_PROGRESS' ? 'bg-warning' :
                              consultation.Status === 'SCHEDULED' ? 'bg-primary' :
                              consultation.Status === 'CANCELLED' ? 'bg-danger' :
                              consultation.Status === 'ON_HOLD' ? 'bg-info' :
                              'bg-secondary'
                            }`}>
                              {consultation.Status || 'Unknown'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Consultations */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-gradient bg-warning text-white border-0">
              <h5 className="mb-0 text-white">
                <FaClock className="me-2" />
                Today's Consultations
              </h5>
            </div>
            <div className="card-body">
              {!Array.isArray(todaysConsultations) || todaysConsultations.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <FaStethoscope className="mb-3" size={32} />
                  <p className="mb-0">No consultations scheduled for today</p>
                </div>
              ) : (
                <div className="timeline">
                  {todaysConsultations.map((consultation, index) => (
                    <div className="timeline-item d-flex align-items-start mb-3" key={consultation.id || consultation.consultationId || index}>
                      <div className={`timeline-marker rounded-circle d-flex align-items-center justify-content-center me-3 ${
                        consultation.Status === 'COMPLETED' ? 'bg-success' :
                        consultation.Status === 'IN_PROGRESS' ? 'bg-warning' :
                        consultation.Status === 'SCHEDULED' ? 'bg-primary' :
                        consultation.Status === 'CANCELLED' ? 'bg-danger' :
                        consultation.Status === 'ON_HOLD' ? 'bg-info' :
                        'bg-secondary'
                      }`} style={{ width: '12px', height: '12px', minWidth: '12px' }}></div>
                      <div className="timeline-content flex-grow-1">
                        <h6 className="mb-1 text-primary">{consultation.consultationId || 'Unknown Consultation'}</h6>
                        <p className="mb-1 fw-medium">{consultation.patient_name || 'No Patient'}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Token #{consultation.token_no || 'N/A'}</small>
                          <span className={`badge ${
                            consultation.Status === 'COMPLETED' ? 'bg-success' :
                            consultation.Status === 'IN_PROGRESS' ? 'bg-warning' :
                            consultation.Status === 'SCHEDULED' ? 'bg-primary' :
                            consultation.Status === 'CANCELLED' ? 'bg-danger' :
                            consultation.Status === 'ON_HOLD' ? 'bg-info' :
                            'bg-secondary'
                          }`}>
                            {consultation.Status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
