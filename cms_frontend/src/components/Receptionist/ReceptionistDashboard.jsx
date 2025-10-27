import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Row, Col, 
  Alert, Spinner, Badge, Card, ListGroup 
} from 'react-bootstrap';
import { PatientManagementApi, AppointmentManagementApi, DoctorManagementApi } from '../../service/ReceptionistApi';

function ReceptionistDashboard({ selectedSection }) {
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Patient Management State
  const [patients, setPatients] = useState([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientForm, setPatientForm] = useState({
    Name: '',
    Age: '',
    Height: '',
    Weight: '',
    Gender: '',
    DOB: '',
    PhoneNumber: '',
    EmergencyNumber: '',
    Address: '',
    IsActive: true
  });

  // Appointment Management State
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  
  // Sequential appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    PatientId: '',
    Specialization: '',
    DoctorId: '',
    Date: '',
    TokenNo: '',
    Status: 'SCHEDULED'
  });
  
  // Track step completion for conditional enabling
  const [formSteps, setFormSteps] = useState({
    step1: false, // Patient ID entered
    step2: false, // Specialization selected
    step3: false, // Doctor selected
    step4: false, // Date selected
    step5: false  // Token generated
  });
  
  // Auto-generated token number
  const [generatedToken, setGeneratedToken] = useState(null);

  // Recent Activity State
  const [recentActivity, setRecentActivity] = useState([]);

  // Load data based on selected section
  useEffect(() => {
    switch (selectedSection) {
      case 'patients':
        loadPatients();
        break;
      case 'appointments':
        loadAppointments();
        loadDoctors();
        break;
      case 'overview':
        loadPatients();
        loadAppointments();
        loadDoctors();
        loadRecentActivity();
        break;
      default:
        break;
    }
  }, [selectedSection]);

  // Patient Management Functions
  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await PatientManagementApi.getAll();
      console.log('Patients API response:', response);
      
      // Handle different response structures
      let patientsData = [];
      if (Array.isArray(response.data)) {
        patientsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        patientsData = response.data.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        patientsData = response.data.results;
      }
      
      setPatients(patientsData);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await PatientManagementApi.create(patientForm);
      setSuccess('Patient created successfully');
      setShowPatientModal(false);
      setPatientForm({
        Name: '',
        Age: '',
        Height: '',
        Weight: '',
        Gender: '',
        DOB: '',
        PhoneNumber: '',
        EmergencyNumber: '',
        Address: '',
        IsActive: true
      });
      loadPatients();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create patient');
      console.error('Error creating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  // Appointment Management Functions
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await AppointmentManagementApi.getAll();
      console.log('Appointments API response:', response);
      
      // Handle different response structures
      let appointmentsData = [];
      if (Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        appointmentsData = response.data.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        appointmentsData = response.data.results;
      }
      
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await DoctorManagementApi.getAll();
      console.log('Doctors API response:', response);
      
      // Handle different response structures
      let doctorsData = [];
      if (Array.isArray(response.data)) {
        doctorsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        doctorsData = response.data.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        doctorsData = response.data.results;
      }
      
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Error loading doctors:', err);
    }
  };

  // Load specializations
  const loadSpecializations = async () => {
    try {
      const response = await DoctorManagementApi.getSpecializations();
      console.log('Specializations API response:', response);
      let specs = [];
      
      // Handle the backend response structure: { success: true, data: [...], count: n }
      if (response.data?.success && Array.isArray(response.data.data)) {
        specs = response.data.data;
      } else if (Array.isArray(response.data)) {
        specs = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        specs = response.data.data;
      }
      
      console.log('Loaded specializations:', specs);
      setSpecializations(specs);
    } catch (err) {
      console.error('Error loading specializations:', err);
      console.error('Error response:', err.response);
      setSpecializations([]);
    }
  };

  // Load available doctors based on specialization
  const loadAvailableDoctors = async (specializationId) => {
    try {
      const response = await DoctorManagementApi.getAvailableDoctors(specializationId);
      console.log('Available doctors API response:', response);
      let doctors = [];
      
      // Handle response structure
      if (response.data?.data && Array.isArray(response.data.data)) {
        doctors = response.data.data;
      } else if (Array.isArray(response.data)) {
        doctors = response.data;
      }
      
      // Filter only active doctors
      const activeDoctors = doctors.filter(d => 
        d.is_active === true || d.IsActive === true ||
        d.is_available === true || d.IsAvailable === true
      );
      
      console.log('Available doctors after filtering:', activeDoctors);
      setAvailableDoctors(activeDoctors);
    } catch (err) {
      console.error('Error loading available doctors:', err);
      console.error('Error response:', err.response);
      setAvailableDoctors([]);
    }
  };

  // Load available dates for selected doctor
  const loadAvailableDates = async (doctorId) => {
    try {
      const response = await DoctorManagementApi.getAvailableDates(doctorId);
      console.log('Available dates API response:', response);
      let dates = [];
      
      // Handle response structure
      if (response.data?.data && Array.isArray(response.data.data)) {
        dates = response.data.data;
      } else if (Array.isArray(response.data)) {
        dates = response.data;
      }
      
      console.log('Available dates:', dates);
      setAvailableDates(dates);
    } catch (err) {
      console.error('Error loading available dates:', err);
      console.error('Error response:', err.response);
      setAvailableDates([]);
    }
  };

  // Generate token number based on 30-minute intervals
  const generateTokenNumber = (doctorId, date) => {
    if (!doctorId || !date) return null;
    
    // Get all appointments for this doctor on this date
    const existingAppointments = appointments.filter(apt => 
      apt.DoctorId === doctorId && apt.Date === date
    );
    
    // Count appointments and add 1
    const tokenNo = existingAppointments.length + 1;
    setGeneratedToken(tokenNo);
    return tokenNo;
  };

  // Handle Patient ID input
  const handlePatientIdChange = (e) => {
    const patientId = e.target.value;
    setAppointmentForm(prev => ({ ...prev, PatientId: patientId }));
    setFormSteps(prev => ({ ...prev, step1: !!patientId }));
    
    // Reset later steps
    if (!patientId) {
      setFormSteps({ step1: false, step2: false, step3: false, step4: false, step5: false });
      setAppointmentForm({ ...appointmentForm, Specialization: '', DoctorId: '', Date: '', TokenNo: '' });
    }
  };

  // Handle Specialization selection
  const handleSpecializationChange = (e) => {
    const specializationId = e.target.value;
    setAppointmentForm(prev => ({ ...prev, Specialization: specializationId }));
    setFormSteps(prev => ({ ...prev, step2: !!specializationId }));
    
    if (specializationId) {
      loadAvailableDoctors(specializationId);
    } else {
      setAvailableDoctors([]);
      setFormSteps(prev => ({ ...prev, step2: false, step3: false, step4: false, step5: false }));
    }
  };

  // Handle Doctor selection
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setAppointmentForm(prev => ({ ...prev, DoctorId: doctorId }));
    setFormSteps(prev => ({ ...prev, step3: !!doctorId }));
    
    if (doctorId) {
      loadAvailableDates(doctorId);
    } else {
      setAvailableDates([]);
      setFormSteps(prev => ({ ...prev, step3: false, step4: false, step5: false }));
    }
  };

  // Handle Date selection
  const handleDateChange = (e) => {
    const date = e.target.value;
    setAppointmentForm(prev => ({ ...prev, Date: date }));
    setFormSteps(prev => ({ ...prev, step4: !!date }));
    
    if (date && appointmentForm.DoctorId) {
      const token = generateTokenNumber(appointmentForm.DoctorId, date);
      setAppointmentForm(prev => ({ ...prev, TokenNo: token }));
      setFormSteps(prev => ({ ...prev, step5: !!token }));
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use generated token if available
      const finalToken = generatedToken || appointmentForm.TokenNo;
      const payload = {
        ...appointmentForm,
        TokenNo: finalToken
      };
      
      const response = await AppointmentManagementApi.create(payload);
      setSuccess('Appointment booked successfully');
      setShowAppointmentModal(false);
      
      // Reset form
      setAppointmentForm({
        PatientId: '',
        Specialization: '',
        DoctorId: '',
        Date: '',
        TokenNo: '',
        Status: 'SCHEDULED'
      });
      setFormSteps({
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false
      });
      setGeneratedToken(null);
      setAvailableDoctors([]);
      setAvailableDates([]);
      
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment');
      console.error('Error creating appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load specializations and patients when modal opens
  useEffect(() => {
    if (showAppointmentModal) {
      loadSpecializations();
      // Also ensure patients are loaded
      if (patients.length === 0) {
        loadPatients();
      }
    }
  }, [showAppointmentModal]);

  // Recent Activity Functions
  const loadRecentActivity = async () => {
    try {
      // Combine recent patients and appointments
      const [patientsRes, appointmentsRes] = await Promise.all([
        PatientManagementApi.getAll(),
        AppointmentManagementApi.getAll()
      ]);
      
      // Handle different response structures for patients
      let patientsData = [];
      if (Array.isArray(patientsRes.data)) {
        patientsData = patientsRes.data;
      } else if (patientsRes.data?.data && Array.isArray(patientsRes.data.data)) {
        patientsData = patientsRes.data.data;
      } else if (patientsRes.data?.results && Array.isArray(patientsRes.data.results)) {
        patientsData = patientsRes.data.results;
      }
      
      // Handle different response structures for appointments
      let appointmentsData = [];
      if (Array.isArray(appointmentsRes.data)) {
        appointmentsData = appointmentsRes.data;
      } else if (appointmentsRes.data?.data && Array.isArray(appointmentsRes.data.data)) {
        appointmentsData = appointmentsRes.data.data;
      } else if (appointmentsRes.data?.results && Array.isArray(appointmentsRes.data.results)) {
        appointmentsData = appointmentsRes.data.results;
      }
      
      const recentPatients = patientsData.slice(0, 5);
      const recentAppointments = appointmentsData.slice(0, 5);
      
      const activity = [
        ...recentPatients.map(patient => ({
          type: 'patient',
          message: `New patient ${patient.Name} registered`,
          time: patient.Created_At || new Date().toISOString(),
          id: patient.PatientId
        })),
        ...recentAppointments.map(appointment => ({
          type: 'appointment',
          message: `Appointment ${appointment.AppointmentId} booked`,
          time: appointment.Created_At || new Date().toISOString(),
          id: appointment.AppointmentId
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
      
      setRecentActivity(activity);
    } catch (err) {
      console.error('Error loading recent activity:', err);
    }
  };

  // Render based on component type
  const renderPatientManagement = () => (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {/* Add Patient Button */}
      <div className="d-flex justify-content-between align-items-center mb-4 receptionist-section-header">
        <h4>Patient Management</h4>
        <Button 
          variant="primary" 
          onClick={() => setShowPatientModal(true)}
          className="d-flex align-items-center receptionist-add-button"
        >
          <i className="fas fa-plus me-2"></i>
          Add Patient
        </Button>
      </div>
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Phone Number</th>
            <th>Emergency Contact</th>
            <th>Address</th>
            <th>Height (cm)</th>
            <th>Weight (kg)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="12" className="text-center">
                <Spinner animation="border" size="sm" /> Loading patients...
              </td>
            </tr>
          ) : patients.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center text-muted">
                No patients found
              </td>
            </tr>
          ) : (
            patients.map(patient => (
              <tr key={patient.id || patient.PatientId}>
                <td>{patient.PatientId || patient.id}</td>
                <td>{patient.Name || patient.name}</td>
                <td>{patient.Age || patient.age}</td>
                <td>{patient.Gender || patient.gender}</td>
                <td>{patient.DOB ? new Date(patient.DOB).toLocaleDateString() : (patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A')}</td>
                <td>{patient.PhoneNumber || patient.phone_number || patient.phone}</td>
                <td>{patient.EmergencyNumber || patient.emergency_number || patient.emergency_contact || 'N/A'}</td>
                <td>{patient.Address || patient.address || 'N/A'}</td>
                <td>{patient.Height || patient.height || 'N/A'}</td>
                <td>{patient.Weight || patient.weight || 'N/A'}</td>
                <td>
                  <Badge bg={patient.IsActive !== false ? 'success' : 'secondary'}>
                    {patient.IsActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" title="View Details">
                    <i className="fas fa-eye"></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Add Patient Modal */}
      <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Patient</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePatientSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    name="Name"
                    value={patientForm.Name}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Age *</Form.Label>
                  <Form.Control
                    type="number"
                    name="Age"
                    value={patientForm.Age}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select
                    name="Gender"
                    value={patientForm.Gender}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Birth *</Form.Label>
                  <Form.Control
                    type="date"
                    name="DOB"
                    value={patientForm.DOB}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Height (cm) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="Height"
                    value={patientForm.Height}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Weight (kg) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="Weight"
                    value={patientForm.Weight}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    name="PhoneNumber"
                    value={patientForm.PhoneNumber}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Emergency Number *</Form.Label>
                  <Form.Control
                    name="EmergencyNumber"
                    value={patientForm.EmergencyNumber}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="Address"
                    value={patientForm.Address}
                    onChange={(e) => setPatientForm({...patientForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPatientModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Add Patient'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </>
  );

  const renderAppointmentManagement = () => (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {/* Add Appointment Button */}
      <div className="d-flex justify-content-between align-items-center mb-4 receptionist-section-header">
        <h4>Appointment Management</h4>
        <Button 
          variant="success" 
          onClick={() => setShowAppointmentModal(true)}
          className="d-flex align-items-center receptionist-add-button"
        >
          <i className="fas fa-plus me-2"></i>
          Book Appointment
        </Button>
      </div>
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Date</th>
            <th>Token</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                <Spinner animation="border" size="sm" /> Loading appointments...
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No appointments found
              </td>
            </tr>
          ) : (
            appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.AppointmentId}</td>
                <td>
                  {appointment.patient_name || 
                   (appointment.PatientId ? `Patient ID: ${appointment.PatientId}` : 'N/A')}
                </td>
                <td>{appointment.doctor_name}</td>
                <td>{appointment.doctor_specialization}</td>
                <td>{appointment.Date}</td>
                <td>{appointment.TokenNo}</td>
                <td>
                  <Badge bg={
                    appointment.Status === 'COMPLETED' ? 'success' :
                    appointment.Status === 'CANCELLED' ? 'danger' :
                    appointment.Status === 'IN_PROGRESS' ? 'warning' : 'primary'
                  }>
                    {appointment.Status}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" title="View Details">
                    <i className="fas fa-eye"></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Add Appointment Modal - Sequential Flow */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book New Appointment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAppointmentSubmit}>
          <Modal.Body>
            <Row className="g-3">
              {/* Step 1: Patient ID */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Patient ID *</Form.Label>
                  <Form.Select
                    value={appointmentForm.PatientId}
                    onChange={handlePatientIdChange}
                    required
                    style={{ 
                      backgroundColor: formSteps.step1 ? '#e8f5e9' : '#fff',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id || patient.PatientId} value={patient.id || patient.PatientId}>
                        {patient.PatientId || patient.id} - {patient.Name || patient.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Step 1 of 6: Select a patient to continue
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Step 2: Specialization */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Specialization *</Form.Label>
                  <Form.Select
                    name="Specialization"
                    value={appointmentForm.Specialization}
                    onChange={handleSpecializationChange}
                    required
                    disabled={!formSteps.step1}
                    style={{ 
                      backgroundColor: formSteps.step2 ? '#e8f5e9' : !formSteps.step1 ? '#f5f5f5' : '#fff',
                      cursor: formSteps.step1 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <option value="">
                      {formSteps.step1 ? 'Select Specialization' : 'Complete Patient ID first'}
                    </option>
                    {formSteps.step1 && specializations.map(spec => (
                      <option key={spec.id || spec.SpecializationId} value={spec.id || spec.SpecializationId}>
                        {spec.name || spec.SpecializationName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Step 2 of 6: Select a specialization to filter doctors
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Step 3: Available Doctors */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Available Doctors *</Form.Label>
                  <Form.Select
                    name="DoctorId"
                    value={appointmentForm.DoctorId}
                    onChange={handleDoctorChange}
                    required
                    disabled={!formSteps.step2}
                    style={{ 
                      backgroundColor: formSteps.step3 ? '#e8f5e9' : !formSteps.step2 ? '#f5f5f5' : '#fff',
                      cursor: formSteps.step2 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <option value="">
                      {formSteps.step2 ? (availableDoctors.length > 0 ? 'Select Doctor' : 'No available doctors') : 'Complete Specialization first'}
                    </option>
                    {formSteps.step2 && availableDoctors.map(doctor => (
                      <option key={doctor.DoctorId || doctor.id} value={doctor.DoctorId || doctor.id}>
                        Dr. {doctor.first_name || doctor.FirstName} {doctor.last_name || doctor.LastName} 
                        {doctor.consultation_fee && ` - Fee: ₹${doctor.consultation_fee || doctor.ConsultationFee}`}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Step 3 of 6: Choose an available doctor from the list
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Step 4: Date Selection */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Appointment Date *</Form.Label>
                  {availableDates.length > 0 ? (
                    <>
                      <Form.Select
                        value={appointmentForm.Date}
                        onChange={handleDateChange}
                        required
                        disabled={!formSteps.step3}
                        style={{ 
                          backgroundColor: formSteps.step4 ? '#e8f5e9' : !formSteps.step3 ? '#f5f5f5' : '#fff',
                          cursor: formSteps.step3 ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <option value="">Select an available date</option>
                        {availableDates.map(date => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Step 4 of 6: Select from available dates based on doctor's consultation schedule
                      </Form.Text>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        type="date"
                        name="Date"
                        value={appointmentForm.Date}
                        onChange={handleDateChange}
                        required
                        disabled={!formSteps.step3}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ 
                          backgroundColor: !formSteps.step3 ? '#f5f5f5' : '#fff',
                          cursor: formSteps.step3 ? 'pointer' : 'not-allowed'
                        }}
                      />
                      <Form.Text className="text-warning">
                        Step 4 of 6: No available dates for this doctor. Please select another doctor.
                      </Form.Text>
                    </>
                  )}
                </Form.Group>
              </Col>

              {/* Step 5: Auto-generated Token */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Token Number (Auto-generated)</Form.Label>
                  <Form.Control
                    type="number"
                    value={generatedToken || appointmentForm.TokenNo || ''}
                    readOnly
                    disabled
                    style={{ 
                      backgroundColor: formSteps.step5 ? '#e3f2fd' : '#f5f5f5',
                      cursor: 'default',
                      fontWeight: 'bold'
                    }}
                  />
                  <Form.Text className="text-success">
                    {formSteps.step5 ? `✓ Token generated automatically` : 'Complete date selection to generate token'}
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Step 6: Status (defaults to Scheduled) */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="Status"
                    value={appointmentForm.Status}
                    onChange={(e) => setAppointmentForm({...appointmentForm, [e.target.name]: e.target.value})}
                  >
                    <option value="SCHEDULED">Scheduled</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Default status: Scheduled
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowAppointmentModal(false);
                // Reset form
                setAppointmentForm({
                  PatientId: '',
                  Specialization: '',
                  DoctorId: '',
                  Date: '',
                  TokenNo: '',
                  Status: 'SCHEDULED'
                });
                setFormSteps({
                  step1: false,
                  step2: false,
                  step3: false,
                  step4: false,
                  step5: false
                });
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="success" 
              type="submit" 
              disabled={loading || !formSteps.step5}
            >
              {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Booking...</> : 'Book Appointment'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </>
  );

  const renderOverview = () => (
    <div>
      <h4>Dashboard Overview</h4>
      <p>Welcome to the Receptionist Dashboard. Here you can manage patients, appointments, and view key statistics.</p>
      
      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <div className="stat-icon bg-primary">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="stat-number">{patients.length}</h3>
              <p className="stat-label">Total Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <div className="stat-icon bg-success">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3 className="stat-number">{appointments.length}</h3>
              <p className="stat-label">Total Appointments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <div className="stat-icon bg-warning">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="stat-number">
                {appointments.filter(apt => apt.Status === 'SCHEDULED').length}
              </h3>
              <p className="stat-label">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <div className="stat-icon bg-info">
                <i className="fas fa-user-md"></i>
              </div>
              <h3 className="stat-number">{doctors.length}</h3>
              <p className="stat-label">Available Doctors</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-history me-2"></i>
            Recent Activity
          </h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {recentActivity.length === 0 ? (
              <ListGroup.Item className="text-center text-muted">
                No recent activity
              </ListGroup.Item>
            ) : (
              recentActivity.map((activity, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className={`fas ${activity.type === 'patient' ? 'fa-user-plus' : 'fa-calendar-plus'} me-2`}></i>
                    {activity.message}
                  </div>
                  <small className="text-muted">
                    {new Date(activity.time).toLocaleDateString()}
                  </small>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );

  // Main render
  switch (selectedSection) {
    case 'patients':
      return renderPatientManagement();
    case 'appointments':
      return renderAppointmentManagement();
    case 'overview':
      return renderOverview();
    default:
      return renderOverview();
  }
}

export default ReceptionistDashboard;


