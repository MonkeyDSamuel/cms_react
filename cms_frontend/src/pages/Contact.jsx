import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2>Contact Us</h2>
          <p className="lead">
            Get in touch with our team for support, questions, or feedback.
          </p>
        </div>
      </div>

      <div className="row mt-4">
        {/* Contact Information */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Get in Touch</h5>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="text-primary me-3" size={20} />
                  <div>
                    <h6 className="mb-1">Email</h6>
                    <p className="text-muted mb-0">support@medicalsystem.com</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaPhone className="text-primary me-3" size={20} />
                  <div>
                    <h6 className="mb-1">Phone</h6>
                    <p className="text-muted mb-0">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaMapMarkerAlt className="text-primary me-3" size={20} />
                  <div>
                    <h6 className="mb-1">Address</h6>
                    <p className="text-muted mb-0">
                      123 Medical Center Drive<br />
                      Healthcare City, HC 12345
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <FaClock className="text-primary me-3" size={20} />
                  <div>
                    <h6 className="mb-1">Business Hours</h6>
                    <p className="text-muted mb-0">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Send us a Message</h5>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  <FaPaperPlane className="me-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Support Information</h5>
              <div className="row">
                <div className="col-md-4">
                  <h6>Technical Support</h6>
                  <p className="text-muted">
                    For technical issues, system bugs, or system-related questions,
                    contact our technical support team.
                  </p>
                </div>
                <div className="col-md-4">
                  <h6>General Inquiries</h6>
                  <p className="text-muted">
                    For general questions about our services, pricing, or features,
                    reach out to our customer service team.
                  </p>
                </div>
                <div className="col-md-4">
                  <h6>Emergency Support</h6>
                  <p className="text-muted">
                    For urgent system issues affecting patient care, contact our
                    24/7 emergency support line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
