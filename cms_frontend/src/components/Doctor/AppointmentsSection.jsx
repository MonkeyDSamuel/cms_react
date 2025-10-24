import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

const AppointmentsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patient: "John Smith",
      time: "09:00 AM",
      date: "2024-01-15",
      status: "Scheduled",
      type: "Follow-up",
      room: "101",
      notes: "Regular check-up"
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "10:30 AM",
      date: "2024-01-15",
      status: "In Progress",
      type: "Consultation",
      room: "102",
      notes: "New patient consultation"
    },
    {
      id: 3,
      patient: "Mike Wilson",
      time: "11:15 AM",
      date: "2024-01-15",
      status: "Completed",
      type: "Check-up",
      room: "103",
      notes: "Annual physical"
    },
    {
      id: 4,
      patient: "Emily Davis",
      time: "02:00 PM",
      date: "2024-01-15",
      status: "Scheduled",
      type: "Emergency",
      room: "104",
      notes: "Urgent consultation"
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Scheduled': 'bg-primary',
      'In Progress': 'bg-warning',
      'Completed': 'bg-success',
      'Cancelled': 'bg-danger'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            <FaCalendarAlt className="me-2 text-primary" />
            Appointments
          </h3>
          <p className="text-muted">Manage your patient appointments</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-2" />
          New Appointment
        </button>
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
              placeholder="Search patients..."
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
          <div key={appointment.id} className="col-lg-6 col-xl-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">{appointment.patient}</h6>
                    <small className="text-muted">{appointment.type}</small>
                  </div>
                  <span className={getStatusBadge(appointment.status)}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="me-2 text-muted" size={14} />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaUser className="me-2 text-muted" size={14} />
                    <span>Room {appointment.room}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2 text-muted" size={14} />
                    <span>{appointment.date}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mb-3">
                    <small className="text-muted">Notes: {appointment.notes}</small>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-sm">
                    View Details
                  </button>
                  {appointment.status === 'Scheduled' && (
                    <button className="btn btn-outline-success btn-sm">
                      Start Consultation
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
