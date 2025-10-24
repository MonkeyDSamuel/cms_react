import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../service/AdminApi';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    // Demo credentials for testing
    const demoCredentials = {
      doctor: { username: 'doctor', password: 'doctor123' },
      admin: { username: 'admin', password: 'admin123' },
      receptionist: { username: 'receptionist', password: 'receptionist123' },
      'lab technician': { username: 'labtech', password: 'labtech123' }
    };
    
    const selectedRole = formData.role?.toLowerCase();
    const credentials = demoCredentials[selectedRole];
    
    // Simulate API call with demo credentials
    setTimeout(() => {
      if (credentials && 
          formData.username === credentials.username && 
          formData.password === credentials.password) {
        
        // Store demo login info
        localStorage.setItem('demo_user', JSON.stringify({
          username: formData.username,
          role: selectedRole,
          loginTime: new Date().toISOString()
        }));
        
        // Redirect based on role
        let redirectTo = '/login/admin'; // default
        if (selectedRole === 'doctor') {
          redirectTo = '/login/doctor';
        } else if (selectedRole === 'receptionist') {
          redirectTo = '/login/receptionist';
        } else if (selectedRole === 'lab technician') {
          redirectTo = '/login/labtech';
        }
        
        navigate(redirectTo, { replace: true });
      } else {
        setError('Invalid credentials. Please use demo credentials provided below.');
      }
      setSubmitting(false);
    }, 1000);
  };

  return { formData, handleChange, handleSubmit, submitting, error };
}