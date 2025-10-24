import axios from 'axios';

// Base URL for receptionist API endpoints
const RECEPTIONIST_API_BASE = '/api/receptionist/';

// Create axios instance for receptionist API
const receptionistApi = axios.create({
  baseURL: RECEPTIONIST_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
receptionistApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard API
export const ReceptionistDashboardApi = {
  // Get dashboard statistics
  getStats() {
    return receptionistApi.get('dashboard/stats/');
  },

  // Get today's appointments
  getTodaysAppointments() {
    return receptionistApi.get('dashboard/todays-appointments/');
  },

  // Get recent registrations
  getRecentRegistrations() {
    return receptionistApi.get('dashboard/recent-registrations/');
  }
};

// Patient Management API
export const PatientManagementApi = {
  // Get all patients
  getAll(params = {}) {
    return receptionistApi.get('patients/', { params });
  },

  // Get patient by ID
  getById(patientId) {
    return receptionistApi.get(`patients/${patientId}/`);
  },

  // Create new patient (Add Patient functionality)
  create(patientData) {
    return receptionistApi.post('patients/', patientData);
  },

  // Update patient
  update(patientId, patientData) {
    return receptionistApi.put(`patients/${patientId}/`, patientData);
  },

  // Delete patient
  delete(patientId) {
    return receptionistApi.delete(`patients/${patientId}/`);
  },

  // Search patients
  search(query) {
    return receptionistApi.get('patients/search/', { params: { q: query } });
  },

  // Get patient appointments
  getAppointments(patientId) {
    return receptionistApi.get(`patients/${patientId}/appointments/`);
  },

  // Get patient medical history
  getMedicalHistory(patientId) {
    return receptionistApi.get(`patients/${patientId}/medical-history/`);
  },

  // Add medical history entry
  addMedicalHistory(patientId, historyData) {
    return receptionistApi.post(`patients/${patientId}/medical-history/`, historyData);
  },

  // Update medical history
  updateMedicalHistory(patientId, historyId, historyData) {
    return receptionistApi.put(`patients/${patientId}/medical-history/${historyId}/`, historyData);
  },

  // Delete medical history entry
  deleteMedicalHistory(patientId, historyId) {
    return receptionistApi.delete(`patients/${patientId}/medical-history/${historyId}/`);
  }
};

// Appointment Management API
export const AppointmentManagementApi = {
  // Get all appointments
  getAll(params = {}) {
    return receptionistApi.get('appointments/', { params });
  },

  // Get appointment by ID
  getById(appointmentId) {
    return receptionistApi.get(`appointments/${appointmentId}/`);
  },

  // Create new appointment
  create(appointmentData) {
    return receptionistApi.post('appointments/', appointmentData);
  },

  // Update appointment
  update(appointmentId, appointmentData) {
    return receptionistApi.put(`appointments/${appointmentId}/`, appointmentData);
  },

  // Delete appointment
  delete(appointmentId) {
    return receptionistApi.delete(`appointments/${appointmentId}/`);
  },

  // Update appointment status
  updateStatus(appointmentId, status) {
    return receptionistApi.patch(`appointments/${appointmentId}/status/`, { status });
  },

  // Search appointments
  search(query) {
    return receptionistApi.get('appointments/search/', { params: { q: query } });
  },

  // Get available time slots
  getAvailableSlots(doctorId, date) {
    return receptionistApi.get(`appointments/available-slots/`, {
      params: { doctor_id: doctorId, date }
    });
  },

  // Check appointment conflicts
  checkConflicts(appointmentData) {
    return receptionistApi.post('appointments/check-conflicts/', appointmentData);
  }
};

// Doctor Management API (for receptionist to view doctors)
export const DoctorManagementApi = {
  // Get all doctors
  getAll() {
    return receptionistApi.get('doctors/');
  },

  // Get doctor by ID
  getById(doctorId) {
    return receptionistApi.get(`doctors/${doctorId}/`);
  },

  // Get doctor schedule
  getSchedule(doctorId, date) {
    return receptionistApi.get(`doctors/${doctorId}/schedule/`, {
      params: { date }
    });
  },

  // Get doctor availability
  getAvailability(doctorId, date) {
    return receptionistApi.get(`doctors/${doctorId}/availability/`, {
      params: { date }
    });
  }
};

// Billing API
export const BillingApi = {
  // Get all bills
  getAll(params = {}) {
    return receptionistApi.get('bills/', { params });
  },

  // Get bill by ID
  getById(billId) {
    return receptionistApi.get(`bills/${billId}/`);
  },

  // Create new bill
  create(billData) {
    return receptionistApi.post('bills/', billData);
  },

  // Update bill
  update(billId, billData) {
    return receptionistApi.put(`bills/${billId}/`, billData);
  },

  // Delete bill
  delete(billId) {
    return receptionistApi.delete(`bills/${billId}/`);
  },

  // Get patient bills
  getByPatient(patientId) {
    return receptionistApi.get(`bills/patient/${patientId}/`);
  },

  // Update bill status
  updateStatus(billId, status) {
    return receptionistApi.patch(`bills/${billId}/status/`, { status });
  },

  // Print bill
  print(billId) {
    return receptionistApi.get(`bills/${billId}/print/`);
  }
};

// Reports API
export const ReportsApi = {
  // Get daily report
  getDailyReport(date) {
    return receptionistApi.get('reports/daily/', { params: { date } });
  },

  // Get monthly report
  getMonthlyReport(year, month) {
    return receptionistApi.get('reports/monthly/', { params: { year, month } });
  },

  // Get patient registration report
  getPatientRegistrationReport(startDate, endDate) {
    return receptionistApi.get('reports/patient-registration/', {
      params: { start_date: startDate, end_date: endDate }
    });
  },

  // Get appointment report
  getAppointmentReport(startDate, endDate) {
    return receptionistApi.get('reports/appointments/', {
      params: { start_date: startDate, end_date: endDate }
    });
  }
};

// Settings API
export const ReceptionistSettingsApi = {
  // Get receptionist settings
  get() {
    return receptionistApi.get('settings/');
  },

  // Update receptionist settings
  update(settingsData) {
    return receptionistApi.put('settings/', settingsData);
  },

  // Update profile
  updateProfile(profileData) {
    return receptionistApi.put('profile/', profileData);
  },

  // Get receptionist profile
  getProfile() {
    return receptionistApi.get('profile/');
  }
};

// Export default receptionistApi instance
export default receptionistApi;
