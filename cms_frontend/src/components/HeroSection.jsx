import React from 'react';
import clinicImage from '../assets/clinic.png';

function HeroSection() {
  return (
    <section id="home" className="py-5 bg-white">
      <div className="container-fluid">
        <div className="container">
        {/* Welcome Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">Welcome to BIMS</h1>
            <img
              src={clinicImage}
              alt="Clinic"
              className="img-fluid rounded shadow mb-4"
              style={{ maxWidth: 500 }}
            />
            <p className="lead text-dark mb-0">Delivering care and compassion with excellence for your family's health.</p>
          </div>
        </div>

        {/* Vision and Mission Section */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="vision-mission-card card h-100 border-0 shadow-lg">
              <div className="card-body p-5 text-center">
                <div className="vision-icon mb-4">
                  <i className="fas fa-eye fa-4x text-primary"></i>
                </div>
                <h3 className="card-title text-primary mb-4 fw-bold">Our Vision</h3>
                <p className="card-text lead text-muted">
                  To be the leading healthcare provider in Trivandrum, setting the standard for 
                  excellence in medical care, innovation, and patient-centered service. We envision 
                  a future where every family has access to world-class healthcare that combines 
                  cutting-edge technology with compassionate care.
                </p>
                <div className="vision-highlights mt-4">
                  <span className="badge bg-primary me-2 mb-2">Excellence</span>
                  <span className="badge bg-primary me-2 mb-2">Innovation</span>
                  <span className="badge bg-primary me-2 mb-2">Compassion</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="vision-mission-card card h-100 border-0 shadow-lg">
              <div className="card-body p-5 text-center">
                <div className="mission-icon mb-4">
                  <i className="fas fa-bullseye fa-4x text-primary"></i>
                </div>
                <h3 className="card-title text-primary mb-4 fw-bold">Our Mission</h3>
                <p className="card-text lead text-muted">
                  To provide comprehensive, high-quality healthcare services that prioritize 
                  patient well-being and community health. We are committed to delivering 
                  personalized medical care, fostering trust through transparency, and building 
                  lasting relationships with our patients and their families.
                </p>
                <div className="mission-highlights mt-4">
                  <span className="badge bg-success me-2 mb-2">Quality Care</span>
                  <span className="badge bg-success me-2 mb-2">Trust</span>
                  <span className="badge bg-success me-2 mb-2">Community</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="core-values-section text-center">
              <h3 className="text-primary mb-4 fw-bold">Our Core Values</h3>
              <div className="row g-3">
                <div className="col-md-3 col-sm-6">
                  <div className="value-item p-3">
                    <i className="fas fa-heart fa-2x text-primary mb-2"></i>
                    <h6 className="text-primary">Compassion</h6>
                    <small className="text-muted">Caring for every patient</small>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="value-item p-3">
                    <i className="fas fa-star fa-2x text-primary mb-2"></i>
                    <h6 className="text-primary">Excellence</h6>
                    <small className="text-muted">Highest quality care</small>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="value-item p-3">
                    <i className="fas fa-handshake fa-2x text-primary mb-2"></i>
                    <h6 className="text-primary">Integrity</h6>
                    <small className="text-muted">Honest and ethical</small>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="value-item p-3">
                    <i className="fas fa-users fa-2x text-primary mb-2"></i>
                    <h6 className="text-primary">Community</h6>
                    <small className="text-muted">Serving our community</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;