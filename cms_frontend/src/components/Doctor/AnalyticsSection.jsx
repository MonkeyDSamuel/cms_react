import React from 'react';
import { FaChartLine, FaUsers, FaCalendarAlt, FaPrescriptionBottleAlt, FaFileMedicalAlt } from 'react-icons/fa';

const AnalyticsSection = () => {
  // Mock analytics data
  const monthlyStats = [
    { month: 'Jan', patients: 45, appointments: 120, prescriptions: 85 },
    { month: 'Feb', patients: 52, appointments: 135, prescriptions: 92 },
    { month: 'Mar', patients: 48, appointments: 128, prescriptions: 88 },
    { month: 'Apr', patients: 61, appointments: 145, prescriptions: 105 },
    { month: 'May', patients: 55, appointments: 138, prescriptions: 95 },
    { month: 'Jun', patients: 58, appointments: 142, prescriptions: 98 }
  ];

  const patientAgeGroups = [
    { ageGroup: '0-18', count: 15, percentage: 12 },
    { ageGroup: '19-35', count: 35, percentage: 28 },
    { ageGroup: '36-50', count: 40, percentage: 32 },
    { ageGroup: '51-65', count: 25, percentage: 20 },
    { ageGroup: '65+', count: 10, percentage: 8 }
  ];

  const commonDiagnoses = [
    { diagnosis: 'Hypertension', count: 25, percentage: 20 },
    { diagnosis: 'Diabetes Type 2', count: 18, percentage: 14 },
    { diagnosis: 'Common Cold', count: 15, percentage: 12 },
    { diagnosis: 'Asthma', count: 12, percentage: 10 },
    { diagnosis: 'Arthritis', count: 10, percentage: 8 }
  ];

  const appointmentTypes = [
    { type: 'Consultation', count: 45, color: 'primary' },
    { type: 'Follow-up', count: 35, color: 'success' },
    { type: 'Emergency', count: 15, color: 'danger' },
    { type: 'Check-up', count: 25, color: 'info' }
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="mb-1">
          <FaChartLine className="me-2 text-primary" />
          Analytics Dashboard
        </h3>
        <p className="text-muted">Comprehensive insights into your practice performance</p>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaUsers className="text-primary mb-2" size={32} />
              <h4 className="text-primary">125</h4>
              <small className="text-muted">Total Patients</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-success mb-2" size={32} />
              <h4 className="text-success">142</h4>
              <small className="text-muted">This Month Appointments</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaPrescriptionBottleAlt className="text-info mb-2" size={32} />
              <h4 className="text-info">98</h4>
              <small className="text-muted">Prescriptions Issued</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaFileMedicalAlt className="text-warning mb-2" size={32} />
              <h4 className="text-warning">85%</h4>
              <small className="text-muted">Patient Satisfaction</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Monthly Trends */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Monthly Trends</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>New Patients</th>
                      <th>Appointments</th>
                      <th>Prescriptions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyStats.map((stat, idx) => (
                      <tr key={idx}>
                        <td>{stat.month}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '100px', height: '8px' }}>
                              <div 
                                className="progress-bar bg-primary" 
                                style={{ width: `${(stat.patients / 70) * 100}%` }}
                              ></div>
                            </div>
                            <span>{stat.patients}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '100px', height: '8px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${(stat.appointments / 150) * 100}%` }}
                              ></div>
                            </div>
                            <span>{stat.appointments}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '100px', height: '8px' }}>
                              <div 
                                className="progress-bar bg-info" 
                                style={{ width: `${(stat.prescriptions / 110) * 100}%` }}
                              ></div>
                            </div>
                            <span>{stat.prescriptions}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Age Distribution */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Patient Age Groups</h5>
            </div>
            <div className="card-body">
              {patientAgeGroups.map((group, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">{group.ageGroup} years</span>
                    <span className="small text-muted">{group.count} ({group.percentage}%)</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${group.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Common Diagnoses */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Common Diagnoses</h5>
            </div>
            <div className="card-body">
              {commonDiagnoses.map((diagnosis, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">{diagnosis.diagnosis}</span>
                    <span className="small text-muted">{diagnosis.count} ({diagnosis.percentage}%)</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${diagnosis.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment Types */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Appointment Types</h5>
            </div>
            <div className="card-body">
              {appointmentTypes.map((type, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div 
                        className={`rounded-circle me-2`} 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: `var(--bs-${type.color})` 
                        }}
                      ></div>
                      <span className="small">{type.type}</span>
                    </div>
                    <span className="small text-muted">{type.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Performance Summary</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <h4 className="text-primary">4.2</h4>
                  <small className="text-muted">Average Rating</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-success">92%</h4>
                  <small className="text-muted">On-time Appointments</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-info">15 min</h4>
                  <small className="text-muted">Average Wait Time</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-warning">8.5</h4>
                  <small className="text-muted">Patients per Day</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
