import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppNavbar() {
  const navigate = useNavigate();

  const scrollToSection = (section) => {
    // Navigate to dashboard first (replace history entry)
    navigate('/dashboard', { replace: true });
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          className="fw-bold text-white"
          onClick={() => scrollToSection('home')}
          style={{ cursor: 'pointer' }}
        >
          BIMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="mx-auto">
            <Nav.Link
              className="text-white"
              onClick={() => scrollToSection('home')}
              style={{ cursor: 'pointer' }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              className="text-white"
              onClick={() => scrollToSection('about')}
              style={{ cursor: 'pointer' }}
            >
              About Us
            </Nav.Link>
            <Nav.Link
              className="text-white"
              onClick={() => scrollToSection('contact')}
              style={{ cursor: 'pointer' }}
            >
              Contact
            </Nav.Link>
            <Nav.Link className="text-white" as={Link} to="/login">
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;