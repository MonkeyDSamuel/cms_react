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
    AuthService.login({
      username: formData.username,
      password: formData.password,
      role: formData.role?.toLowerCase(),
    })
      .then(() => {
        const redirectTo = location.state?.from?.pathname || '/login/admin';
        navigate(redirectTo, { replace: true });
      })
      .catch((err) => {
        const msg = err?.response?.data?.detail || err?.message || 'Login failed';
        setError(String(msg));
      })
      .finally(() => setSubmitting(false));
  };

  return { formData, handleChange, handleSubmit, submitting, error };
}