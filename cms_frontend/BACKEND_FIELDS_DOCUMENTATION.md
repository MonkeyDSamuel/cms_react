# Doctor Dashboard - Backend Fields Documentation

## 📋 **Complete Field List for Backend Implementation**

### 🏥 **1. DOCTOR PROFILE TABLE**
```sql
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    experience VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key
- `first_name` - Doctor's first name
- `last_name` - Doctor's last name  
- `email` - Doctor's email address
- `phone` - Doctor's phone number
- `specialization` - Medical specialization
- `license_number` - Medical license number
- `experience` - Years of experience
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

### 👥 **2. PATIENTS TABLE**
```sql
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    phone VARCHAR(20),
    email VARCHAR(255),
    last_visit DATE,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    next_appointment DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key
- `name` - Patient's full name
- `age` - Patient's age
- `gender` - Patient's gender
- `phone` - Patient's phone number
- `email` - Patient's email address
- `last_visit` - Date of last visit
- `status` - Patient status (Active/Inactive)
- `next_appointment` - Next scheduled appointment
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

### 🏥 **3. MEDICAL HISTORY TABLE**
```sql
CREATE TABLE patient_medical_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    condition VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `patient_id` - Foreign key to patients table
- `condition` - Medical condition name
- `created_at` - Record creation timestamp

---

### 📅 **4. APPOINTMENTS TABLE**
```sql
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    type ENUM('Consultation', 'Follow-up', 'New Patient', 'Check-up', 'Emergency') NOT NULL,
    room VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `patient_id` - Foreign key to patients table
- `doctor_id` - Foreign key to doctors table
- `appointment_date` - Date of appointment
- `appointment_time` - Time of appointment
- `status` - Appointment status
- `type` - Type of appointment
- `room` - Room number
- `notes` - Additional notes
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

### 💊 **5. MEDICINE PRESCRIPTIONS TABLE**
```sql
CREATE TABLE medicine_prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    prescription_date DATE NOT NULL,
    status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `patient_id` - Foreign key to patients table
- `doctor_id` - Foreign key to doctors table
- `prescription_date` - Date prescription was issued
- `status` - Prescription status
- `doctor_notes` - Doctor's notes
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

### 💊 **6. MEDICATION ITEMS TABLE**
```sql
CREATE TABLE medication_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prescription_id INT,
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES medicine_prescriptions(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `prescription_id` - Foreign key to medicine_prescriptions table
- `medication_name` - Name of medication
- `dosage` - Dosage amount
- `frequency` - How often to take
- `created_at` - Record creation timestamp

---

### 🧪 **7. LAB TEST PRESCRIPTIONS TABLE**
```sql
CREATE TABLE lab_test_prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    prescription_date DATE NOT NULL,
    status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `patient_id` - Foreign key to patients table
- `doctor_id` - Foreign key to doctors table
- `prescription_date` - Date prescription was issued
- `status` - Prescription status
- `doctor_notes` - Doctor's notes
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

### 🧪 **8. LAB TEST ITEMS TABLE**
```sql
CREATE TABLE lab_test_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prescription_id INT,
    test_name VARCHAR(200) NOT NULL,
    test_type VARCHAR(100),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES lab_test_prescriptions(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `prescription_id` - Foreign key to lab_test_prescriptions table
- `test_name` - Name of lab test
- `test_type` - Type of test (Blood Test, Urine Test, etc.)
- `instructions` - Test preparation instructions
- `created_at` - Record creation timestamp

---

### 📋 **9. MEDICAL RECORDS TABLE**
```sql
CREATE TABLE medical_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    record_type ENUM('Consultation Report', 'Emergency Visit', 'Physical Examination', 'Follow-up Visit') NOT NULL,
    record_date DATE NOT NULL,
    diagnosis TEXT,
    symptoms TEXT,
    treatment TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `patient_id` - Foreign key to patients table
- `doctor_id` - Foreign key to doctors table
- `record_type` - Type of medical record
- `record_date` - Date of record
- `diagnosis` - Medical diagnosis
- `symptoms` - Patient symptoms
- `treatment` - Treatment provided
- `follow_up_date` - Follow-up appointment date
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

### 📎 **10. MEDICAL RECORD ATTACHMENTS TABLE**
```sql
CREATE TABLE medical_record_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    record_id INT,
    attachment_name VARCHAR(200) NOT NULL,
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `record_id` - Foreign key to medical_records table
- `attachment_name` - Name of attachment
- `file_path` - Path to file
- `file_type` - Type of file
- `created_at` - Record creation timestamp

---

### ⚙️ **11. DOCTOR SETTINGS TABLE**
```sql
CREATE TABLE doctor_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    appointment_reminders BOOLEAN DEFAULT TRUE,
    prescription_alerts BOOLEAN DEFAULT TRUE,
    emergency_alerts BOOLEAN DEFAULT TRUE,
    weekly_reports BOOLEAN DEFAULT FALSE,
    working_hours_start TIME DEFAULT '09:00',
    working_hours_end TIME DEFAULT '17:00',
    appointment_duration INT DEFAULT 30,
    max_patients_per_day INT DEFAULT 20,
    auto_confirm_appointments BOOLEAN DEFAULT FALSE,
    require_patient_confirmation BOOLEAN DEFAULT TRUE,
    two_factor_auth BOOLEAN DEFAULT FALSE,
    session_timeout INT DEFAULT 30,
    login_notifications BOOLEAN DEFAULT TRUE,
    password_expiry INT DEFAULT 90,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Primary key
- `doctor_id` - Foreign key to doctors table
- **Notification Settings:**
  - `email_notifications` - Email notification preference
  - `sms_notifications` - SMS notification preference
  - `appointment_reminders` - Appointment reminder preference
  - `prescription_alerts` - Prescription alert preference
  - `emergency_alerts` - Emergency alert preference
  - `weekly_reports` - Weekly report preference
- **Work Preferences:**
  - `working_hours_start` - Start of working hours
  - `working_hours_end` - End of working hours
  - `appointment_duration` - Default appointment duration
  - `max_patients_per_day` - Maximum patients per day
  - `auto_confirm_appointments` - Auto-confirm appointments
  - `require_patient_confirmation` - Require patient confirmation
- **Security Settings:**
  - `two_factor_auth` - Two-factor authentication
  - `session_timeout` - Session timeout in minutes
  - `login_notifications` - Login notification preference
  - `password_expiry` - Password expiry in days
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

---

## 🔗 **API ENDPOINTS NEEDED**

### **Dashboard Stats:**
- `GET /api/doctor/dashboard/stats` - Get dashboard statistics
- `GET /api/doctor/dashboard/recent-appointments` - Get recent appointments

### **Appointments:**
- `GET /api/doctor/appointments` - Get all appointments
- `POST /api/doctor/appointments` - Create new appointment
- `PUT /api/doctor/appointments/{id}` - Update appointment
- `DELETE /api/doctor/appointments/{id}` - Delete appointment

### **Patients:**
- `GET /api/doctor/patients` - Get all patients
- `GET /api/doctor/patients/{id}` - Get patient details
- `POST /api/doctor/patients` - Create new patient
- `PUT /api/doctor/patients/{id}` - Update patient
- `GET /api/doctor/patients/{id}/medical-history` - Get patient medical history

### **Medicine Prescriptions:**
- `GET /api/doctor/medicine-prescriptions` - Get all medicine prescriptions
- `POST /api/doctor/medicine-prescriptions` - Create new medicine prescription
- `PUT /api/doctor/medicine-prescriptions/{id}` - Update medicine prescription
- `DELETE /api/doctor/medicine-prescriptions/{id}` - Delete medicine prescription

### **Lab Test Prescriptions:**
- `GET /api/doctor/lab-prescriptions` - Get all lab test prescriptions
- `POST /api/doctor/lab-prescriptions` - Create new lab test prescription
- `PUT /api/doctor/lab-prescriptions/{id}` - Update lab test prescription
- `DELETE /api/doctor/lab-prescriptions/{id}` - Delete lab test prescription

### **Medical Records:**
- `GET /api/doctor/medical-records` - Get all medical records
- `GET /api/doctor/medical-records/{id}` - Get medical record details
- `POST /api/doctor/medical-records` - Create new medical record
- `PUT /api/doctor/medical-records/{id}` - Update medical record
- `DELETE /api/doctor/medical-records/{id}` - Delete medical record

### **Settings:**
- `GET /api/doctor/settings` - Get doctor settings
- `PUT /api/doctor/settings` - Update doctor settings

---

## 📊 **DASHBOARD STATISTICS FIELDS**

### **Dashboard Stats API Response:**
```json
{
  "today_appointments": 12,
  "total_patients": 156,
  "prescriptions_today": 8,
  "completed_today": 15
}
```

### **Recent Appointments API Response:**
```json
[
  {
    "id": 1,
    "patient": "John Smith",
    "time": "09:00 AM",
    "status": "Completed",
    "type": "Follow-up"
  }
]
```

This documentation provides all the fields and database structure needed to implement the doctor dashboard backend! 🎯
