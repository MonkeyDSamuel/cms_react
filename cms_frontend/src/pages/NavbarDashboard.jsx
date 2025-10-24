import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../service/AdminApi';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbardashboard() {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to login page
      navigate('/login');
    }
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