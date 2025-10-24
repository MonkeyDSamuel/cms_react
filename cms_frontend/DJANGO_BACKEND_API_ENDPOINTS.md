# Django Backend API Endpoints Documentation

## 🎯 **Backend Folder Path:** `C:\Users\abira\OneDrive\Documents\doctor_django\cms_django`

## 📋 **Required Django API Endpoints**

### 🔐 **Authentication Endpoints**
```
POST /api/auth/login/                    # User login
POST /api/auth/logout/                   # User logout
POST /api/auth/refresh/                  # Refresh token
GET  /api/auth/profile/                  # Get user profile
GET  /api/auth/check-role/               # Check user role
```

---

## 👨‍⚕️ **DOCTOR MODULE API ENDPOINTS**

### **Dashboard API**
```
GET  /api/doctor/dashboard/stats/                    # Get dashboard statistics
GET  /api/doctor/dashboard/recent-appointments/      # Get recent appointments
GET  /api/doctor/dashboard/todays-schedule/          # Get today's schedule
```

### **Appointments API**
```
GET    /api/doctor/appointments/                    # Get all appointments
GET    /api/doctor/appointments/{id}/               # Get appointment by ID
POST   /api/doctor/appointments/                    # Create new appointment
PUT    /api/doctor/appointments/{id}/               # Update appointment
DELETE /api/doctor/appointments/{id}/               # Delete appointment
PATCH  /api/doctor/appointments/{id}/status/        # Update appointment status
GET    /api/doctor/appointments/search/             # Search appointments
```

### **Patients API**
```
GET  /api/doctor/patients/                          # Get all patients
GET  /api/doctor/patients/{id}/                     # Get patient by ID
GET  /api/doctor/patients/{id}/medical-history/    # Get patient medical history
GET  /api/doctor/patients/search/                  # Search patients
GET  /api/doctor/patients/{id}/appointments/        # Get patient appointments
GET  /api/doctor/patients/{id}/prescriptions/       # Get patient prescriptions
```

### **Medicine Prescriptions API**
```
GET    /api/doctor/medicine-prescriptions/                    # Get all medicine prescriptions
GET    /api/doctor/medicine-prescriptions/{id}/               # Get prescription by ID
POST   /api/doctor/medicine-prescriptions/                    # Create new prescription
PUT    /api/doctor/medicine-prescriptions/{id}/               # Update prescription
DELETE /api/doctor/medicine-prescriptions/{id}/               # Delete prescription
PATCH  /api/doctor/medicine-prescriptions/{id}/status/        # Update prescription status
GET    /api/doctor/medicine-prescriptions/{id}/print/         # Print prescription
GET    /api/doctor/medicine-prescriptions/search/             # Search prescriptions
```

### **Lab Test Prescriptions API**
```
GET    /api/doctor/lab-prescriptions/                        # Get all lab test prescriptions
GET    /api/doctor/lab-prescriptions/{id}/                   # Get prescription by ID
POST   /api/doctor/lab-prescriptions/                        # Create new prescription
PUT    /api/doctor/lab-prescriptions/{id}/                   # Update prescription
DELETE /api/doctor/lab-prescriptions/{id}/                   # Delete prescription
PATCH  /api/doctor/lab-prescriptions/{id}/status/            # Update prescription status
GET    /api/doctor/lab-prescriptions/{id}/print/             # Print prescription
GET    /api/doctor/lab-prescriptions/search/                 # Search prescriptions
```

### **Medical Records API**
```
GET    /api/doctor/medical-records/                          # Get all medical records
GET    /api/doctor/medical-records/{id}/                      # Get medical record by ID
POST   /api/doctor/medical-records/                           # Create new medical record
PUT    /api/doctor/medical-records/{id}/                      # Update medical record
DELETE /api/doctor/medical-records/{id}/                      # Delete medical record
GET    /api/doctor/medical-records/patient/{id}/              # Get patient medical records
POST   /api/doctor/medical-records/{id}/attachments/          # Upload attachment
GET    /api/doctor/medical-records/{id}/attachments/{att_id}/download/  # Download attachment
GET    /api/doctor/medical-records/search/                   # Search medical records
```

### **Doctor Settings API**
```
GET  /api/doctor/settings/                                   # Get doctor settings
PUT  /api/doctor/settings/                                   # Update doctor settings
PUT  /api/doctor/profile/                                    # Update doctor profile
GET  /api/doctor/profile/                                    # Get doctor profile
PATCH /api/doctor/settings/notifications/                    # Update notification preferences
PATCH /api/doctor/settings/preferences/                     # Update work preferences
PATCH /api/doctor/settings/security/                         # Update security settings
```

### **Analytics API**
```
GET /api/doctor/analytics/monthly-trends/                    # Get monthly trends
GET /api/doctor/analytics/patient-age-distribution/          # Get patient age distribution
GET /api/doctor/analytics/common-diagnoses/                  # Get common diagnoses
GET /api/doctor/analytics/appointment-types/                 # Get appointment types
GET /api/doctor/analytics/performance-summary/               # Get performance summary
```

---

## 👩‍💼 **RECEPTIONIST MODULE API ENDPOINTS**

### **Dashboard API**
```
GET /api/receptionist/dashboard/stats/                       # Get dashboard statistics
GET /api/receptionist/dashboard/todays-appointments/         # Get today's appointments
GET /api/receptionist/dashboard/recent-registrations/         # Get recent registrations
```

### **Patient Management API (Including Add Patient)**
```
GET    /api/receptionist/patients/                           # Get all patients
GET    /api/receptionist/patients/{id}/                       # Get patient by ID
POST   /api/receptionist/patients/                            # Create new patient (ADD PATIENT)
PUT    /api/receptionist/patients/{id}/                       # Update patient
DELETE /api/receptionist/patients/{id}/                       # Delete patient
GET    /api/receptionist/patients/search/                     # Search patients
GET    /api/receptionist/patients/{id}/appointments/          # Get patient appointments
GET    /api/receptionist/patients/{id}/medical-history/       # Get patient medical history
POST   /api/receptionist/patients/{id}/medical-history/       # Add medical history entry
PUT    /api/receptionist/patients/{id}/medical-history/{hist_id}/  # Update medical history
DELETE /api/receptionist/patients/{id}/medical-history/{hist_id}/    # Delete medical history
```

### **Appointment Management API**
```
GET    /api/receptionist/appointments/                       # Get all appointments
GET    /api/receptionist/appointments/{id}/                  # Get appointment by ID
POST   /api/receptionist/appointments/                       # Create new appointment
PUT    /api/receptionist/appointments/{id}/                  # Update appointment
DELETE /api/receptionist/appointments/{id}/                  # Delete appointment
PATCH  /api/receptionist/appointments/{id}/status/           # Update appointment status
GET    /api/receptionist/appointments/search/                # Search appointments
GET    /api/receptionist/appointments/available-slots/        # Get available time slots
POST   /api/receptionist/appointments/check-conflicts/       # Check appointment conflicts
```

### **Doctor Management API**
```
GET /api/receptionist/doctors/                                # Get all doctors
GET /api/receptionist/doctors/{id}/                          # Get doctor by ID
GET /api/receptionist/doctors/{id}/schedule/                  # Get doctor schedule
GET /api/receptionist/doctors/{id}/availability/              # Get doctor availability
```

### **Billing API**
```
GET    /api/receptionist/bills/                              # Get all bills
GET    /api/receptionist/bills/{id}/                         # Get bill by ID
POST   /api/receptionist/bills/                               # Create new bill
PUT    /api/receptionist/bills/{id}/                          # Update bill
DELETE /api/receptionist/bills/{id}/                          # Delete bill
GET    /api/receptionist/bills/patient/{id}/                 # Get patient bills
PATCH  /api/receptionist/bills/{id}/status/                   # Update bill status
GET    /api/receptionist/bills/{id}/print/                    # Print bill
```

### **Reports API**
```
GET /api/receptionist/reports/daily/                         # Get daily report
GET /api/receptionist/reports/monthly/                       # Get monthly report
GET /api/receptionist/reports/patient-registration/          # Get patient registration report
GET /api/receptionist/reports/appointments/                  # Get appointment report
```

### **Receptionist Settings API**
```
GET  /api/receptionist/settings/                             # Get receptionist settings
PUT  /api/receptionist/settings/                             # Update receptionist settings
PUT  /api/receptionist/profile/                              # Update receptionist profile
GET  /api/receptionist/profile/                              # Get receptionist profile
```

---

## 📊 **Sample API Request/Response Formats**

### **Add Patient Request (POST /api/receptionist/patients/)**
```json
{
  "name": "John Smith",
  "age": 45,
  "gender": "Male",
  "phone": "+1 (555) 123-4567",
  "email": "john.smith@email.com",
  "address": "123 Main St, City, State",
  "emergency_contact": "Jane Smith",
  "emergency_phone": "+1 (555) 987-6543",
  "medical_history": ["Hypertension", "Diabetes Type 2"]
}
```

### **Add Patient Response**
```json
{
  "id": 1,
  "name": "John Smith",
  "age": 45,
  "gender": "Male",
  "phone": "+1 (555) 123-4567",
  "email": "john.smith@email.com",
  "status": "Active",
  "created_at": "2024-01-15T10:30:00Z",
  "message": "Patient added successfully"
}
```

### **Dashboard Stats Response**
```json
{
  "today_appointments": 12,
  "total_patients": 156,
  "prescriptions_today": 8,
  "completed_today": 15
}
```

### **Medicine Prescription Request**
```json
{
  "patient_id": 1,
  "medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily"
    },
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "Once daily"
    }
  ],
  "doctor_notes": "Continue current treatment, monitor blood pressure"
}
```

### **Lab Test Prescription Request**
```json
{
  "patient_id": 1,
  "tests": [
    {
      "name": "Complete Blood Count",
      "type": "Blood Test",
      "instructions": "Fasting required"
    },
    {
      "name": "Lipid Panel",
      "type": "Blood Test",
      "instructions": "12-hour fast"
    }
  ],
  "doctor_notes": "Routine health checkup lab tests"
}
```

---

## 🔧 **Django Implementation Notes**

### **Required Django Apps:**
1. `authentication` - User authentication and authorization
2. `doctors` - Doctor management
3. `patients` - Patient management
4. `appointments` - Appointment scheduling
5. `prescriptions` - Medicine and lab test prescriptions
6. `medical_records` - Medical records management
7. `billing` - Billing and payments
8. `reports` - Reports and analytics

### **Required Django Packages:**
```python
# requirements.txt
Django>=4.2.0
djangorestframework>=3.14.0
django-cors-headers>=4.0.0
django-filter>=23.0.0
Pillow>=10.0.0  # For file uploads
python-decouple>=3.8  # For environment variables
```

### **CORS Settings:**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5174",  # Frontend URL
    "http://127.0.0.1:5174",
]

CORS_ALLOW_CREDENTIALS = True
```

This documentation provides all the API endpoints needed for your Django backend to support the doctor and receptionist dashboards! 🎯
