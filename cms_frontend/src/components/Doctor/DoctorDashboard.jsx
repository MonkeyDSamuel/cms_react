import React from 'react';
import { FaUserMd, FaCalendarAlt, FaClipboardList, FaClock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const DoctorDashboard = () => {
  // Mock data for doctor-specific stats
  const stats = [
    { 
      title: "Today's Appointments", 
      value: 12, 
      icon: <FaCalendarAlt className="text-primary" />,
      color: "primary"
    },
    { 
      title: "Pending Consultations", 
      value: 8, 
      icon: <FaClock className="text-warning" />,
      color: "warning"
    },
    { 
      title: "Completed Today", 
      value: 15, 
      icon: <FaCheckCircle className="text-success" />,
      color: "success"
    },
    { 
      title: "Urgent Cases", 
      value: 3, 
      icon: <FaExclamationTriangle className="text-danger" />,
      color: "danger"
    }
  ];

  // Recent appointments data
  const recentAppointments = [
    { id: 1, patient: "John Smith", time: "09:00 AM", status: "Completed", type: "Follow-up" },
    { id: 2, patient: "Sarah Johnson", time: "10:30 AM", status: "In Progress", type: "Consultation" },
    { id: 3, patient: "Mike Wilson", time: "11:15 AM", status: "Pending", type: "New Patient" },
    { id: 4, patient: "Emily Davis", time: "02:00 PM", status: "Scheduled", type: "Check-up" }
  ];

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-3">
            <FaUserMd className="me-2 text-primary" />
            Doctor Dashboard
          </h2>
          <p className="text-muted">Welcome back, Dr. Smith. Here's your daily overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, idx) => (
          <div className="col-lg-3 col-md-6 mb-3" key={idx}>
            <div className={`card border-0 shadow-sm h-100 bg-${stat.color} bg-opacity-10`}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 me-3">
                    {stat.icon}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="card-title text-muted mb-1">{stat.title}</h6>
                    <h3 className={`mb-0 text-${stat.color}`}>{stat.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Appointments */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <FaClipboardList className="me-2 text-primary" />
                Recent Appointments
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2">
                              <span className="text-primary fw-bold">
                                {appointment.patient.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {appointment.patient}
                          </div>
                        </td>
                        <td>{appointment.time}</td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info">
                            {appointment.type}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            appointment.status === 'Completed' ? 'bg-success' :
                            appointment.status === 'In Progress' ? 'bg-warning' :
                            appointment.status === 'Pending' ? 'bg-secondary' :
                            'bg-primary'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  <FaCalendarAlt className="me-2" />
                  Schedule Appointment
                </button>
                <button className="btn btn-outline-primary">
                  <FaClipboardList className="me-2" />
                  View All Patients
                </button>
                <button className="btn btn-outline-success">
                  <FaCheckCircle className="me-2" />
                  Add Prescription
                </button>
                <button className="btn btn-outline-warning">
                  <FaExclamationTriangle className="me-2" />
                  Emergency Cases
                </button>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Today's Schedule</h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">09:00 AM</h6>
                    <p className="mb-1">John Smith - Follow-up</p>
                    <small className="text-muted">Room 101</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-warning"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">10:30 AM</h6>
                    <p className="mb-1">Sarah Johnson - Consultation</p>
                    <small className="text-muted">Room 102</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-secondary"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">11:15 AM</h6>
                    <p className="mb-1">Mike Wilson - New Patient</p>
                    <small className="text-muted">Room 103</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">02:00 PM</h6>
                    <p className="mb-1">Emily Davis - Check-up</p>
                    <small className="text-muted">Room 101</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
