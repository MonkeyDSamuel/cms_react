import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

// Note: Remove router-related code for local content switching
function AppNavbar({ onNavigate }) {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => onNavigate('home')}>BIMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link onClick={() => onNavigate('home')}>Home</Nav.Link>
            <Nav.Link onClick={() => onNavigate('about')}>About Us</Nav.Link>
            <Nav.Link onClick={() => onNavigate('contact')}>Contact</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;