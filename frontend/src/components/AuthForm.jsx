import React, { useState } from 'react';
import { useAuth } from '../context/Auth';

export default function AuthForm({ mode='login', onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const { loginWithGoogle, forgotPassword } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await onSubmit(email, password);
      else await onSubmit(name, email, password);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
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
      <div className="card auth-3d">
        <h3>Forgot Password</h3>
        <form onSubmit={handleForgotPassword}>
          <input className="input" type="email" placeholder="Enter your email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} required />
          <div style={{marginTop:8}}>
            <button className="button btn-3d" type="submit">Get Password</button>
            <button className="button" type="button" onClick={()=>setShowForgot(false)} style={{marginLeft:8}}>Back</button>
          </div>
        </form>
        {recoveryMessage && <div className="success-3d" style={{marginTop:8, padding:8, background:'#4CAF50', color:'white', borderRadius:4}}>{recoveryMessage}</div>}
        {error && <div className="error-3d">{error}</div>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card auth-3d">
      {mode === 'register' && <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />}
      <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <div style={{marginTop:8}}>
        <button className="button btn-3d" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </div>
      <div style={{marginTop:8}}>
        <button className="button btn-3d" type="button" onClick={handleGoogleLogin} style={{background:'#4285f4'}}>Login with Google</button>
      </div>
      {mode === 'login' && (
        <div className="small" style={{marginTop:8}}>
          <button type="button" onClick={()=>setShowForgot(true)} style={{background:'none', border:'none', color:'#8bd3ff', cursor:'pointer', textDecoration:'underline'}}>Forgot Password?</button>
        </div>
      )}
      {error && <div className="error-3d">{error}</div>}
    </form>
  );
}
