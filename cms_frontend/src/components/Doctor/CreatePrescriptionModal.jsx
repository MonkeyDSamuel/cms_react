import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaPills, FaFlask } from 'react-icons/fa';
import { ConsultationApi, MedicinePrescriptionsApi, LabTestPrescriptionsApi } from '../../service/DoctorApi';

const CreatePrescriptionModal = ({ show, onHide, type, staffId }) => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState('');
  const [notes, setNotes] = useState('');
  // Lab test specific fields
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('');
  const [testInstructions, setTestInstructions] = useState('');
  const [testFastingRequired, setTestFastingRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Load consultations when modal opens
  useEffect(() => {
    if (show) {
      loadConsultations();
    }
  }, [show, staffId, type]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await ConsultationApi.getAll();
      const consultationsData = response.data?.results || response.data || [];
      setConsultations(consultationsData);
    } catch (err) {
      console.error('Error loading consultations:', err);
      setError('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!selectedConsultation) {
      errors.selectedConsultation = 'Please select a consultation';
    }

    try {
      // Validate notes length (optional but limited)
      if (notes && notes.trim().length > 1000) {
        errors.notes = 'Notes cannot exceed 1000 characters';
      }

      // Lab validations
      if (type === 'lab') {
        if (!testName.trim()) errors.testName = 'Test name is required';
        if (!testType.trim()) errors.testType = 'Test type is required';
        if (!testInstructions.trim()) errors.testInstructions = 'Test instructions are required';
        if (testName.length > 120) errors.testName = 'Test name is too long';
        if (testType.length > 120) errors.testType = 'Test type is too long';
        if (testInstructions.length > 1000) errors.testInstructions = 'Instructions cannot exceed 1000 characters';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setValidationErrors({});
      setLoading(true);
      setError('');
      setSuccess('');

      const prescriptionData = {
        consultation: selectedConsultation,
        Notes: notes.trim() || null
      };

      // Add lab test fields if creating lab prescription
      if (type === 'lab') {
        if (!testName.trim()) {
          setError('Please enter test name');
          return;
        }
        if (!testType.trim()) {
          setError('Please enter test type');
          return;
        }
        if (!testInstructions.trim()) {
          setError('Please enter test instructions');
          return;
        }
        prescriptionData.test_name = testName.trim();
        prescriptionData.test_type = testType.trim();
        prescriptionData.test_instructions = testInstructions.trim();
        prescriptionData.test_fasting_required = testFastingRequired;
      }

      let response;
      if (type === 'medicine') {
        response = await MedicinePrescriptionsApi.create(prescriptionData);
      } else if (type === 'lab') {
        response = await LabTestPrescriptionsApi.create(prescriptionData);
      }

      if (response.data) {
        setSuccess(`${type === 'medicine' ? 'Medicine' : 'Lab test'} prescription created successfully!`);
        
        // Trigger dashboard refresh
        if (window.refreshDoctorDashboard) {
          window.refreshDoctorDashboard();
        }
        if (window.refreshPrescriptions) {
          window.refreshPrescriptions();
        }
        
        setTimeout(() => {
          onHide();
          setSuccess('');
          setSelectedConsultation('');
          setNotes('');
          setTestName('');
          setTestType('');
          setTestInstructions('');
          setTestFastingRequired(false);
        }, 2000);
      }
    } catch (err) {
      console.error(`Error creating ${type} prescription:`, err);
      setError(`Failed to create ${type} prescription: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setSelectedConsultation('');
    setNotes('');
    setTestName('');
    setTestType('');
    setTestInstructions('');
    setTestFastingRequired(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {type === 'medicine' ? (
            <>
              <FaPills className="me-2 text-primary" />
              Create Medicine Prescription
            </>
          ) : (
            <>
              <FaFlask className="me-2 text-info" />
              Create Lab Test Prescription
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Consultation *</Form.Label>
            <Form.Select
              value={selectedConsultation}
              onChange={(e) => setSelectedConsultation(e.target.value)}
              required
              isInvalid={!!validationErrors.selectedConsultation}
            >
              <option value="">Choose a consultation...</option>
              {consultations.map((consultation) => (
                <option key={consultation.id} value={consultation.id}>
                  {consultation.consultationId} - {consultation.patient_name} ({consultation.appointment_date})
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Select the consultation for which you want to create this prescription
            </Form.Text>
          </Form.Group>
          {validationErrors.selectedConsultation && (
            <div className="text-danger small mb-2">{validationErrors.selectedConsultation}</div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Enter notes for this ${type === 'medicine' ? 'medicine' : 'lab test'} prescription...`}
            />
            <Form.Text className="text-muted">
              Optional: Add any specific instructions or notes for this prescription
            </Form.Text>
          </Form.Group>

          {/* Lab Test Fields */}
          {type === 'lab' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Test Name</Form.Label>
                <Form.Control
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Enter test name (e.g., Complete Blood Count)"
                  required
                  isInvalid={!!validationErrors.testName}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.testName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Test Type</Form.Label>
                <Form.Control
                  type="text"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  placeholder="Enter test type (e.g., Blood Test, Urine Test)"
                  required
                  isInvalid={!!validationErrors.testType}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.testType}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Test Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={testInstructions}
                  onChange={(e) => setTestInstructions(e.target.value)}
                  placeholder="Enter specific instructions for the test"
                  required
                  isInvalid={!!validationErrors.testInstructions}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.testInstructions}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Fasting Required"
                  checked={testFastingRequired}
                  onChange={(e) => setTestFastingRequired(e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Check if the patient needs to fast before this test
                </Form.Text>
              </Form.Group>
            </>
          )}

          {selectedConsultation && (
            <div className="mb-3 p-3 bg-light rounded">
              <h6>Consultation Details:</h6>
              {(() => {
                const consultation = consultations.find(c => c.id.toString() === selectedConsultation);
                return consultation ? (
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Patient: {consultation.patient_name}</small>
                      <small className="text-muted d-block">Appointment: {consultation.appointment_id}</small>
                      <small className="text-muted d-block">Date: {consultation.appointment_date}</small>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Token: #{consultation.token_no}</small>
                      <small className="text-muted d-block">Status: {consultation.Status}</small>
                      <small className="text-muted d-block">Doctor: {consultation.doctor_name}</small>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant={type === 'medicine' ? 'primary' : 'info'} 
              type="submit"
              disabled={loading || !selectedConsultation}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                `Create ${type === 'medicine' ? 'Medicine' : 'Lab Test'} Prescription`
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePrescriptionModal;
