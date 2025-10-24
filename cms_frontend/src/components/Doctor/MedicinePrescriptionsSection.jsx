import React, { useState, useEffect } from 'react';
import { FaPills, FaSearch, FaPlus, FaEye, FaSpinner } from 'react-icons/fa';
import { MedicinePrescriptionsApi } from '../../service/DoctorApi';
import CreatePrescriptionModal from './CreatePrescriptionModal';

const MedicinePrescriptionsSection = ({ staffId, staffInfo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Load prescriptions from backend
  useEffect(() => {
    const loadPrescriptions = async () => {
      if (!staffId) return;
      
      setLoading(true);
      setError('');
      
      try {
        console.log('Loading medicine prescriptions for staffId:', staffId);
        const response = await MedicinePrescriptionsApi.getAll();
        console.log('Medicine prescriptions API response:', response);
        
        // Handle Django REST Framework pagination structure
        let prescriptionsData = [];
        if (response.data && Array.isArray(response.data.results)) {
          prescriptionsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          prescriptionsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          prescriptionsData = response.data.data;
        }
        
        console.log('Processed prescriptions data:', prescriptionsData);
        
        if (Array.isArray(prescriptionsData)) {
          setPrescriptions(prescriptionsData);
        } else {
          console.warn('Prescriptions data is not an array:', prescriptionsData);
          setPrescriptions([]);
        }
      } catch (err) {
        console.error('Error loading medicine prescriptions:', err);
        setError(`Failed to load medicine prescriptions: ${err.response?.data?.detail || err.message}`);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [staffId]);

  // Filter prescriptions safely - only show prescriptions with notes
  const filteredPrescriptions = Array.isArray(prescriptions) ? prescriptions.filter(prescription => {
    const patientName = prescription.patient_name || prescription.patientName || 'Unknown';
    const status = prescription.Status || prescription.status || 'Unknown';
    const hasNotes = prescription.Notes && prescription.Notes.trim() !== '';
    
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || status.toLowerCase() === filterStatus.toLowerCase();
    return hasNotes && matchesSearch && matchesStatus;
  }) : [];

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'bg-success',
      'Completed': 'bg-primary',
      'Cancelled': 'bg-danger'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };


  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center">
            <FaSpinner className="fa-spin text-primary mb-3" size={48} />
            <h5>Loading medicine prescriptions...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Medicine Prescriptions</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

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
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
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
                    <h6 className="mb-1">{prescription.patient_name || prescription.patientName || 'No Patient'}</h6>
                    <small className="text-muted">Prescription #{prescription.medPrescriptionId || prescription.id || 'Unknown'}</small>
                    <br />
                    <small className="text-info">Consultation: {prescription.consultation_id || 'N/A'}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-primary mb-1">
                      <FaPills className="me-1" />
                      Medicine
                    </span>
                    <br />
                    <span className={getStatusBadge(prescription.consultation_status || prescription.Status || prescription.status)}>
                      {prescription.consultation_status || prescription.Status || prescription.status || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Date: {prescription.Created_At || prescription.appointment_date || prescription.Date || prescription.date || 'N/A'}</small>
                </div>

                <div className="mb-3">
                  <h6 className="small text-muted mb-2">Medications:</h6>
                  {prescription.medications && prescription.medications.length > 0 ? (
                    prescription.medications.map((med, idx) => (
                      <div key={idx} className="mb-2 p-2 bg-light rounded">
                        <div className="d-flex justify-content-between">
                          <strong className="small">{med.name || med.medicine_name || 'Unknown Medicine'}</strong>
                          <span className="small text-muted">{med.dosage || med.dose || 'N/A'}</span>
                        </div>
                        <small className="text-muted">{med.frequency || med.instructions || 'N/A'}</small>
                      </div>
                    ))
                  ) : (
                    <div className="mb-2 p-2 bg-light rounded">
                      <small className="text-muted">No medications prescribed</small>
                    </div>
                  )}
                </div>

                {(prescription.Notes || prescription.doctorNotes || prescription.notes) && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Prescription Notes:</small>
                    <p className="small mb-0">{prescription.Notes || prescription.doctorNotes || prescription.notes || ''}</p>
                  </div>
                )}

                <div className="d-grid">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewDetails(prescription)}
                  >
                    <FaEye className="me-2" />
                    View Details
                  </button>
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
              <h4 className="text-primary">{Array.isArray(prescriptions) ? prescriptions.filter(p => (p.Status || p.status) === 'Active' && p.Notes && p.Notes.trim() !== '').length : 0}</h4>
              <small className="text-muted">Active with Notes</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success">{Array.isArray(prescriptions) ? prescriptions.filter(p => (p.Status || p.status) === 'Completed' && p.Notes && p.Notes.trim() !== '').length : 0}</h4>
              <small className="text-muted">Completed with Notes</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info">{Array.isArray(prescriptions) ? prescriptions.filter(p => p.Notes && p.Notes.trim() !== '').length : 0}</h4>
              <small className="text-muted">Total with Notes</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning">
                {Array.isArray(prescriptions) ? prescriptions.reduce((total, p) => total + (p.medications?.length || 0), 0) : 0}
              </h4>
              <small className="text-muted">Total Medications</small>
            </div>
          </div>
        </div>
      </div>

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        type="medicine"
        staffId={staffId}
      />

      {/* Prescription Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaPills className="me-2 text-primary" />
                  Medicine Prescription Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">Prescription Information</h6>
                    <div className="mb-3">
                      <strong>Prescription ID:</strong> {selectedPrescription.medPrescriptionId || selectedPrescription.id}
                    </div>
                    <div className="mb-3">
                      <strong>Patient Name:</strong> {selectedPrescription.patient_name || selectedPrescription.patientName || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Consultation ID:</strong> {selectedPrescription.consultation_id || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong> 
                      <span className={`badge ms-2 ${getStatusBadge(selectedPrescription.consultation_status || selectedPrescription.Status || selectedPrescription.status)}`}>
                        {selectedPrescription.consultation_status || selectedPrescription.Status || selectedPrescription.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <strong>Created Date:</strong> {selectedPrescription.Created_At || selectedPrescription.appointment_date || selectedPrescription.Date || 'N/A'}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">Patient Details</h6>
                    <div className="mb-3">
                      <strong>Patient ID:</strong> {selectedPrescription.patient_id || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Phone:</strong> {selectedPrescription.patient_phone || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Age:</strong> {selectedPrescription.patient_age || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Gender:</strong> {selectedPrescription.patient_gender || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Appointment Date:</strong> {selectedPrescription.appointment_date || 'N/A'}
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <h6 className="text-primary mb-3">Prescription Notes</h6>
                  <div className="p-3 bg-light rounded">
                    {selectedPrescription.Notes || selectedPrescription.doctorNotes || selectedPrescription.notes || 'No notes available'}
                  </div>
                </div>

                {selectedPrescription.medications && selectedPrescription.medications.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-primary mb-3">Medications</h6>
                    {selectedPrescription.medications.map((med, idx) => (
                      <div key={idx} className="mb-2 p-3 bg-light rounded">
                        <div className="d-flex justify-content-between">
                          <strong>{med.name || med.medicine_name || 'Unknown Medicine'}</strong>
                          <span className="text-muted">{med.dosage || med.dose || 'N/A'}</span>
                        </div>
                        <small className="text-muted">{med.frequency || med.instructions || 'N/A'}</small>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-3">
                  <h6 className="text-primary mb-3">Doctor Information</h6>
                  <div className="p-3 bg-light rounded">
                    <div><strong>Doctor:</strong> {selectedPrescription.doctor_name || 'N/A'}</div>
                    <div><strong>Specialization:</strong> {selectedPrescription.doctor_specialization || 'N/A'}</div>
                    <div><strong>Token Number:</strong> {selectedPrescription.token_no || 'N/A'}</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinePrescriptionsSection;
