import React from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import useLogin from '../components/Login';

function LoginPage() {
  const { formData, handleChange, handleSubmit, submitting, error } = useLogin();

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-white"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h2 className="mb-4 text-center">Login Page</h2>
              {error ? (
                <Alert variant="danger" className="mb-3">{error}</Alert>
              ) : null}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>


                <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                  {submitting ? (<><Spinner size="sm" className="me-2" /> Logging in...</>) : 'Login'}
                </Button>
              </Form>
              
              {/* Demo Credentials */}
              <div className="mt-4">
                <Alert variant="info" className="mb-0">
                  <h6 className="alert-heading">Demo Credentials</h6>
                  <small>
                    <strong>Doctor:</strong> doctor / doctor123<br />
                    <strong>Admin:</strong> admin / admin123<br />
                    <strong>Receptionist:</strong> receptionist / receptionist123<br />
                    <strong>Lab Technician:</strong> labtech / labtech123
                  </small>
                </Alert>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;