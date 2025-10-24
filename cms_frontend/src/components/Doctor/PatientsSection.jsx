import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaSearch, FaPlus, FaEye, FaEdit, FaFileMedicalAlt, FaSpinner } from 'react-icons/fa';
import { PatientsApi } from '../../service/DoctorApi';

const PatientsSection = ({ staffId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load patients from backend
  useEffect(() => {
    const loadPatients = async () => {
      if (!staffId) return;
      
      setLoading(true);
      setError('');
      
      try {
        console.log('Loading patients for staffId:', staffId);
        const response = await PatientsApi.getAll();
        console.log('Patients API response:', response);
        console.log('Response data:', response.data);
        console.log('Response data type:', typeof response.data);
        console.log('Response data keys:', Object.keys(response.data || {}));
        
        // Handle Django REST Framework pagination structure
        let patientsData = [];
        if (response.data && Array.isArray(response.data.results)) {
          // Standard DRF pagination format
          patientsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          // Direct array response
          patientsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          // Custom data wrapper
          patientsData = response.data.data;
        } else if (response.data && response.data.patients) {
          // Custom patients wrapper
          patientsData = response.data.patients;
        }
        
        console.log('Processed patients data:', patientsData);
        
        // Ensure we have an array
        if (Array.isArray(patientsData)) {
          setPatients(patientsData);
        } else {
          console.warn('Patients data is not an array:', patientsData);
          setPatients([]);
        }
      } catch (err) {
        console.error('Error loading patients:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(`Failed to load patients: ${err.response?.data?.detail || err.message}`);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [staffId]);

  // Filter patients safely
  const filteredPatients = Array.isArray(patients) ? patients.filter(patient => {
    const name = patient.Name || patient.name || 'Unknown';
    const email = patient.Email || patient.email || '';
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  const getStatusBadge = (status) => {
    const isActive = status === 'Active' || status === 'ACTIVE' || status === true;
    return isActive ? 'bg-success' : 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center">
            <FaSpinner className="fa-spin text-primary mb-3" size={48} />
            <h5>Loading patients...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Patients</h4>
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
          <div key={patient.id || patient.PatientId} className="col-lg-6 col-xl-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">{patient.Name || patient.name || 'Unknown Patient'}</h6>
                    <small className="text-muted">
                      {patient.Age || patient.age || 'N/A'} years, {patient.Gender || patient.gender || 'N/A'}
                    </small>
                  </div>
                  <span className={`badge ${getStatusBadge(patient.IsActive || patient.isActive || patient.status)}`}>
                    {patient.IsActive || patient.isActive || patient.status ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">Phone</small>
                      <span className="small">{patient.PhoneNumber || patient.phone || 'N/A'}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">DOB</small>
                      <span className="small">{patient.DOB || patient.dob || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {patient.Address && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Address</small>
                    <span className="small">{patient.Address || patient.address}</span>
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
                <h5 className="modal-title">Patient Details - {selectedPatient.Name || selectedPatient.name || 'Unknown Patient'}</h5>
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
                    <p><strong>Name:</strong> {selectedPatient.Name || selectedPatient.name || 'N/A'}</p>
                    <p><strong>Age:</strong> {selectedPatient.Age || selectedPatient.age || 'N/A'}</p>
                    <p><strong>Gender:</strong> {selectedPatient.Gender || selectedPatient.gender || 'N/A'}</p>
                    <p><strong>Phone:</strong> {selectedPatient.PhoneNumber || selectedPatient.phone || 'N/A'}</p>
                    <p><strong>Emergency Contact:</strong> {selectedPatient.EmergencyNumber || selectedPatient.emergencyNumber || 'N/A'}</p>
                    <p><strong>DOB:</strong> {selectedPatient.DOB || selectedPatient.dob || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Additional Information</h6>
                    <p><strong>Address:</strong> {selectedPatient.Address || selectedPatient.address || 'N/A'}</p>
                    <p><strong>Height:</strong> {selectedPatient.Height || selectedPatient.height || 'N/A'}</p>
                    <p><strong>Weight:</strong> {selectedPatient.Weight || selectedPatient.weight || 'N/A'}</p>
                    <p><strong>Status:</strong> {selectedPatient.IsActive || selectedPatient.isActive ? 'Active' : 'Inactive'}</p>
                    <p><strong>Patient ID:</strong> {selectedPatient.PatientId || selectedPatient.id || 'N/A'}</p>
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

