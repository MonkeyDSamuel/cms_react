import React from 'react';

const About = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2>About Our Medical System</h2>
          <p className="lead">
            A comprehensive healthcare management system designed to streamline medical operations
            and improve patient care.
          </p>
          
          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-user-md fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">For Doctors</h5>
                  <p className="card-text">
                    Manage appointments, patient records, prescriptions, and medical history
                    with our intuitive doctor dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-users fa-3x text-success"></i>
                  </div>
                  <h5 className="card-title">For Administrators</h5>
                  <p className="card-text">
                    Oversee staff management, system configuration, and administrative
                    functions with comprehensive admin tools.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-heartbeat fa-3x text-info"></i>
                  </div>
                  <h5 className="card-title">For Patients</h5>
                  <p className="card-text">
                    Access medical records, schedule appointments, and communicate with
                    healthcare providers seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mt-5">
            <div className="col-12">
              <h3>Our Mission</h3>
              <p>
                To provide healthcare professionals with powerful, user-friendly tools that
                enhance patient care, improve efficiency, and streamline medical operations.
                Our system is designed to support the entire healthcare ecosystem, from
                individual practitioners to large medical facilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;