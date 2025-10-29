import React, { useState } from 'react';
import { useAuth } from '../context/Auth';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgotPassword(email);
      setMessage(result);
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Forgot Password</h2>
        <p>Enter your email to recover your password</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-full">
          Get Password
        </button>
        
        <button type="button" onClick={onBack} className="btn btn-secondary btn-full">
          Back to Login
        </button>
      </form>
      
      {message && (
        <div className="success-message" style={{
          background: '#4CAF50',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          {message}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;