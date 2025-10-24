import React, { useState, useEffect } from 'react';
import { FaStethoscope, FaEdit, FaSave, FaTimes, FaSearch, FaFilter, FaSpinner, FaNotesMedical } from 'react-icons/fa';
import { ConsultationApi } from '../../service/DoctorApi';

const ConsultationsSection = ({ staffId, staffInfo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // Load consultations from backend
  useEffect(() => {
    const loadConsultations = async () => {
      if (!staffId) return;
      
      setLoading(true);
      setError('');
      
      try {
        console.log('Loading consultations for staffId:', staffId);
        const response = await ConsultationApi.getAll();
        console.log('Consultations API response:', response);
        
        // Handle Django REST Framework pagination structure
        let consultationsData = [];
        if (response.data && Array.isArray(response.data.results)) {
          consultationsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          consultationsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          consultationsData = response.data.data;
        }
        
        console.log('Processed consultations data:', consultationsData);
        
        if (Array.isArray(consultationsData)) {
          setConsultations(consultationsData);
        } else {
          console.warn('Consultations data is not an array:', consultationsData);
          setConsultations([]);
        }
      } catch (err) {
        console.error('Error loading consultations:', err);
        setError(`Failed to load consultations: ${err.response?.data?.detail || err.message}`);
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, [staffId]);

  // Filter consultations safely
  const filteredConsultations = Array.isArray(consultations) ? consultations.filter(consultation => {
    const patientName = consultation.patient_name || 'Unknown';
    const consultationId = consultation.consultationId || 'Unknown';
    const status = consultation.Status || 'Unknown';
    
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         consultationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  }) : [];

  const getStatusBadge = (status) => {
    const statusClasses = {
      'IN_PROGRESS': 'bg-warning',
      'COMPLETED': 'bg-success',
      'CANCELLED': 'bg-danger',
      'ON_HOLD': 'bg-info'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const handleEditConsultation = (consultation) => {
    setEditingConsultation(consultation.id);
    setEditNotes(consultation.Notes || '');
    setEditStatus(consultation.Status || '');
  };

  const handleCancelEdit = () => {
    setEditingConsultation(null);
    setEditNotes('');
    setEditStatus('');
  };

  const handleUpdateStatus = async (consultationId) => {
    if (!editStatus) return;
    
    setUpdating(true);
    try {
      const response = await ConsultationApi.updateStatus(consultationId, editStatus);
      if (response.data.success) {
        // Update local state
        setConsultations(prevConsultations => 
          prevConsultations.map(consultation => 
            consultation.id === consultationId
              ? { ...consultation, Status: editStatus }
              : consultation
          )
        );
        setEditingConsultation(null);
        setEditStatus('');
        alert('Consultation status updated successfully!');
        // Refresh dashboard data
        if (window.refreshDoctorDashboard) {
          window.refreshDoctorDashboard();
        }
        // Refresh appointments data
        if (window.refreshAppointments) {
          window.refreshAppointments();
        }
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating consultation status:', error);
      alert('Error updating consultation status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateNotes = async (consultationId) => {
    setUpdating(true);
    try {
      const response = await ConsultationApi.updateNotes(consultationId, editNotes);
      if (response.data.success) {
        // Update local state
        setConsultations(prevConsultations => 
          prevConsultations.map(consultation => 
            consultation.id === consultationId
              ? { ...consultation, Notes: editNotes }
              : consultation
          )
        );
        setEditingConsultation(null);
        setEditNotes('');
        alert('Consultation notes updated successfully!');
        // Refresh dashboard data
        if (window.refreshDoctorDashboard) {
          window.refreshDoctorDashboard();
        }
        // Refresh appointments data
        if (window.refreshAppointments) {
          window.refreshAppointments();
        }
      } else {
        alert(response.data.message || 'Failed to update notes');
      }
    } catch (error) {
      console.error('Error updating consultation notes:', error);
      alert('Error updating consultation notes. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center">
            <FaSpinner className="fa-spin text-primary mb-3" size={48} />
            <h5>Loading consultations...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Consultations</h4>
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
            <FaStethoscope className="me-2 text-primary" />
            Consultations
          </h3>
          <p className="text-muted">Manage your patient consultations</p>
        </div>
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
              placeholder="Search patients or consultations..."
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
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100">
            <FaFilter className="me-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Consultations List */}
      <div className="row">
        {filteredConsultations.map((consultation) => (
          <div key={consultation.id || consultation.consultationId} className="col-lg-6 col-xl-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1 fw-bold">
                      {consultation.consultationId || 'Unknown Consultation'}
                    </h6>
                    <small className="text-muted">
                      {consultation.patient_name || 'No Patient'} - {consultation.appointment_id || 'Unknown Appointment'}
                    </small>
                  </div>
                  <span className={getStatusBadge(consultation.Status)}>
                    {consultation.Status || 'Unknown'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaStethoscope className="me-2 text-muted" size={14} />
                    <span>{consultation.appointment_date || 'N/A'}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaNotesMedical className="me-2 text-muted" size={14} />
                    <span>Token #{consultation.token_no || 'N/A'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-muted">Created: {new Date(consultation.Created_At).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-3">
                  <label className="form-label small fw-bold">Notes:</label>
                  {editingConsultation === consultation.id ? (
                    <div>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add consultation notes..."
                      />
                      <div className="mt-2">
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleUpdateNotes(consultation.id)}
                          disabled={updating}
                        >
                          {updating ? <FaSpinner className="fa-spin me-1" /> : <FaSave className="me-1" />}
                          Save Notes
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancelEdit}
                        >
                          <FaTimes className="me-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted small mb-2">
                        {consultation.Notes || 'No notes added yet'}
                      </p>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEditConsultation(consultation)}
                      >
                        <FaEdit className="me-1" />
                        {consultation.Notes ? 'Edit Notes' : 'Add Notes'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Update Section */}
                <div className="mb-3">
                  <label className="form-label small fw-bold">Status:</label>
                  {editingConsultation === consultation.id ? (
                    <div>
                      <select
                        className="form-select form-select-sm"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <div className="mt-2">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleUpdateStatus(consultation.id)}
                          disabled={updating || !editStatus}
                        >
                          {updating ? <FaSpinner className="fa-spin me-1" /> : <FaSave className="me-1" />}
                          Update Status
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancelEdit}
                        >
                          <FaTimes className="me-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className={`badge ${getStatusBadge(consultation.Status)}`}>
                        {consultation.Status || 'Unknown'}
                      </span>
                      <button
                        className="btn btn-outline-warning btn-sm ms-2"
                        onClick={() => handleEditConsultation(consultation)}
                      >
                        <FaEdit className="me-1" />
                        Change Status
                      </button>
                    </div>
                  )}
                </div>

                {/* Patient Details */}
                <div className="row small text-muted">
                  <div className="col-6">ID: {consultation.patient_id || 'N/A'}</div>
                  <div className="col-6">Age: {consultation.patient_age || 'N/A'}</div>
                  <div className="col-6">Gender: {consultation.patient_gender || 'N/A'}</div>
                  <div className="col-6">Phone: {consultation.patient_phone || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConsultations.length === 0 && (
        <div className="text-center py-5">
          <FaStethoscope size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No consultations found</h5>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ConsultationsSection;
