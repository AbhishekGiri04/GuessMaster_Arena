import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getProfile()
        .then(user => dispatch({ type: 'LOGIN_SUCCESS', payload: user }))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const user = registeredUsers[email];
    
    if (!user) {
      throw new Error('Account not found. Please register first.');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password. Please try again.');
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', 'demo-token');
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return user;
  };

  const register = async (name, email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (registeredUsers[email]) {
      throw new Error('Account already exists. Please login instead.');
    }
    
    const userData = {
      username: name,
      email,
      password,
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      stats: { gamesPlayed: 0, gamesWon: 0, totalScore: 0, multiplayerWins: 0, winRate: 0 }
    };
    
    registeredUsers[email] = userData;
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('token', 'demo-token');
    dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
    return userData;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = result.user;
      
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      let userData = registeredUsers[email];
      
      if (!userData) {
        userData = {
          username: displayName || 'Google User',
          email,
          password: 'google-auth',
          joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          stats: { gamesPlayed: 0, gamesWon: 0, totalScore: 0, multiplayerWins: 0, winRate: 0 }
        };
        registeredUsers[email] = userData;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('token', 'demo-token');
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      return userData;
    } catch (error) {
      throw new Error('Google login failed');
    }
  };

  const forgotPassword = async (email) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const user = registeredUsers[email];
    
    if (!user) {
      throw new Error('No account found with this email');
    }
    
    // Send password reset email (demo implementation)
    return 'Password reset instructions sent to your email';
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};