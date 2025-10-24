import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div style={{ paddingTop: '56px' }} className="dashboard-container">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <HeroSection />
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold mb-2">500+</h3>
                <p className="mb-0">Happy Patients</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold mb-2">15+</h3>
                <p className="mb-0">Years Experience</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold mb-2">5</h3>
                <p className="mb-0">Expert Doctors</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold mb-2">24/7</h3>
                <p className="mb-0">Emergency Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">Our Services</h2>
              <p className="lead text-muted">Comprehensive healthcare solutions for you and your family</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className="fas fa-heartbeat fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title text-primary">General Medicine</h5>
                  <p className="card-text text-muted">Comprehensive primary healthcare services for all age groups with expert medical care.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className="fas fa-baby fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title text-primary">Pediatrics</h5>
                  <p className="card-text text-muted">Specialized care for children with experienced pediatricians ensuring healthy growth.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className="fas fa-heart fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title text-primary">Cardiology</h5>
                  <p className="card-text text-muted">Advanced heart care with modern diagnostic tools and expert cardiologists.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className="fas fa-vial fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title text-primary">Laboratory Services</h5>
                  <p className="card-text text-muted">Accurate diagnostic testing with state-of-the-art laboratory equipment.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className="fas fa-ambulance fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title text-primary">Emergency Care</h5>
                  <p className="card-text text-muted">24/7 emergency medical services with rapid response and expert care.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-card card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="service-icon mb-3">
                    <i className="fas fa-user-md fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title text-primary">Consultation</h5>
                  <p className="card-text text-muted">Expert medical consultations with personalized treatment plans for every patient.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">Why Choose BIMS?</h2>
              <p className="lead text-muted">Experience healthcare excellence with our unique advantages</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="feature-item d-flex align-items-start">
                <div className="feature-icon me-3">
                  <i className="fas fa-award fa-2x text-primary"></i>
                </div>
                <div>
                  <h5 className="text-primary mb-2">Experienced Team</h5>
                  <p className="text-muted mb-0">Our skilled professionals bring years of experience and expertise to provide the best care.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-item d-flex align-items-start">
                <div className="feature-icon me-3">
                  <i className="fas fa-clock fa-2x text-primary"></i>
                </div>
                <div>
                  <h5 className="text-primary mb-2">Flexible Timings</h5>
                  <p className="text-muted mb-0">Convenient appointment scheduling with extended hours to fit your busy lifestyle.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-item d-flex align-items-start">
                <div className="feature-icon me-3">
                  <i className="fas fa-shield-alt fa-2x text-primary"></i>
                </div>
                <div>
                  <h5 className="text-primary mb-2">Safe & Secure</h5>
                  <p className="text-muted mb-0">Your health data and privacy are protected with the highest security standards.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-item d-flex align-items-start">
                <div className="feature-icon me-3">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <div>
                  <h5 className="text-primary mb-2">Community Trust</h5>
                  <p className="text-muted mb-0">Trusted by the community for years with outstanding service and ethical care.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <AboutSection />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">What Our Patients Say</h2>
              <p className="lead text-muted">Real feedback from our valued patients</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="testimonial-card card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="testimonial-rating mb-3">
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                  </div>
                  <p className="card-text text-muted mb-3">"Excellent service and caring staff. Dr. Samuel George provided exceptional care for my family. Highly recommended!"</p>
                  <div className="testimonial-author">
                    <h6 className="mb-1 text-primary">Sarah Johnson</h6>
                    <small className="text-muted">Patient</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="testimonial-card card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="testimonial-rating mb-3">
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                  </div>
                  <p className="card-text text-muted mb-3">"The pediatric care here is outstanding. Dr. Priya Nair is wonderful with children and very professional."</p>
                  <div className="testimonial-author">
                    <h6 className="mb-1 text-primary">Michael Chen</h6>
                    <small className="text-muted">Parent</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="testimonial-card card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="testimonial-rating mb-3">
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                  </div>
                  <p className="card-text text-muted mb-3">"Professional cardiology services with modern equipment. Dr. Ahmed Khan's expertise is remarkable."</p>
                  <div className="testimonial-author">
                    <h6 className="mb-1 text-primary">Robert Wilson</h6>
                    <small className="text-muted">Patient</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light">
        <ContactSection />
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-primary mb-3">BIMS Clinic</h5>
              <p className="mb-0">Delivering care and compassion with excellence for your family's health.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">&copy; 2024 BIMS Clinic. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;