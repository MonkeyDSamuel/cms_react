import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaUserMd, FaUserShield, FaUserNurse } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'doctor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    if (formData.userType === 'doctor') {
      navigate('/login/doctor');
    } else if (formData.userType === 'admin') {
      navigate('/login/admin');
    } else {
      alert('Login functionality for other user types coming soon!');
    }
  };

  const userTypes = [
    { value: 'doctor', label: 'Doctor', icon: <FaUserMd />, description: 'Access patient records and manage appointments' },
    { value: 'admin', label: 'Administrator', icon: <FaUserShield />, description: 'Manage system settings and staff' },
    { value: 'receptionist', label: 'Receptionist', icon: <FaUserNurse />, description: 'Handle patient registration and scheduling' }
  ];

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="mb-3">Welcome Back</h2>
                <p className="text-muted">Sign in to your medical system account</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* User Type Selection */}
                <div className="mb-4">
                  <label className="form-label">Select User Type</label>
                  <div className="row">
                    {userTypes.map((type) => (
                      <div key={type.value} className="col-md-4 mb-3">
                        <div 
                          className={`card border-2 cursor-pointer ${
                            formData.userType === type.value 
                              ? 'border-primary bg-primary bg-opacity-10' 
                              : 'border-light'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body text-center p-3">
                            <div className="text-primary mb-2">
                              {type.icon}
                            </div>
                            <h6 className="mb-1">{type.label}</h6>
                            <small className="text-muted">{type.description}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Sign In
                </button>

                {/* Demo Credentials */}
                <div className="alert alert-info">
                  <h6 className="alert-heading">Demo Credentials</h6>
                  <small>
                    <strong>Doctor:</strong> doctor@demo.com / password123<br />
                    <strong>Admin:</strong> admin@demo.com / password123
                  </small>
                </div>
              </form>

              {/* Additional Links */}
              <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account? 
                  <a href="#" className="text-decoration-none ms-1">Contact administrator</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
