import React, { useState } from 'react';
import { FaFlask, FaSearch, FaPlus, FaEye, FaEdit, FaPrint } from 'react-icons/fa';

const LabTestPrescriptionsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock lab test prescriptions data
  const prescriptions = [
    {
      id: 3,
      patientName: "Mike Wilson",
      date: "2024-01-13",
      tests: [
        { name: "Complete Blood Count", type: "Blood Test", instructions: "Fasting required" },
        { name: "Lipid Panel", type: "Blood Test", instructions: "12-hour fast" }
      ],
      status: "Completed",
      doctorNotes: "Routine health checkup lab tests"
    },
    {
      id: 5,
      patientName: "Robert Brown",
      date: "2024-01-11",
      tests: [
        { name: "Blood Glucose Test", type: "Blood Test", instructions: "Fasting required" },
        { name: "HbA1c", type: "Blood Test", instructions: "No fasting required" }
      ],
      status: "Active",
      doctorNotes: "Diabetes monitoring lab tests"
    },
    {
      id: 6,
      patientName: "Lisa Anderson",
      date: "2024-01-10",
      tests: [
        { name: "Thyroid Function Test", type: "Blood Test", instructions: "Morning test preferred" },
        { name: "Vitamin D", type: "Blood Test", instructions: "No special preparation" }
      ],
      status: "Active",
      doctorNotes: "Thyroid and vitamin deficiency screening"
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
            <FaFlask className="me-2 text-info" />
            Lab Test Prescriptions
          </h3>
          <p className="text-muted">Manage patient laboratory test prescriptions</p>
        </div>
        <button className="btn btn-info">
          <FaPlus className="me-2" />
          New Lab Test Prescription
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
              placeholder="Search lab test prescriptions by patient name..."
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
                    <small className="text-muted">Lab Test #{prescription.id}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-info mb-1">
                      <FaFlask className="me-1" />
                      Lab Test
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
                  <h6 className="small text-muted mb-2">Lab Tests:</h6>
                  {prescription.tests.map((test, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-light rounded">
                      <div className="d-flex justify-content-between">
                        <strong className="small">{test.name}</strong>
                        <span className="small text-muted">{test.type}</span>
                      </div>
                      <small className="text-muted">{test.instructions}</small>
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
                  <button className="btn btn-info btn-sm">
                    <FaEye className="me-2" />
                    View Details
                  </button>
                  <div className="btn-group" role="group">
                    <button className="btn btn-outline-info btn-sm">
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
          <FaFlask size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No lab test prescriptions found</h5>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info">{prescriptions.filter(p => p.status === 'Active').length}</h4>
              <small className="text-muted">Active Tests</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary">{prescriptions.filter(p => p.status === 'Completed').length}</h4>
              <small className="text-muted">Completed</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success">{prescriptions.length}</h4>
              <small className="text-muted">Total Tests</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning">
                {prescriptions.reduce((total, p) => total + p.tests.length, 0)}
              </h4>
              <small className="text-muted">Test Items</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestPrescriptionsSection;
