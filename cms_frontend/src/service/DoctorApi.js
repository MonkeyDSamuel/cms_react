import axios from 'axios';

// Base URLs for different API endpoints
const DOCTOR_API_BASE = '/api/doctor/';
const RECEPTIONIST_API_BASE = '/api/receptionist/';
const ADMIN_API_BASE = '/api/';

// Create axios instances for different APIs
const doctorApi = axios.create({
  baseURL: DOCTOR_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const receptionistApi = axios.create({
  baseURL: RECEPTIONIST_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token for all APIs
const addAuthToken = (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

doctorApi.interceptors.request.use(addAuthToken);
receptionistApi.interceptors.request.use(addAuthToken);
adminApi.interceptors.request.use(addAuthToken);

// Dashboard API
export const DashboardApi = {
  // Get dashboard statistics - we'll calculate this from available data
  async getStats() {
    try {
      // Get appointments and patients data to calculate stats
      const appointmentsResponse = await receptionistApi.get('appointments/');
      const patientsResponse = await receptionistApi.get('patients/');
      
      // Handle Django REST Framework pagination structure
      const appointments = appointmentsResponse.data?.results || appointmentsResponse.data?.data || appointmentsResponse.data || [];
      const patients = patientsResponse.data?.results || patientsResponse.data?.data || patientsResponse.data || [];
      
      // Calculate today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate stats
      const todaysAppointments = appointments.filter(apt => 
        apt.Date === today || apt.date === today
      ).length;
      
      const totalPatients = patients.length;
      
      // For now, we'll set prescriptions and completed to 0 since we don't have that data yet
      const prescriptionsToday = 0;
      const completedToday = appointments.filter(apt => 
        (apt.Status === 'COMPLETED' || apt.status === 'Completed') && 
        (apt.Date === today || apt.date === today)
      ).length;
      
      return {
        data: {
          todays_appointments: todaysAppointments,
          total_patients: totalPatients,
          prescriptions_today: prescriptionsToday,
          completed_today: completedToday
        }
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      throw error;
    }
  },

  // Get recent appointments
  getRecentAppointments() {
    return receptionistApi.get('appointments/');
  },

  // Get today's schedule
  async getTodaysSchedule() {
    try {
      const response = await receptionistApi.get('appointments/');
      // Handle Django REST Framework pagination structure
      const appointments = response.data?.results || response.data?.data || response.data || [];
      
      // Filter for today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todaysAppointments = appointments.filter(apt => 
        apt.Date === today || apt.date === today
      );
      
      return {
        data: todaysAppointments
      };
    } catch (error) {
      console.error('Error getting today\'s schedule:', error);
      throw error;
    }
  }
};

// Appointments API
export const AppointmentsApi = {
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
  }
};

// Patients API
export const PatientsApi = {
  // Get all patients
  getAll(params = {}) {
    return receptionistApi.get('patients/', { params });
  },

  // Get patient by ID
  getById(patientId) {
    return receptionistApi.get(`patients/${patientId}/`);
  },

  // Get patient medical history
  getMedicalHistory(patientId) {
    return receptionistApi.get(`patients/${patientId}/medical-history/`);
  },

  // Search patients
  search(query) {
    return receptionistApi.get('patients/search/', { params: { q: query } });
  },

  // Get patient appointments
  getAppointments(patientId) {
    return receptionistApi.get(`patients/${patientId}/appointments/`);
  },

  // Get patient prescriptions
  getPrescriptions(patientId) {
    return receptionistApi.get(`patients/${patientId}/prescriptions/`);
  }
};

// Medicine Prescriptions API
export const MedicinePrescriptionsApi = {
  // Get all medicine prescriptions
  getAll(params = {}) {
    return doctorApi.get('medicine-prescriptions/', { params });
  },

  // Get prescription by ID
  getById(prescriptionId) {
    return doctorApi.get(`medicine-prescriptions/${prescriptionId}/`);
  },

  // Create new medicine prescription
  create(prescriptionData) {
    return doctorApi.post('medicine-prescriptions/', prescriptionData);
  },

  // Update medicine prescription
  update(prescriptionId, prescriptionData) {
    return doctorApi.put(`medicine-prescriptions/${prescriptionId}/`, prescriptionData);
  },

  // Delete medicine prescription
  delete(prescriptionId) {
    return doctorApi.delete(`medicine-prescriptions/${prescriptionId}/`);
  },

  // Update prescription status
  updateStatus(prescriptionId, status) {
    return doctorApi.patch(`medicine-prescriptions/${prescriptionId}/status/`, { status });
  },

  // Print prescription
  print(prescriptionId) {
    return doctorApi.get(`medicine-prescriptions/${prescriptionId}/print/`);
  },

  // Search prescriptions
  search(query) {
    return doctorApi.get('medicine-prescriptions/search/', { params: { q: query } });
  }
};

// Lab Test Prescriptions API
export const LabTestPrescriptionsApi = {
  // Get all lab test prescriptions
  getAll(params = {}) {
    return doctorApi.get('lab-prescriptions/', { params });
  },

  // Get prescription by ID
  getById(prescriptionId) {
    return doctorApi.get(`lab-prescriptions/${prescriptionId}/`);
  },

  // Create new lab test prescription
  create(prescriptionData) {
    return doctorApi.post('lab-prescriptions/', prescriptionData);
  },

  // Update lab test prescription
  update(prescriptionId, prescriptionData) {
    return doctorApi.put(`lab-prescriptions/${prescriptionId}/`, prescriptionData);
  },

  // Delete lab test prescription
  delete(prescriptionId) {
    return doctorApi.delete(`lab-prescriptions/${prescriptionId}/`);
  },

  // Update prescription status
  updateStatus(prescriptionId, status) {
    return doctorApi.patch(`lab-prescriptions/${prescriptionId}/status/`, { status });
  },

  // Print prescription
  print(prescriptionId) {
    return doctorApi.get(`lab-prescriptions/${prescriptionId}/print/`);
  },

  // Search prescriptions
  search(query) {
    return doctorApi.get('lab-prescriptions/search/', { params: { q: query } });
  }
};

// Medical Records API
export const MedicalRecordsApi = {
  // Get all medical records
  getAll(params = {}) {
    return doctorApi.get('medical-records/', { params });
  },

  // Get medical record by ID
  getById(recordId) {
    return doctorApi.get(`medical-records/${recordId}/`);
  },

  // Create new medical record
  create(recordData) {
    return doctorApi.post('medical-records/', recordData);
  },

  // Update medical record
  update(recordId, recordData) {
    return doctorApi.put(`medical-records/${recordId}/`, recordData);
  },

  // Delete medical record
  delete(recordId) {
    return doctorApi.delete(`medical-records/${recordId}/`);
  },

  // Get patient medical records
  getByPatient(patientId) {
    return doctorApi.get(`medical-records/patient/${patientId}/`);
  },

  // Upload attachment
  uploadAttachment(recordId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return doctorApi.post(`medical-records/${recordId}/attachments/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Download attachment
  downloadAttachment(recordId, attachmentId) {
    return doctorApi.get(`medical-records/${recordId}/attachments/${attachmentId}/download/`);
  },

  // Search medical records
  search(query) {
    return doctorApi.get('medical-records/search/', { params: { q: query } });
  }
};

// Doctor Settings API
export const DoctorSettingsApi = {
  // Get doctor settings
  get() {
    return doctorApi.get('settings/');
  },

  // Update doctor settings
  update(settingsData) {
    return doctorApi.put('settings/', settingsData);
  },

  // Update profile
  updateProfile(profileData) {
    return doctorApi.put('profile/', profileData);
  },

  // Get doctor profile
  getProfile() {
    return doctorApi.get('profile/');
  },

  // Update notification preferences
  updateNotifications(notificationData) {
    return doctorApi.patch('settings/notifications/', notificationData);
  },

  // Update work preferences
  updateWorkPreferences(preferencesData) {
    return doctorApi.patch('settings/preferences/', preferencesData);
  },

  // Update security settings
  updateSecurity(securityData) {
    return doctorApi.patch('settings/security/', securityData);
  }
};

// Analytics API
export const AnalyticsApi = {
  // Get monthly trends
  getMonthlyTrends() {
    return doctorApi.get('analytics/monthly-trends/');
  },

  // Get patient age distribution
  getPatientAgeDistribution() {
    return doctorApi.get('analytics/patient-age-distribution/');
  },

  // Get common diagnoses
  getCommonDiagnoses() {
    return doctorApi.get('analytics/common-diagnoses/');
  },

  // Get appointment types
  getAppointmentTypes() {
    return doctorApi.get('analytics/appointment-types/');
  },

  // Get performance summary
  getPerformanceSummary() {
    return doctorApi.get('analytics/performance-summary/');
  }
};

// Doctor Info API (from admin backend)
export const DoctorInfoApi = {
  // Get all doctors
  getAll() {
    return adminApi.get('doctor/');
  },

  // Get doctor by ID
  getById(doctorId) {
    return adminApi.get(`doctor/${doctorId}/`);
  },

  // Get all staff (to get doctor staff info)
  getAllStaff() {
    return adminApi.get('staff/');
  },

  // Get staff by ID
  getStaffById(staffId) {
    return adminApi.get(`staff/${staffId}/`);
  }
};

// Consultation API
export const ConsultationApi = {
  // Get all consultations
  async getAll() {
    try {
      const response = await doctorApi.get('consultations/');
      return response;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },

  // Start a consultation
  async startConsultation(appointmentId) {
    try {
      const response = await doctorApi.post('consultations/start/', {
        appointment_id: appointmentId
      });
      return response;
    } catch (error) {
      console.error('Error starting consultation:', error);
      throw error;
    }
  },

  // Get consultations by doctor (filtered by appointment doctor)
  async getByDoctor(doctorId) {
    try {
      const response = await doctorApi.get('consultations/');
      // Filter consultations by doctor through appointment
      const consultations = response.data?.results || response.data || [];
      const filteredConsultations = consultations.filter(consultation => 
        consultation.doctor_name && consultation.doctor_name.includes(doctorId)
      );
      return {
        ...response,
        data: {
          ...response.data,
          results: filteredConsultations
        }
      };
    } catch (error) {
      console.error('Error fetching consultations by doctor:', error);
      throw error;
    }
  },

  // Update consultation status
  async updateStatus(consultationId, status) {
    try {
      const response = await doctorApi.patch(`consultations/${consultationId}/status/`, {
        status: status
      });
      return response;
    } catch (error) {
      console.error('Error updating consultation status:', error);
      throw error;
    }
  },

  // Update consultation notes
  async updateNotes(consultationId, notes) {
    try {
      const response = await doctorApi.patch(`consultations/${consultationId}/notes/`, {
        notes: notes
      });
      return response;
    } catch (error) {
      console.error('Error updating consultation notes:', error);
      throw error;
    }
  }
};


// Export default doctorApi instance
export default doctorApi;
