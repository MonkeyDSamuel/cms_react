import React, { useState } from 'react';
import { FaFileMedicalAlt, FaSearch, FaPlus, FaEye, FaDownload, FaEdit } from 'react-icons/fa';

const MedicalRecordsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mock medical records data
  const medicalRecords = [
    {
      id: 1,
      patientName: "John Smith",
      recordType: "Consultation Report",
      date: "2024-01-15",
      doctor: "Dr. John Smith",
      diagnosis: "Hypertension, Type 2 Diabetes",
      symptoms: "High blood pressure, elevated blood sugar",
      treatment: "Metformin 500mg, Lisinopril 10mg",
      followUp: "2024-02-15",
      attachments: ["Lab Results", "Blood Pressure Chart"]
    },
    {
      id: 2,
      patientName: "Sarah Johnson",
      recordType: "Emergency Visit",
      date: "2024-01-14",
      doctor: "Dr. John Smith",
      diagnosis: "Acute Asthma Attack",
      symptoms: "Shortness of breath, wheezing",
      treatment: "Albuterol inhaler, Prednisone",
      followUp: "2024-01-21",
      attachments: ["X-Ray Report", "Pulmonary Function Test"]
    },
    {
      id: 3,
      patientName: "Mike Wilson",
      recordType: "Physical Examination",
      date: "2024-01-13",
      doctor: "Dr. John Smith",
      diagnosis: "Back Strain",
      symptoms: "Lower back pain, muscle stiffness",
      treatment: "Ibuprofen, Physical therapy",
      followUp: "2024-01-27",
      attachments: ["MRI Report"]
    },
    {
      id: 4,
      patientName: "Emily Davis",
      recordType: "Follow-up Visit",
      date: "2024-01-12",
      doctor: "Dr. John Smith",
      diagnosis: "Arthritis, High Cholesterol",
      symptoms: "Joint pain, fatigue",
      treatment: "Atorvastatin, Naproxen",
      followUp: "2024-02-12",
      attachments: ["Blood Test Results", "Joint X-Ray"]
    }
  ];

  const filteredRecords = medicalRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecordTypeBadge = (type) => {
    const typeClasses = {
      'Consultation Report': 'bg-primary',
      'Emergency Visit': 'bg-danger',
      'Physical Examination': 'bg-info',
      'Follow-up Visit': 'bg-success'
    };
    return `badge ${typeClasses[type] || 'bg-secondary'}`;
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            <FaFileMedicalAlt className="me-2 text-primary" />
            Medical Records
          </h3>
          <p className="text-muted">Access and manage patient medical records</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-2" />
          New Record
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
              placeholder="Search records by patient, type, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Medical Records List */}
      <div className="row">
        {filteredRecords.map((record) => (
          <div key={record.id} className="col-lg-6 col-xl-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">{record.patientName}</h6>
                    <small className="text-muted">Record #{record.id}</small>
                  </div>
                  <span className={getRecordTypeBadge(record.recordType)}>
                    {record.recordType}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">Date</small>
                      <span className="small">{record.date}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Doctor</small>
                      <span className="small">{record.doctor}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Diagnosis</small>
                  <p className="small mb-1">{record.diagnosis}</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Symptoms</small>
                  <p className="small mb-1">{record.symptoms}</p>
                </div>

                {record.attachments && record.attachments.length > 0 && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Attachments</small>
                    <div className="d-flex flex-wrap gap-1">
                      {record.attachments.map((attachment, idx) => (
                        <span key={idx} className="badge bg-light text-dark small">
                          {attachment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedRecord(record)}
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
                      <FaDownload className="me-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-5">
          <FaFileMedicalAlt size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No medical records found</h5>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Medical Record - {selectedRecord.patientName}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedRecord(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Record Information</h6>
                    <p><strong>Record Type:</strong> {selectedRecord.recordType}</p>
                    <p><strong>Date:</strong> {selectedRecord.date}</p>
                    <p><strong>Doctor:</strong> {selectedRecord.doctor}</p>
                    <p><strong>Follow-up:</strong> {selectedRecord.followUp}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Medical Information</h6>
                    <p><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</p>
                    <p><strong>Symptoms:</strong> {selectedRecord.symptoms}</p>
                    <p><strong>Treatment:</strong> {selectedRecord.treatment}</p>
                  </div>
                </div>
                
                {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                  <div className="mt-4">
                    <h6>Attachments</h6>
                    <div className="row">
                      {selectedRecord.attachments.map((attachment, idx) => (
                        <div key={idx} className="col-md-4 mb-2">
                          <div className="card border">
                            <div className="card-body text-center">
                              <FaFileMedicalAlt className="text-primary mb-2" size={24} />
                              <p className="small mb-0">{attachment}</p>
                              <button className="btn btn-sm btn-outline-primary mt-2">
                                <FaDownload className="me-1" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedRecord(null)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Edit Record
                </button>
                <button type="button" className="btn btn-success">
                  <FaDownload className="me-1" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsSection;
