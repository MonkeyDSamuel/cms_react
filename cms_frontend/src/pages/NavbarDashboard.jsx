import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbardashboard() {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    // Remove token (adjust key if different)
    localStorage.removeItem('token');
    // Redirect to login
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="dashboard-navbar" />
        <Navbar.Collapse id="dashboard-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbardashboard;