import React, { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../elements/Admin/AdminSidebar';
import { StaffApi, DoctorApi, SpecializationApi } from '../../service/AdminApi';
import { Alert, Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap';

function ViewStaff() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [staff, setStaff] = useState([]);

  const load = () => {
    setLoading(true);
    setError('');
    StaffApi.getAll()
      .then((res) => setStaff(res.data?.data || res.data || []))
      .catch((err) => setError(err?.response?.data?.detail || err.message || 'Failed to load staff'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-3"><Spinner size="sm" className="me-2" /> Loading staff...</div>;
  if (error) return <div className="p-3"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Staff List</h3>
        <Button size="sm" variant="outline-secondary" onClick={load}>Refresh</Button>
      </div>
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
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id || s.StaffId}>
              <td>{s.StaffId}</td>
              <td>{s.FirstName}</td>
              <td>{s.LastName}</td>
              <td>{s.role_display || s.Role}</td>
              <td>{s.Email}</td>
              <td>{s.Contact}</td>
              <td>{s.IsActive ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
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
    SpecializationName: '',
    Description: '',
    IsActive: true
  });
  const [addingSpecialization, setAddingSpecialization] = useState(false);
  const [specializationError, setSpecializationError] = useState('');
  const [specializationSuccess, setSpecializationSuccess] = useState('');
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

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
      setNewSpecialization({ SpecializationName: '', Description: '', IsActive: true });
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
        const doctorPayload = {
          staff_id: staffData.id || staffData.staff_id,
          specialization_id: Number(doctorForm.specialization_id),
          consultation_fee: Number(doctorForm.ConsultationFee),
          consultation_days: doctorForm.ConsultationDays,
          consultation_time: doctorForm.ConsultationTime,
          years_of_experience: Number(doctorForm.YearsOfExperience),
          is_available: doctorForm.IsAvailable,
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
            
            {/* Debug info - remove this after testing */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-3 p-2 bg-light border rounded">
                <small>
                  <strong>Debug:</strong> Specializations loaded: {specializations.length} | 
                  Active: {specializations.filter(spec => spec.IsActive).length} |
                  Loading: {loadingSpecializations ? 'Yes' : 'No'} |
                  Adding: {addingSpecialization ? 'Yes' : 'No'}
                </small>
                <br />
                <small>
                  <strong>Form State:</strong> {JSON.stringify(newSpecialization)}
                </small>
              </div>
            )}

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
                        specializations.filter(spec => spec.IsActive).map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.SpecializationName}
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
                      onClick={() => setShowAddSpecialization(!showAddSpecialization)}
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
                  <Form.Control 
                    name="ConsultationDays" 
                    value={doctorForm.ConsultationDays} 
                    onChange={onDoctorFormChange}
                    placeholder="e.g., Monday-Friday"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Consultation Time *</Form.Label>
                  <Form.Control 
                    name="ConsultationTime" 
                    value={doctorForm.ConsultationTime} 
                    onChange={onDoctorFormChange}
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
                    name="YearsOfExperience" 
                    value={doctorForm.YearsOfExperience} 
                    onChange={onDoctorFormChange}
                    placeholder="e.g., 5"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    name="IsAvailable"
                    checked={doctorForm.IsAvailable}
                    onChange={onDoctorFormChange}
                    label="Available for consultation"
                    className="mt-4"
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
        <div className="mt-4 p-3 border rounded bg-light">
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
                    name="SpecializationName"
                    value={newSpecialization.SpecializationName}
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
                    name="Description"
                    value={newSpecialization.Description}
                    onChange={onNewSpecializationChange}
                    placeholder="Brief description of the specialization"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    name="IsActive"
                    checked={newSpecialization.IsActive}
                    onChange={onNewSpecializationChange}
                    label="Active"
                    className="me-3"
                  />
                  <Button 
                    type="submit" 
                    variant="success" 
                    size="sm"
                    disabled={addingSpecialization}
                    onClick={(e) => {
                      console.log('Add Specialization button clicked');
                      console.log('Form data before submit:', newSpecialization);
                    }}
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
                      setNewSpecialization({ SpecializationName: '', Description: '', IsActive: true });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="warning" 
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      console.log('Test button clicked - form data:', newSpecialization);
                      console.log('Calling handleAddSpecialization directly');
                      handleAddSpecialization({ preventDefault: () => {} });
                    }}
                  >
                    Test Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="info" 
                    size="sm"
                    className="ms-2"
                    onClick={async () => {
                      console.log('Testing API directly...');
                      try {
                        const testPayload = {
                          SpecializationName: 'Test API Call',
                          Description: 'Test description',
                          IsActive: true
                        };
                        console.log('Test payload:', testPayload);
                        const response = await SpecializationApi.add(testPayload);
                        console.log('Direct API test successful:', response);
                      } catch (error) {
                        console.error('Direct API test failed:', error);
                        console.error('Error response data:', error.response?.data);
                        console.error('Error status:', error.response?.status);
                        console.error('Full error object:', JSON.stringify(error.response?.data, null, 2));
                      }
                    }}
                  >
                    Test API
                  </Button>
                  <Button 
                    type="button" 
                    variant="dark" 
                    size="sm"
                    className="ms-2"
                    onClick={async () => {
                      console.log('Testing GET endpoint...');
                      try {
                        const response = await SpecializationApi.getAll();
                        console.log('GET test successful:', response);
                      } catch (error) {
                        console.error('GET test failed:', error);
                        console.error('Error response data:', error.response?.data);
                      }
                    }}
                  >
                    Test GET
                  </Button>
                  <Button 
                    type="button" 
                    variant="warning" 
                    size="sm"
                    className="ms-2"
                    onClick={async () => {
                      console.log('Testing with serializer field names...');
                      try {
                        const testPayload = {
                          SpecializationName: 'Test Serializer',
                          Description: 'Test with serializer fields',
                          IsActive: true
                        };
                        console.log('Serializer test payload:', testPayload);
                        const response = await SpecializationApi.add(testPayload);
                        console.log('Serializer test successful:', response);
                      } catch (error) {
                        console.error('Serializer test failed:', error);
                        console.error('Serializer error data:', JSON.stringify(error.response?.data, null, 2));
                      }
                    }}
                  >
                    Test Serializer
                  </Button>
                  <Button 
                    type="button" 
                    variant="success" 
                    size="sm"
                    className="ms-2"
                    onClick={async () => {
                      console.log('Testing with minimal required fields...');
                      try {
                        const testPayload = {
                          SpecializationName: 'Minimal Test'
                        };
                        console.log('Minimal test payload:', testPayload);
                        const response = await SpecializationApi.add(testPayload);
                        console.log('Minimal test successful:', response);
                      } catch (error) {
                        console.error('Minimal test failed:', error);
                        console.error('Minimal error data:', JSON.stringify(error.response?.data, null, 2));
                      }
                    }}
                  >
                    Test Minimal
                  </Button>
                  <Button 
                    type="button" 
                    variant="danger" 
                    size="sm"
                    className="ms-2"
                    onClick={async () => {
                      console.log('Testing with different field names...');
                      try {
                        const testPayload = {
                          SpecializationName: 'Field Name Test',
                          IsActive: true
                        };
                        console.log('Field name test payload:', testPayload);
                        const response = await SpecializationApi.add(testPayload);
                        console.log('Field name test successful:', response);
                      } catch (error) {
                        console.error('Field name test failed:', error);
                        console.error('Field name error data:', JSON.stringify(error.response?.data, null, 2));
                      }
                    }}
                  >
                    Test Field Names
                  </Button>
                  <Button 
                    type="button" 
                    variant="info" 
                    size="sm"
                    className="ms-2"
                    onClick={async () => {
                      console.log('Testing with snake_case...');
                      try {
                        const testPayload = {
                          SpecializationName: 'Snake Case Test',
                          IsActive: true
                        };
                        console.log('Snake case test payload:', testPayload);
                        const response = await SpecializationApi.add(testPayload);
                        console.log('Snake case test successful:', response);
                      } catch (error) {
                        console.error('Snake case test failed:', error);
                        console.error('Snake case error data:', JSON.stringify(error.response?.data, null, 2));
                      }
                    }}
                  >
                    Test Snake Case
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    className="ms-2"
                    onClick={async () => {
                      console.log('Testing with space in field name...');
                      try {
                        const testPayload = {
                          SpecializationName: 'Space Test',
                          IsActive: true
                        };
                        console.log('Space test payload:', testPayload);
                        const response = await SpecializationApi.add(testPayload);
                        console.log('Space test successful:', response);
                      } catch (error) {
                        console.error('Space test failed:', error);
                        console.error('Space error data:', JSON.stringify(error.response?.data, null, 2));
                      }
                    }}
                  >
                    Test Space
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
  const [staffId, setStaffId] = useState('');
  const [payload, setPayload] = useState({ FirstName: '', LastName: '', Email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    StaffApi.update({ staff_id: Number(staffId), ...payload })
      .then(() => setSuccess('Staff updated'))
      .catch((err) => setError(err?.response?.data?.detail || err.message || 'Failed to update staff'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-3">
      <h3 className="mb-3">Update Staff</h3>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}
      <Form onSubmit={onSubmit}>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Staff ID (numeric)</Form.Label>
              <Form.Control value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control value={payload.FirstName} onChange={(e) => setPayload((p) => ({ ...p, FirstName: e.target.value }))} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control value={payload.LastName} onChange={(e) => setPayload((p) => ({ ...p, LastName: e.target.value }))} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={payload.Email} onChange={(e) => setPayload((p) => ({ ...p, Email: e.target.value }))} />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? (<><Spinner size="sm" className="me-2" /> Updating...</>) : 'Update'}
          </Button>
        </div>
      </Form>
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
    <div className="d-flex">
      <AdminSidebar selected={selectedSection} onSelectSection={setSelectedSection} />
      <main style={{ flex: 1 }}>{SectionComponent}</main>
    </div>
  );
};

export default AdminDashboardPage;
