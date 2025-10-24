import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Row, Col, 
  Alert, Spinner, Badge, Card, ListGroup 
} from 'react-bootstrap';
import { ReceptionistApi } from '../../service/AdminApi';

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
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    DoctorId: '',
    TokenNo: '',
    Date: '',
    Status: 'SCHEDULED'
  });

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
      const response = await ReceptionistApi.getAllPatients();
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
      const response = await ReceptionistApi.createPatient(patientForm);
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
      const response = await ReceptionistApi.getAllAppointments();
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
      const response = await ReceptionistApi.getAllDoctors();
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

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await ReceptionistApi.createAppointment(appointmentForm);
      setSuccess('Appointment booked successfully');
      setShowAppointmentModal(false);
      setAppointmentForm({
        DoctorId: '',
        TokenNo: '',
        Date: '',
        Status: 'SCHEDULED'
      });
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment');
      console.error('Error creating appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recent Activity Functions
  const loadRecentActivity = async () => {
    try {
      // Combine recent patients and appointments
      const [patientsRes, appointmentsRes] = await Promise.all([
        ReceptionistApi.getAllPatients(),
        ReceptionistApi.getAllAppointments()
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
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center">
                <Spinner animation="border" size="sm" /> Loading patients...
              </td>
            </tr>
          ) : patients.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No patients found
              </td>
            </tr>
          ) : (
            patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.PatientId}</td>
                <td>{patient.Name}</td>
                <td>{patient.Age}</td>
                <td>{patient.Gender}</td>
                <td>{patient.PhoneNumber}</td>
                <td>
                  <Badge bg={patient.IsActive ? 'success' : 'secondary'}>
                    {patient.IsActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm">
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

      {/* Hidden button for external trigger */}
      <Button 
        id="add-patient-btn" 
        style={{ display: 'none' }} 
        onClick={() => setShowPatientModal(true)}
      />
    </>
  );

  const renderAppointmentManagement = () => (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Appointment ID</th>
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
              <td colSpan="7" className="text-center">
                <Spinner animation="border" size="sm" /> Loading appointments...
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No appointments found
              </td>
            </tr>
          ) : (
            appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.AppointmentId}</td>
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
                  <Button variant="outline-primary" size="sm">
                    <i className="fas fa-eye"></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Add Appointment Modal */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book New Appointment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAppointmentSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Doctor *</Form.Label>
                  <Form.Select
                    name="DoctorId"
                    value={appointmentForm.DoctorId}
                    onChange={(e) => setAppointmentForm({...appointmentForm, [e.target.name]: e.target.value})}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="Date"
                    value={appointmentForm.Date}
                    onChange={(e) => setAppointmentForm({...appointmentForm, [e.target.name]: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Token Number *</Form.Label>
                  <Form.Control
                    type="number"
                    name="TokenNo"
                    value={appointmentForm.TokenNo}
                    onChange={(e) => setAppointmentForm({...appointmentForm, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="Status"
                    value={appointmentForm.Status}
                    onChange={(e) => setAppointmentForm({...appointmentForm, [e.target.name]: e.target.value})}
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Book Appointment'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Hidden button for external trigger */}
      <Button 
        id="add-appointment-btn" 
        style={{ display: 'none' }} 
        onClick={() => setShowAppointmentModal(true)}
      />
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
