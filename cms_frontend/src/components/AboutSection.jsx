import React from 'react';

function AboutSection() {
  return (
    <section id="about" className="py-5">
    <div className="container">
      <h2 className="mb-4 fw-semibold text-primary text-center">About Us</h2>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0 p-4">
            <p>
              <strong className="text-primary">BIMS</strong> is a reputed clinic in Trivandrum, Kerala, dedicated to delivering quality healthcare for years with a team of skilled professionals and modern facilities.
            </p>
            <h5 className="mt-4 text-dark">Main Staff</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Dr. Samuel George – General Medicine</li>
              <li className="list-group-item">Dr. Priya Nair – Pediatrics</li>
              <li className="list-group-item">Dr. Ahmed Khan – Cardiology</li>
              <li className="list-group-item">Chelsey Thomas – Lab Technician</li>
              <li className="list-group-item">Breesha Jeno – Lab Technician</li>
            </ul>
            <p className="mt-3 text-dark">
              Over the years, our clinic has gained the trust of the community through outstanding service and ethical care.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}

export default AboutSection;
