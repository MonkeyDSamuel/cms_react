import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../service/AdminApi';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    })
      .then((response) => {
        console.log('Login response:', response);
        console.log('Response role:', response.role);
        console.log('Response redirect_module:', response.redirect_module);
        console.log('Response dashboard_url:', response.dashboard_url);
        
        // User role information is already stored in AuthService.login
        console.log('User role:', response.role);
        console.log('User role display:', response.role_display);
        if (response.staff_info) {
          localStorage.setItem('staff_info', JSON.stringify(response.staff_info));
          console.log('Stored staff_info:', response.staff_info);
        }
        
        // Determine redirect based on user role
        let redirectTo = '/login/admin'; // Default to admin dashboard
        
    // Check if backend provided a specific dashboard URL
    if (response.dashboard_url) {
      console.log('Using dashboard_url:', response.dashboard_url);
      // Map backend dashboard URLs to frontend routes
      if (response.dashboard_url === '/receptionist/dashboard/' || response.dashboard_url.includes('receptionist')) {
        redirectTo = '/login/receptionist';
        console.log('Mapped receptionist dashboard URL to:', redirectTo);
      } else if (response.dashboard_url === '/admin/dashboard/' || response.dashboard_url.includes('admin')) {
        redirectTo = '/login/admin';
        console.log('Mapped admin dashboard URL to:', redirectTo);
      } else if (response.dashboard_url === '/doctor/dashboard/' || response.dashboard_url.includes('doctor')) {
        redirectTo = '/login/doctor';
        console.log('Mapped doctor dashboard URL to:', redirectTo);
      } else if (response.dashboard_url === '/labtech/dashboard/' || response.dashboard_url.includes('labtech')) {
        redirectTo = '/login/labtech';
        console.log('Mapped labtech dashboard URL to:', redirectTo);
      } else {
        // For any other dashboard URL, try to extract the role and map to login/<role>
        const roleMatch = response.dashboard_url.match(/\/(\w+)\/dashboard\//);
        if (roleMatch) {
          const role = roleMatch[1].toLowerCase();
          redirectTo = `/login/${role}`;
          console.log('Mapped generic dashboard URL to:', redirectTo);
        } else {
          redirectTo = response.dashboard_url;
          console.log('Using dashboard_url as-is:', redirectTo);
        }
      }
    } else if (response.redirect_module) {
          // Handle backend redirect_module
          if (response.redirect_module === 'admin') {
            redirectTo = '/login/admin';
          } else if (response.redirect_module === 'receptionist') {
            redirectTo = '/login/receptionist';
          } else {
            redirectTo = `/${response.redirect_module}/dashboard/`;
          }
    } else if (response.role) {
      // Fallback role-based redirect
      switch (response.role) {
        case 'ADMIN':
          redirectTo = '/login/admin';
          break;
        case 'DOC':
          redirectTo = '/login/doctor';
          break;
        case 'REC':
          redirectTo = '/login/receptionist';
          break;
        case 'LTECH':
          redirectTo = '/login/labtech';
          break;
        default:
          redirectTo = '/login/admin';
      }
    }
        
        // Use the intended destination or the role-based redirect
        const finalRedirect = location.state?.from?.pathname || redirectTo;
        console.log('Final redirect decision:');
        console.log('- location.state?.from?.pathname:', location.state?.from?.pathname);
        console.log('- calculated redirectTo:', redirectTo);
        console.log('- finalRedirect:', finalRedirect);
        console.log('About to navigate to:', finalRedirect);
        navigate(finalRedirect, { replace: true });
      })
      .catch((err) => {
        console.error('Login error:', err);
        const msg = err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Login failed';
        setError(String(msg));
      })
      .finally(() => setSubmitting(false));
  };

  return { formData, handleChange, handleSubmit, submitting, error };
}