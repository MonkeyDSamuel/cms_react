import React, { useState } from 'react';
import { FaCog, FaUser, FaBell, FaShieldAlt, FaSave, FaEdit } from 'react-icons/fa';

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@hospital.com',
      phone: '+1 (555) 123-4567',
      specialization: 'General Practitioner',
      licenseNumber: 'MD123456',
      experience: '15 years'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      prescriptionAlerts: true,
      emergencyAlerts: true,
      weeklyReports: false
    },
    preferences: {
      workingHours: {
        start: '09:00',
        end: '17:00'
      },
      appointmentDuration: 30,
      maxPatientsPerDay: 20,
      autoConfirmAppointments: false,
      requirePatientConfirmation: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginNotifications: true,
      passwordExpiry: 90
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'preferences', label: 'Preferences', icon: <FaCog /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> }
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="mb-1">
          <FaCog className="me-2 text-primary" />
          Settings
        </h3>
        <p className="text-muted">Manage your account settings and preferences</p>
      </div>

      <div className="row">
        {/* Settings Navigation */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <ul className="nav nav-pills flex-column">
                {tabs.map(tab => (
                  <li key={tab.id} className="nav-item">
                    <button
                      className={`nav-link w-100 text-start d-flex align-items-center ${
                        activeTab === tab.id ? 'active' : ''
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      <span className="ms-2">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h5 className="mb-4">Profile Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.profile.firstName}
                        onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.profile.lastName}
                        onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={settings.profile.email}
                        onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={settings.profile.phone}
                        onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Specialization</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.profile.specialization}
                        onChange={(e) => handleInputChange('profile', 'specialization', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">License Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.profile.licenseNumber}
                        onChange={(e) => handleInputChange('profile', 'licenseNumber', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Experience</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.profile.experience}
                        onChange={(e) => handleInputChange('profile', 'experience', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h5 className="mb-4">Notification Preferences</h5>
                  <div className="row">
                    <div className="col-12">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={key}
                            checked={value}
                            onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={key}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Settings */}
              {activeTab === 'preferences' && (
                <div>
                  <h5 className="mb-4">Work Preferences</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Working Hours Start</label>
                      <input
                        type="time"
                        className="form-control"
                        value={settings.preferences.workingHours.start}
                        onChange={(e) => handleNestedInputChange('preferences', 'workingHours', 'start', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Working Hours End</label>
                      <input
                        type="time"
                        className="form-control"
                        value={settings.preferences.workingHours.end}
                        onChange={(e) => handleNestedInputChange('preferences', 'workingHours', 'end', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Appointment Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings.preferences.appointmentDuration}
                        onChange={(e) => handleInputChange('preferences', 'appointmentDuration', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Max Patients Per Day</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings.preferences.maxPatientsPerDay}
                        onChange={(e) => handleInputChange('preferences', 'maxPatientsPerDay', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="autoConfirm"
                          checked={settings.preferences.autoConfirmAppointments}
                          onChange={(e) => handleInputChange('preferences', 'autoConfirmAppointments', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="autoConfirm">
                          Auto-confirm Appointments
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="requireConfirmation"
                          checked={settings.preferences.requirePatientConfirmation}
                          onChange={(e) => handleInputChange('preferences', 'requirePatientConfirmation', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="requireConfirmation">
                          Require Patient Confirmation
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h5 className="mb-4">Security Settings</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password Expiry (days)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={settings.security.passwordExpiry}
                        onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="twoFactor"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="twoFactor">
                          Two-Factor Authentication
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="loginNotifications"
                          checked={settings.security.loginNotifications}
                          onChange={(e) => handleInputChange('security', 'loginNotifications', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="loginNotifications">
                          Login Notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-4 pt-3 border-top">
                <button className="btn btn-primary" onClick={handleSave}>
                  <FaSave className="me-2" />
                  Save Settings
                </button>
                <button className="btn btn-outline-secondary ms-2">
                  <FaEdit className="me-2" />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
