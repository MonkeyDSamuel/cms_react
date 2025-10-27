import React, { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../elements/Admin/AdminSidebar';
import { StaffApi, DoctorApi, SpecializationApi } from '../../service/AdminApi';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';

function ViewStaff() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [staff, setStaff] = useState([]);
  const [toggling, setToggling] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    StaffApi.getAll()
      .then((res) => {
        console.log('Staff API response:', res);
        console.log('Response data:', res.data);
        const staffData = res.data?.data || res.data || [];
        console.log('Staff data extracted:', staffData);
        console.log('First staff member:', staffData[0]);
        setStaff(staffData);
      })
      .catch((err) => {
        console.error('Staff API error:', err);
        console.error('Error response:', err.response);
        setError(err?.response?.data?.detail || err.message || 'Failed to load staff');
      })
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    setToggling(prev => ({ ...prev, [staffId]: true }));
    try {
      const response = await StaffApi.toggleStatus(staffId);
      console.log('Toggle status response:', response);
      
      // Update the local state
      setStaff(prevStaff => 
        prevStaff.map(s => 
          s.id === staffId || s.staff_id === staffId 
            ? { ...s, is_active: !s.is_active }
            : s
        )
      );
      
      // Show success message
      setError('');
    } catch (err) {
      console.error('Toggle status error:', err);
      setError(err?.response?.data?.detail || err?.response?.data?.error || err.message || 'Failed to toggle status');
    } finally {
      setToggling(prev => ({ ...prev, [staffId]: false }));
    }
  };

  useEffect(() => { load(); }, []);

  // Filter staff based on search term
  const filteredStaff = useMemo(() => {
    if (!searchTerm.trim()) {
      return staff;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    return staff.filter(s => {
      const firstName = (s.first_name || s.FirstName || '').toLowerCase();
      const lastName = (s.last_name || s.LastName || '').toLowerCase();
      const email = (s.email || s.Email || '').toLowerCase();
      const staffId = (s.staff_id || s.StaffId || s.id || '').toString().toLowerCase();
      const contact = (s.contact || s.Contact || '').toLowerCase();
      
      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        email.includes(searchLower) ||
        staffId.includes(searchLower) ||
        contact.includes(searchLower)
      );
    });
  }, [staff, searchTerm]);

  if (loading) return <div className="p-3"><Spinner size="sm" className="me-2" /> Loading staff...</div>;
  if (error) return <div className="p-3"><Alert variant="danger">{error}</Alert></div>;
  
  // Show message if no staff found
  if (staff.length === 0) {
    return (
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">Staff List</h3>
          <Button size="sm" variant="outline-secondary" onClick={load}>Refresh</Button>
        </div>
        <Alert variant="info">
          No staff members found. Try adding some staff members using the "Add Staff" section.
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Staff List</h3>
        <Button size="sm" variant="outline-secondary" onClick={load}>Refresh</Button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, email, Staff ID, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ 
            fontSize: '16px', // Prevents zoom on mobile
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '2px solid #dee2e6'
          }}
        />
        {searchTerm && (
          <div className="mt-2 text-muted small">
            Showing {filteredStaff.length} of {staff.length} staff member(s)
          </div>
        )}
      </div>

      {filteredStaff.length === 0 ? (
        <Alert variant="info">
          No staff members match your search criteria.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>StaffId</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((s, index) => {
            console.log(`Staff member ${index}:`, s);
            const staffId = s.id || s.staff_id;
            const isActive = s.is_active;
            const isToggling = toggling[staffId];
            
            return (
              <tr key={staffId || index}>
                <td>{s.staff_id || s.StaffId || s.id}</td>
                <td>{s.first_name || s.FirstName || 'N/A'}</td>
                <td>{s.last_name || s.LastName || 'N/A'}</td>
                <td>{s.role_display || s.role || s.Role || 'N/A'}</td>
                <td>{s.email || s.Email || 'N/A'}</td>
                <td>{s.contact || s.Contact || 'N/A'}</td>
                <td>
                  <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant={isActive ? 'outline-danger' : 'outline-success'}
                    onClick={() => handleToggleStatus(staffId, isActive)}
                    disabled={isToggling}
                  >
                    {isToggling ? (
                      <><Spinner size="sm" className="me-1" /> {isActive ? 'Deactivating...' : 'Activating...'}</>
                    ) : (
                      isActive ? 'Deactivate' : 'Activate'
                    )}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      )}
    </div>
  );
}

function AddStaff() {
  const [form, setForm] = useState({
    user: { username: '', password: '', email: '', first_name: '', last_name: '' },
    Role: 'DOC',
    FirstName: '',
    LastName: '',
    DOB: '',
    Gender: 'M',
    BloodGroup: '',
    Address: '',
    Email: '',
    Contact: '',
  });
  const [doctorForm, setDoctorForm] = useState({
    specialization_id: '',
    ConsultationFee: '',
    ConsultationDays: '',
    ConsultationTime: '',
    YearsOfExperience: '',
    IsAvailable: true,
  });
  const [specializations, setSpecializations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddSpecialization, setShowAddSpecialization] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState({
    name: '',
    description: '',
    is_active: true
  });
  const [addingSpecialization, setAddingSpecialization] = useState(false);
  const [specializationError, setSpecializationError] = useState('');
  const [specializationSuccess, setSpecializationSuccess] = useState('');
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [consultationDays, setConsultationDays] = useState([]);
  const [consultationStartTime, setConsultationStartTime] = useState('');
  const [consultationEndTime, setConsultationEndTime] = useState('');

  // Day mapping for consultation days
  const dayMapping = {
    'Sunday': 1,
    'Monday': 2,
    'Tuesday': 3,
    'Wednesday': 4,
    'Thursday': 5,
    'Friday': 6,
    'Saturday': 7
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Function to calculate duration between two times
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    // Handle case where end time is next day
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours === 0) {
      return `${diffMinutes} minutes`;
    } else if (diffMinutes === 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return `${diffHours}h ${diffMinutes}m`;
    }
  };

  const handleDayToggle = (dayName) => {
    const dayValue = dayMapping[dayName];
    setConsultationDays(prev => {
      if (prev.includes(dayValue)) {
        return prev.filter(d => d !== dayValue);
      } else {
        return [...prev, dayValue].sort();
      }
    });
  };

  // Load specializations when role changes to DOC
  useEffect(() => {
    if (form.Role === 'DOC') {
      loadSpecializations();
    }
  }, [form.Role]);

  // Load specializations on component mount if role is already DOC
  useEffect(() => {
    if (form.Role === 'DOC' && specializations.length === 0) {
      loadSpecializations();
    }
  }, []);

  const loadSpecializations = () => {
    console.log('loadSpecializations called, current specializations:', specializations.length);
    setLoadingSpecializations(true);
    setSpecializationError('');
    console.log('Loading specializations...');
    
    SpecializationApi.getAll()
      .then((res) => {
        console.log('Specializations API response:', res);
        console.log('Response data:', res.data);
        
        // Handle different response structures
        let specializationsData = [];
        if (res.data) {
          if (Array.isArray(res.data)) {
            specializationsData = res.data;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            specializationsData = res.data.data;
          } else if (res.data.results && Array.isArray(res.data.results)) {
            specializationsData = res.data.results;
          }
        }
        
        console.log('Processed specializations:', specializationsData);
        console.log('First specialization:', specializationsData[0]);
        setSpecializations(specializationsData);
        console.log('Specializations loaded successfully, count:', specializationsData.length);
      })
      .catch((err) => {
        console.error('Failed to load specializations:', err);
        console.error('Error response:', err.response);
        setSpecializationError('Failed to load specializations');
      })
      .finally(() => {
        setLoadingSpecializations(false);
      });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('user.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, user: { ...prev.user, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onDoctorFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDoctorForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onNewSpecializationChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Specialization form change:', { name, value, type, checked });
    setNewSpecialization((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddSpecialization = async (e) => {
    console.log('handleAddSpecialization called with event:', e);
    e.preventDefault();
    setAddingSpecialization(true);
    setSpecializationError('');
    setSpecializationSuccess('');
    
    console.log('Adding specialization with payload:', newSpecialization);
    
    try {
      const response = await SpecializationApi.add(newSpecialization);
      console.log('Add specialization response:', response);
      
      // Reload specializations using the same logic as loadSpecializations
      const res = await SpecializationApi.getAll();
      console.log('Reloaded specializations after add:', res);
      
      // Handle different response structures
      let specializationsData = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          specializationsData = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          specializationsData = res.data.data;
        } else if (res.data.results && Array.isArray(res.data.results)) {
          specializationsData = res.data.results;
        }
      }
      
      setSpecializations(specializationsData);
      setShowAddSpecialization(false);
      setNewSpecialization({ name: '', description: '', is_active: true });
      setSpecializationSuccess('Specialization added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSpecializationSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Add specialization error:', err);
      console.error('Error response:', err.response);
      setSpecializationError(err?.response?.data?.detail || err.message || 'Failed to add specialization');
    } finally {
      setAddingSpecialization(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    setSpecializationError('');
    setSpecializationSuccess('');

    try {
      // Step 1: Create staff member
      console.log('DEBUG FRONTEND: Creating staff with form data:', form);
      const staffResponse = await StaffApi.add(form);
      console.log('DEBUG FRONTEND: Staff response:', staffResponse);
      const staffData = staffResponse.data?.data || staffResponse.data;
      console.log('DEBUG FRONTEND: Staff data extracted:', staffData);
      
      // Step 2: If role is DOC, create doctor profile
      if (form.Role === 'DOC') {
        // Validate consultation days and time
        if (consultationDays.length === 0) {
          setError('Please select at least one consultation day');
          return;
        }
        
        if (!consultationStartTime || !consultationEndTime) {
          setError('Please select both start and end times for consultation');
          return;
        }
        
        if (consultationStartTime >= consultationEndTime) {
          setError('End time must be after start time');
          return;
        }

        const doctorPayload = {
          staff_id: staffData.id || staffData.staff_id,
          specialization_id: Number(doctorForm.specialization_id),
          consultation_fee: Number(doctorForm.ConsultationFee),
          consultation_days: consultationDays, // Array of integers
          consultation_time: `${consultationStartTime}-${consultationEndTime}`, // 24-hour format
          years_of_experience: Number(doctorForm.YearsOfExperience),
          is_available: true, // Always true by default
        };
        
        console.log('DEBUG FRONTEND: Staff data received:', staffData);
        console.log('DEBUG FRONTEND: Doctor payload:', doctorPayload);
        console.log('DEBUG FRONTEND: Doctor form data:', doctorForm);
        
        await DoctorApi.create(doctorPayload);
        setSuccess('Staff member and doctor profile created successfully');
      } else {
        setSuccess('Staff member created successfully');
      }
      
      // Reset forms
      setForm({
        user: { username: '', password: '', email: '', first_name: '', last_name: '' },
        Role: 'DOC',
        FirstName: '',
        LastName: '',
        DOB: '',
        Gender: 'M',
        BloodGroup: '',
        Address: '',
        Email: '',
        Contact: '',
      });
      setDoctorForm({
        specialization_id: '',
        ConsultationFee: '',
        ConsultationDays: '',
        ConsultationTime: '',
        YearsOfExperience: '',
        IsAvailable: true,
      });
      setConsultationDays([]);
      setConsultationStartTime('');
      setConsultationEndTime('');
    } catch (err) {
      console.error('DEBUG FRONTEND: Error occurred:', err);
      console.error('DEBUG FRONTEND: Error response:', err.response);
      console.error('DEBUG FRONTEND: Error data:', err.response?.data);
      setError(err?.response?.data?.error || err?.response?.data?.detail || err.message || 'Failed to add staff');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3">
      <h3 className="mb-3">Add New Staff</h3>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}
      <Form onSubmit={onSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control name="user.username" value={form.user.username} onChange={onChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control name="user.password" type="password" value={form.user.password} onChange={onChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control name="FirstName" value={form.FirstName} onChange={onChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="LastName" value={form.LastName} onChange={onChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select name="Role" value={form.Role} onChange={onChange}>
                <option value="ADMIN">Admin</option>
                <option value="REC">Receptionist</option>
                <option value="DOC">Doctor</option>
                <option value="LTECH">Lab Technician</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Select name="Gender" value={form.Gender} onChange={onChange}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>DOB</Form.Label>
              <Form.Control type="date" name="DOB" value={form.DOB} onChange={onChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control name="Email" type="email" value={form.Email} onChange={onChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Contact</Form.Label>
              <Form.Control name="Contact" value={form.Contact} onChange={onChange} />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control name="Address" value={form.Address} onChange={onChange} />
            </Form.Group>
          </Col>
        </Row>

        {/* Doctor-specific fields - only show when role is DOC */}
        {form.Role === 'DOC' && (
          <>
            <hr className="my-4" />
            <h5 className="mb-3">Doctor Details</h5>
            
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Specialization *</Form.Label>
                  <div className="d-flex gap-2">
                    <select 
                      name="specialization_id" 
                      value={doctorForm.specialization_id} 
                      onChange={onDoctorFormChange}
                      onFocus={(e) => {
                        // Only load if specializations are empty and not already loading
                        if (specializations.length === 0 && !loadingSpecializations) {
                          console.log('Dropdown focused, loading specializations...');
                          loadSpecializations();
                        }
                      }}
                      required
                      className="form-select"
                      style={{ flex: 1 }}
                      disabled={loadingSpecializations}
                    >
                      <option value="">
                        {loadingSpecializations ? 'Loading...' : specializations.length === 0 ? 'Click to load specializations' : 'Select Specialization'}
                      </option>
                      {specializations.length > 0 ? (
                        specializations.filter(spec => spec.is_active || spec.IsActive).map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.name || spec.SpecializationName}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No specializations available
                        </option>
                      )}
                    </select>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={loadSpecializations}
                      disabled={loadingSpecializations}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {loadingSpecializations ? <Spinner size="sm" /> : '↻'}
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        setShowAddSpecialization(true);
                        // Auto-scroll to the specialization form after a short delay
                        setTimeout(() => {
                          const specializationForm = document.getElementById('add-specialization-form');
                          if (specializationForm) {
                            // Scroll to the form with some offset to account for fixed headers
                            const offset = 100;
                            const elementPosition = specializationForm.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                            
                            // Focus on the first input field
                            const firstInput = specializationForm.querySelector('input[name="name"]');
                            if (firstInput) {
                              setTimeout(() => firstInput.focus(), 500);
                            }
                          }
                        }, 300);
                      }}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      + Add New
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Consultation Fee *</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01"
                    name="ConsultationFee" 
                    value={doctorForm.ConsultationFee} 
                    onChange={onDoctorFormChange}
                    placeholder="e.g., 150.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Consultation Days *</Form.Label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {dayNames.map(day => (
                      <Button
                        key={day}
                        variant={consultationDays.includes(dayMapping[day]) ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={() => handleDayToggle(day)}
                        type="button"
                        style={{ 
                          minWidth: '80px',
                          transition: 'all 0.2s ease',
                          transform: consultationDays.includes(dayMapping[day]) ? 'scale(1.05)' : 'scale(1)'
                        }}
                        className="day-button"
                      >
                        <i className={`fas ${consultationDays.includes(dayMapping[day]) ? 'fa-check' : 'fa-circle'} me-1`}></i>
                        {day.substring(0, 3)}
                      </Button>
                    ))}
                  </div>
                  {consultationDays.length === 0 && (
                    <div className="text-danger small">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Please select at least one day
                    </div>
                  )}
                  {consultationDays.length > 0 && (
                    <div className="text-success small">
                      <i className="fas fa-check-circle me-1"></i>
                      Selected: {consultationDays.map(day => dayNames[day - 1]).join(', ')}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Consultation Time *</Form.Label>
                  <div className="d-flex gap-3 align-items-end">
                    <div className="flex-grow-1">
                      <Form.Label className="small text-muted mb-1">Start Time</Form.Label>
                      <Form.Control 
                        type="time"
                        value={consultationStartTime}
                        onChange={(e) => setConsultationStartTime(e.target.value)}
                        required
                        className="time-picker"
                        style={{ fontSize: '1rem', padding: '0.5rem' }}
                      />
                    </div>
                    <div className="d-flex align-items-center" style={{ paddingBottom: '0.5rem' }}>
                      <span className="text-muted">to</span>
                    </div>
                    <div className="flex-grow-1">
                      <Form.Label className="small text-muted mb-1">End Time</Form.Label>
                      <Form.Control 
                        type="time"
                        value={consultationEndTime}
                        onChange={(e) => setConsultationEndTime(e.target.value)}
                        required
                        className="time-picker"
                        style={{ fontSize: '1rem', padding: '0.5rem' }}
                      />
                    </div>
                  </div>
                  {consultationStartTime && consultationEndTime && consultationStartTime >= consultationEndTime && (
                    <div className="text-danger small mt-2">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      End time must be after start time
                    </div>
                  )}
                  {consultationStartTime && consultationEndTime && consultationStartTime < consultationEndTime && (
                    <div className="text-success small mt-2">
                      <i className="fas fa-check-circle me-1"></i>
                      Consultation duration: {calculateDuration(consultationStartTime, consultationEndTime)}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Years of Experience *</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="YearsOfExperience" 
                    value={doctorForm.YearsOfExperience} 
                    onChange={onDoctorFormChange}
                    placeholder="e.g., 5"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <div className="mt-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? (<><Spinner size="sm" className="me-2" /> Saving...</>) : 'Save'}
          </Button>
        </div>
      </Form>
      
      {/* Add New Specialization Form - Outside main form to avoid nesting */}
      {form.Role === 'DOC' && showAddSpecialization && (
        <div id="add-specialization-form" className="mt-4 p-3 border rounded bg-light">
          <h6 className="mb-3">Add New Specialization</h6>
          {specializationError ? <Alert variant="danger" className="mb-3">{specializationError}</Alert> : null}
          {specializationSuccess ? <Alert variant="success" className="mb-3">{specializationSuccess}</Alert> : null}
          <Form onSubmit={(e) => {
            console.log('Form onSubmit triggered');
            handleAddSpecialization(e);
          }}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Specialization Name *</Form.Label>
                  <Form.Control
                    name="name"
                    value={newSpecialization.name}
                    onChange={onNewSpecializationChange}
                    placeholder="e.g., Cardiology"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    value={newSpecialization.description}
                    onChange={onNewSpecializationChange}
                    placeholder="Brief description of the specialization"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    name="is_active"
                    checked={newSpecialization.is_active}
                    onChange={onNewSpecializationChange}
                    label="Active"
                    className="me-3"
                  />
                  <Button 
                    type="submit" 
                    variant="success" 
                    size="sm"
                    disabled={addingSpecialization}
                  >
                    {addingSpecialization ? (
                      <><Spinner size="sm" className="me-2" /> Adding...</>
                    ) : (
                      'Add Specialization'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      setShowAddSpecialization(false);
                      setNewSpecialization({ name: '', description: '', is_active: true });
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </div>
  );
}

function UpdateStaff() {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // Update form state
  const [updateForm, setUpdateForm] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    Address: ''
  });
  
  // Doctor-specific form state
  const [doctorForm, setDoctorForm] = useState({
    ConsultationFee: '',
    ConsultationDays: '',
    ConsultationTime: '',
    YearsOfExperience: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setSearching(true);
    setError('');
    setSearchResults([]);
    
    try {
      // Get all staff and filter on frontend since search endpoint doesn't exist
      const response = await StaffApi.getAll();
      console.log('All staff response:', response);
      const allStaff = response.data?.data || response.data || [];
      
      // Filter staff based on search term
      const filteredStaff = allStaff.filter(staff => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (staff.first_name && staff.first_name.toLowerCase().includes(searchLower)) ||
          (staff.FirstName && staff.FirstName.toLowerCase().includes(searchLower)) ||
          (staff.last_name && staff.last_name.toLowerCase().includes(searchLower)) ||
          (staff.LastName && staff.LastName.toLowerCase().includes(searchLower)) ||
          (staff.email && staff.email.toLowerCase().includes(searchLower)) ||
          (staff.Email && staff.Email.toLowerCase().includes(searchLower)) ||
          (staff.staff_id && staff.staff_id.toLowerCase().includes(searchLower)) ||
          (staff.StaffId && staff.StaffId.toLowerCase().includes(searchLower))
        );
      });
      
      console.log('Filtered results:', filteredStaff);
      setSearchResults(filteredStaff);
      
      if (filteredStaff.length === 0) {
        setError(`No staff members found matching "${searchTerm}". Try searching with a different term.`);
      } else {
        setError(''); // Clear any previous errors if results found
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search staff members');
    } finally {
      setSearching(false);
    }
  };

  // Select staff for update
  const handleSelectStaff = async (staff) => {
    setSelectedStaff(staff);
    setUpdateForm({
      FirstName: staff.first_name || staff.FirstName || '',
      LastName: staff.last_name || staff.LastName || '',
      Email: staff.email || staff.Email || '',
      Password: '',
      Address: staff.address || staff.Address || ''
    });
    
    // If staff is a doctor, load doctor details from the doctor table
    if (staff.role === 'DOC' || staff.Role === 'DOC') {
      try {
        console.log('Loading doctor details for staff ID:', staff.id || staff.staff_id);
        const doctorResponse = await DoctorApi.getByStaffId(staff.id || staff.staff_id);
        console.log('Doctor details response:', doctorResponse);
        
        const doctorData = doctorResponse.data?.data || doctorResponse.data;
        console.log('Doctor data extracted:', doctorData);
        
        setDoctorForm({
          ConsultationFee: doctorData.ConsultationFee || doctorData.consultation_fee || '',
          ConsultationDays: doctorData.ConsultationDays || doctorData.consultation_days || '',
          ConsultationTime: doctorData.ConsultationTime || doctorData.consultation_time || '',
          YearsOfExperience: doctorData.YearsOfExperience || doctorData.years_of_experience || ''
        });
      } catch (err) {
        console.error('Failed to load doctor details:', err);
        // If doctor details don't exist, set empty form
        setDoctorForm({
          ConsultationFee: '',
          ConsultationDays: '',
          ConsultationTime: '',
          YearsOfExperience: ''
        });
        setError('Doctor profile not found. You can still update staff details.');
      }
    } else {
      // Clear doctor form for non-doctors
      setDoctorForm({
        ConsultationFee: '',
        ConsultationDays: '',
        ConsultationTime: '',
        YearsOfExperience: ''
      });
    }
  };

  // Update staff
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      setError('Please select a staff member to update');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const updatePayload = {
        staff_id: selectedStaff.id || selectedStaff.staff_id,
        ...updateForm
      };
      
      console.log('Updating staff with payload:', updatePayload);
      await StaffApi.update(updatePayload);
      
      // If staff is a doctor, update doctor details
      if (selectedStaff.role === 'DOC' || selectedStaff.Role === 'DOC') {
        try {
          // First get the doctor ID by staff ID
          const doctorResponse = await DoctorApi.getByStaffId(selectedStaff.id || selectedStaff.staff_id);
          const doctorData = doctorResponse.data?.data || doctorResponse.data;
          
          const doctorPayload = {
            doctor_id: doctorData.DoctorId || doctorData.doctor_id,
            consultation_fee: Number(doctorForm.ConsultationFee),
            consultation_days: doctorForm.ConsultationDays,
            consultation_time: doctorForm.ConsultationTime,
            years_of_experience: Number(doctorForm.YearsOfExperience)
          };
          console.log('Updating doctor with payload:', doctorPayload);
          await DoctorApi.update(doctorPayload);
        } catch (err) {
          console.error('Failed to update doctor details:', err);
          setError('Staff updated but doctor details could not be updated. Please try updating doctor details separately.');
        }
      }
      
      setSuccess('Staff updated successfully');
      setSelectedStaff(null);
      setUpdateForm({ FirstName: '', LastName: '', Email: '', Password: '', Address: '' });
      setDoctorForm({ ConsultationFee: '', ConsultationDays: '', ConsultationTime: '', YearsOfExperience: '' });
    } catch (err) {
      console.error('Update error:', err);
      setError(err?.response?.data?.detail || err?.response?.data?.error || err?.message || 'Failed to update staff');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3">
      <h3 className="mb-4">Update Staff</h3>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}
      
      {/* Search Section */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Search Staff Member</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Search by Name, Email, or Staff ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter first name, last name, email, or staff ID"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>&nbsp;</Form.Label>
                  <Button type="submit" className="w-100" disabled={searching}>
                    {searching ? <><Spinner size="sm" className="me-2" /> Searching...</> : 'Search'}
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          
          {/* Search Results */}
          {searching && (
            <div className="mt-3 text-center">
              <Spinner animation="border" size="sm" className="me-2" />
              Searching staff members...
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="mt-3">
              <h6>Search Results ({searchResults.length} found):</h6>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((staff, index) => (
                    <tr key={index}>
                      <td>{staff.staff_id || staff.StaffId || staff.id}</td>
                      <td>{staff.first_name || staff.FirstName} {staff.last_name || staff.LastName}</td>
                      <td>{staff.email || staff.Email}</td>
                      <td>{staff.role_display || staff.role || staff.Role}</td>
                      <td>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleSelectStaff(staff)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          {!searching && searchResults.length === 0 && searchTerm && error && !selectedStaff && (
            <div className="mt-3">
              <Alert variant="info">
                No staff members found matching "{searchTerm}". Try searching with a different term.
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Update Form */}
      {selectedStaff && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Update Staff: {selectedStaff.first_name || selectedStaff.FirstName} {selectedStaff.last_name || selectedStaff.LastName}</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleUpdate}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      value={updateForm.FirstName}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, FirstName: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      value={updateForm.LastName}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, LastName: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={updateForm.Email}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, Email: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                      type="password"
                      value={updateForm.Password}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, Password: e.target.value }))}
                      placeholder="Enter new password"
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
                      value={updateForm.Address}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, Address: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Doctor-specific fields */}
              {(selectedStaff.role === 'DOC' || selectedStaff.Role === 'DOC') && (
                <div className="mt-4">
                  <h6 className="mb-3">Doctor Details</h6>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Consultation Fee *</Form.Label>
                        <Form.Control
                          type="number"
                          value={doctorForm.ConsultationFee}
                          onChange={(e) => setDoctorForm(prev => ({ ...prev, ConsultationFee: e.target.value }))}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Consultation Days *</Form.Label>
                        <Form.Control
                          value={doctorForm.ConsultationDays}
                          onChange={(e) => setDoctorForm(prev => ({ ...prev, ConsultationDays: e.target.value }))}
                          placeholder="e.g., Monday, Wednesday, Friday"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Consultation Time *</Form.Label>
                        <Form.Control
                          value={doctorForm.ConsultationTime}
                          onChange={(e) => setDoctorForm(prev => ({ ...prev, ConsultationTime: e.target.value }))}
                          placeholder="e.g., 9:00 AM - 5:00 PM"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Years of Experience *</Form.Label>
                        <Form.Control
                          type="number"
                          value={doctorForm.YearsOfExperience}
                          onChange={(e) => setDoctorForm(prev => ({ ...prev, YearsOfExperience: e.target.value }))}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              <div className="mt-4">
                <Button type="submit" disabled={submitting} className="me-2">
                  {submitting ? <><Spinner size="sm" className="me-2" /> Updating...</> : 'Update Staff'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSelectedStaff(null);
                    setUpdateForm({ FirstName: '', LastName: '', Email: '', Password: '', Address: '' });
                    setDoctorForm({ ConsultationFee: '', ConsultationDays: '', ConsultationTime: '', YearsOfExperience: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

const AdminDashboardPage = () => {
  const [selectedSection, setSelectedSection] = useState('view');

  let SectionComponent;
  if (selectedSection === 'view') SectionComponent = <ViewStaff />;
  else if (selectedSection === 'add') SectionComponent = <AddStaff />;
  else if (selectedSection === 'update') SectionComponent = <UpdateStaff />;

  return (
    <div className="d-flex admin-dashboard-wrapper">
      <AdminSidebar selected={selectedSection} onSelectSection={setSelectedSection} />
      <main className="admin-main-content" style={{ flex: 1, marginLeft: '220px' }}>{SectionComponent}</main>
    </div>
  );
};

export default AdminDashboardPage;