import React, { useState, useEffect } from 'react';
import { StaffApi, DoctorApi, SpecializationApi } from '../../service/AdminApi';
import { Spinner, Alert } from 'react-bootstrap';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalDoctors: 0,
    totalSpecializations: 0,
    loading: true,
    error: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: '' }));
      
      // Load all data in parallel
      const [staffResponse, doctorResponse, specializationResponse] = await Promise.all([
        StaffApi.getAll(),
        DoctorApi.getAll(),
        SpecializationApi.getAll()
      ]);

      const staffData = staffResponse.data?.data || staffResponse.data || [];
      const doctorData = doctorResponse.data?.data || doctorResponse.data || [];
      const specializationData = specializationResponse.data?.data || specializationResponse.data || [];

      setStats({
        totalStaff: staffData.length,
        totalDoctors: doctorData.length,
        totalSpecializations: specializationData.length,
        loading: false,
        error: ''
      });

      console.log('Dashboard data loaded:', {
        staff: staffData.length,
        doctors: doctorData.length,
        specializations: specializationData.length
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.detail || error.message || 'Failed to load dashboard data'
      }));
    }
  };

  if (stats.loading) {
    return (
      <div className="container mt-4">
        <h2>Welcome, Admin</h2>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" />
          <span className="ms-3">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="container mt-4">
        <h2>Welcome, Admin</h2>
        <Alert variant="danger">
          {stats.error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2" 
            onClick={loadDashboardData}
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  const dashboardStats = [
    { title: "Total Staff", value: stats.totalStaff },
    { title: "Total Doctors", value: stats.totalDoctors },
    { title: "Total Specializations", value: stats.totalSpecializations },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, Admin</h2>
        <button 
          className="btn btn-outline-primary btn-sm" 
          onClick={loadDashboardData}
        >
          Refresh Data
        </button>
      </div>
      
      <div className="row">
        {dashboardStats.map((stat, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">{stat.title}</h5>
                <p className="card-text display-4">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <small className="text-muted">
          Last updated: {new Date().toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
};

export default AdminDashboard;