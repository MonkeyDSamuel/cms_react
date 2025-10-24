import React, { useState, useEffect } from 'react';
import { FaFileMedicalAlt, FaSearch, FaPlus, FaEye, FaDownload, FaEdit, FaSpinner } from 'react-icons/fa';
import { MedicalRecordsApi } from '../../service/DoctorApi';

const MedicalRecordsSection = ({ staffId, staffInfo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load medical records from backend
  useEffect(() => {
    const loadMedicalRecords = async () => {
      if (!staffId) return;
      
      setLoading(true);
      setError('');
      
      try {
        console.log('Loading medical records for staffId:', staffId);
        const response = await MedicalRecordsApi.getAll();
        console.log('Medical records API response:', response);
        
        // Handle Django REST Framework pagination structure
        let recordsData = [];
        if (response.data && Array.isArray(response.data.results)) {
          recordsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          recordsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          recordsData = response.data.data;
        }
        
        console.log('Processed medical records data:', recordsData);
        
        if (Array.isArray(recordsData)) {
          setMedicalRecords(recordsData);
        } else {
          console.warn('Medical records data is not an array:', recordsData);
          setMedicalRecords([]);
        }
      } catch (err) {
        console.error('Error loading medical records:', err);
        setError(`Failed to load medical records: ${err.response?.data?.detail || err.message}`);
        setMedicalRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedicalRecords();
  }, [staffId]);

  // Filter records safely
  const filteredRecords = Array.isArray(medicalRecords) ? medicalRecords.filter(record => {
    const patientName = record.patient_name || record.patientName || 'Unknown';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center">
            <FaSpinner className="fa-spin text-primary mb-3" size={48} />
            <h5>Loading medical records...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Medical Records</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  const getRecordTypeBadge = (type) => {
    const typeClasses = {
      'Consultation Report': 'bg-primary',
      'Emergency Visit': 'bg-danger',
      'Physical Examination': 'bg-info',
      'Follow-up Visit': 'bg-success'
    };
    return `badge ${typeClasses[type] || 'bg-secondary'}`;
  };

  const handleViewDetails = (record) => {
    alert(`Viewing details for medical record: ${record.id}`);
    // TODO: Implement detailed view modal
  };

  const handleEdit = (record) => {
    alert(`Editing medical record: ${record.id}`);
    // TODO: Implement edit functionality
  };

  const handleDownload = (record) => {
    alert(`Downloading medical record: ${record.id}`);
    // TODO: Implement download functionality
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
                    <h6 className="mb-1">{record.patient_name || record.patientName || 'Unknown Patient'}</h6>
                    <small className="text-muted">Record #{record.id}</small>
                  </div>
                  <span className={getRecordTypeBadge(record.record_type || record.recordType || 'Unknown')}>
                    {record.record_type || record.recordType || 'Unknown'}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">Date</small>
                      <span className="small">{record.date || record.Created_At || 'N/A'}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Doctor</small>
                      <span className="small">{record.doctor_name || record.doctor || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Diagnosis</small>
                  <p className="small mb-1">{record.diagnosis || record.Diagnosis || 'N/A'}</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Notes</small>
                  <p className="small mb-1">{record.notes || record.Notes || record.description || 'N/A'}</p>
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
                    onClick={() => handleViewDetails(record)}
                  >
                    <FaEye className="me-2" />
                    View Details
                  </button>
                  <div className="btn-group" role="group">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(record)}
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleDownload(record)}
                    >
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
