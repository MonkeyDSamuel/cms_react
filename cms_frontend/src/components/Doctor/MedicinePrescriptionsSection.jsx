import React, { useState } from 'react';
import { FaPills, FaSearch, FaPlus, FaEye, FaEdit, FaPrint } from 'react-icons/fa';

const MedicinePrescriptionsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock medicine prescriptions data
  const prescriptions = [
    {
      id: 1,
      patientName: "John Smith",
      date: "2024-01-15",
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
      ],
      status: "Active",
      doctorNotes: "Continue current treatment, monitor blood pressure"
    },
    {
      id: 2,
      patientName: "Sarah Johnson",
      date: "2024-01-14",
      medications: [
        { name: "Albuterol", dosage: "90mcg", frequency: "As needed" },
        { name: "Fluticasone", dosage: "220mcg", frequency: "Twice daily" }
      ],
      status: "Active",
      doctorNotes: "Asthma management, follow up in 3 months"
    },
    {
      id: 4,
      patientName: "Emily Davis",
      date: "2024-01-12",
      medications: [
        { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily" },
        { name: "Naproxen", dosage: "500mg", frequency: "Twice daily" }
      ],
      status: "Active",
      doctorNotes: "Cholesterol management and arthritis treatment"
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || prescription.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'bg-success',
      'Completed': 'bg-primary',
      'Cancelled': 'bg-danger'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            <FaPills className="me-2 text-primary" />
            Medicine Prescriptions
          </h3>
          <p className="text-muted">Manage patient medication prescriptions</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-2" />
          New Medicine Prescription
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
              placeholder="Search medicine prescriptions by patient name..."
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="row">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="col-lg-6 col-xl-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">{prescription.patientName}</h6>
                    <small className="text-muted">Prescription #{prescription.id}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-primary mb-1">
                      <FaPills className="me-1" />
                      Medicine
                    </span>
                    <br />
                    <span className={getStatusBadge(prescription.status)}>
                      {prescription.status}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Date: {prescription.date}</small>
                </div>

                <div className="mb-3">
                  <h6 className="small text-muted mb-2">Medications:</h6>
                  {prescription.medications.map((med, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-light rounded">
                      <div className="d-flex justify-content-between">
                        <strong className="small">{med.name}</strong>
                        <span className="small text-muted">{med.dosage}</span>
                      </div>
                      <small className="text-muted">{med.frequency}</small>
                    </div>
                  ))}
                </div>

                {prescription.doctorNotes && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Doctor Notes:</small>
                    <p className="small mb-0">{prescription.doctorNotes}</p>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-sm">
                    <FaEye className="me-2" />
                    View Details
                  </button>
                  <div className="btn-group" role="group">
                    <button className="btn btn-outline-primary btn-sm">
                      <FaEdit className="me-1" />
                      Edit
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <FaPrint className="me-1" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-5">
          <FaPills size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No medicine prescriptions found</h5>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary">{prescriptions.filter(p => p.status === 'Active').length}</h4>
              <small className="text-muted">Active Prescriptions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success">{prescriptions.filter(p => p.status === 'Completed').length}</h4>
              <small className="text-muted">Completed</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info">{prescriptions.length}</h4>
              <small className="text-muted">Total Prescriptions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning">
                {prescriptions.reduce((total, p) => total + p.medications.length, 0)}
              </h4>
              <small className="text-muted">Total Medications</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinePrescriptionsSection;
