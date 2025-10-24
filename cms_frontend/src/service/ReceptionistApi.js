import api from './AdminApi';

// Patient Management API
export const PatientManagementApi = {
  getAll() {
    return api.get('receptionist/patients/');
  },
  getById(patientId) {
    return api.get(`receptionist/patients/${patientId}/`);
  },
  create(payload) {
    return api.post('receptionist/patients/', payload);
  },
  update(patientId, payload) {
    return api.put(`receptionist/patients/${patientId}/`, payload);
  },
  delete(patientId) {
    return api.delete(`receptionist/patients/${patientId}/`);
  }
};

// Appointment Management API
export const AppointmentManagementApi = {
  getAll() {
    return api.get('receptionist/appointments/');
  },
  getById(appointmentId) {
    return api.get(`receptionist/appointments/${appointmentId}/`);
  },
  create(payload) {
    return api.post('receptionist/appointments/', payload);
  },
  update(appointmentId, payload) {
    return api.put(`receptionist/appointments/${appointmentId}/`, payload);
  },
  delete(appointmentId) {
    return api.delete(`receptionist/appointments/${appointmentId}/`);
  }
};

// Doctor Management API (for receptionist to view available doctors)
export const DoctorManagementApi = {
  getAll() {
    return api.get('receptionist/doctors/');
  },
  getById(doctorId) {
    return api.get(`receptionist/doctors/${doctorId}/`);
  }
};