import React, { useState } from 'react';
import { FaUserInjured, FaSearch, FaPlus, FaEye, FaEdit, FaFileMedicalAlt } from 'react-icons/fa';

const PatientsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Mock patients data
  const patients = [
    {
      id: 1,
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com",
      lastVisit: "2024-01-10",
      status: "Active",
      medicalHistory: ["Hypertension", "Diabetes Type 2"],
      nextAppointment: "2024-01-20"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      phone: "+1 (555) 234-5678",
      email: "sarah.johnson@email.com",
      lastVisit: "2024-01-12",
      status: "Active",
      medicalHistory: ["Asthma"],
      nextAppointment: "2024-01-25"
    },
    {
      id: 3,
      name: "Mike Wilson",
      age: 28,
      gender: "Male",
      phone: "+1 (555) 345-6789",
      email: "mike.wilson@email.com",
      lastVisit: "2024-01-08",
      status: "Active",
      medicalHistory: [],
      nextAppointment: "2024-01-18"
    },
    {
      id: 4,
      name: "Emily Davis",
      age: 55,
      gender: "Female",
      phone: "+1 (555) 456-7890",
      email: "emily.davis@email.com",
      lastVisit: "2024-01-05",
      status: "Active",
      medicalHistory: ["Arthritis", "High Cholesterol"],
      nextAppointment: "2024-01-22"
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            <FaUserInjured className="me-2 text-primary" />
            Patients
          </h3>
          <p className="text-muted">Manage your patient records</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-2" />
          Add New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="row">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="col-lg-6 col-xl-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">{patient.name}</h6>
                    <small className="text-muted">{patient.age} years, {patient.gender}</small>
                  </div>
                  <span className={`badge ${getStatusBadge(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">Phone</small>
                      <span className="small">{patient.phone}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Last Visit</small>
                      <span className="small">{patient.lastVisit}</span>
                    </div>
                  </div>
                </div>

                {patient.medicalHistory.length > 0 && (
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Medical History</small>
                    <div className="d-flex flex-wrap gap-1">
                      {patient.medicalHistory.map((condition, idx) => (
                        <span key={idx} className="badge bg-info bg-opacity-10 text-info small">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.nextAppointment && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Next Appointment</small>
                    <span className="small text-primary">{patient.nextAppointment}</span>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <FaEye className="me-2" />
                    View Details
                  </button>
                  <div className="btn-group" role="group">
                    <button className="btn btn-outline-primary btn-sm">
                      <FaEdit className="me-1" />
                      Edit
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <FaFileMedicalAlt className="me-1" />
                      Records
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-5">
          <FaUserInjured size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No patients found</h5>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Patient Details Modal (placeholder) */}
      {selectedPatient && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Patient Details - {selectedPatient.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedPatient(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Personal Information</h6>
                    <p><strong>Name:</strong> {selectedPatient.name}</p>
                    <p><strong>Age:</strong> {selectedPatient.age}</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                    <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Medical Information</h6>
                    <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
                    <p><strong>Status:</strong> {selectedPatient.status}</p>
                    <p><strong>Next Appointment:</strong> {selectedPatient.nextAppointment}</p>
                    <div>
                      <strong>Medical History:</strong>
                      <ul className="mt-1">
                        {selectedPatient.medicalHistory.map((condition, idx) => (
                          <li key={idx}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedPatient(null)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Edit Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsSection;
