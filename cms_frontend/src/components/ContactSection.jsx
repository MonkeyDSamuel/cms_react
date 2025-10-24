import React from 'react';

function ContactSection() {
  return (
    <section id="contact" className="py-5 bg-light">
    <div className="container">
      <h2 className="mb-4 fw-semibold text-primary text-center">Contact Us</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow p-4">
            <h5 className="mb-2 text-dark">Clinic Address</h5>
            <p>BIMS Clinic, Main Road, Trivandrum, Kerala</p>
            <h5 className="mt-3 mb-2 text-dark">Phone</h5>
            <p>0471-5551234</p>
            <h5 className="mt-3 mb-2 text-dark">Email</h5>
            <p>contact@bimsclinic.in</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  );
}

export default ContactSection;
