import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import GoogleLoginButton from '../components/GoogleLogin';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const message = await forgotPassword(forgotEmail);
      setRecoveryMessage(message);
      setError('');
    } catch (err) {
      setError(err.message);
      setRecoveryMessage('');
    }
  };

  if (showForgot) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to recover your password</p>
          </div>
          
          <form onSubmit={handleForgotPassword} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-full">
              Get Password
            </button>
            
            <button 
              type="button" 
              onClick={() => setShowForgot(false)}
              className="btn btn-secondary btn-full"
              style={{marginTop: '1rem'}}
            >
              Back to Login
            </button>
          </form>
          
          {recoveryMessage && (
            <div style={{
              background: '#4CAF50',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              {recoveryMessage}
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-3875.jpg" alt="Login Logo" className="auth-logo-img" />
          </div>
          <h1>Sign In</h1>
          <p>Enter your Gmail and password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Gmail"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <GoogleLoginButton />
          
          <div style={{marginTop: '1rem', textAlign: 'center'}}>
            <button 
              type="button" 
              onClick={() => setShowForgot(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#00ffff',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <Link to="/register" className="auth-link">Create your account</Link> or use Google login above
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;