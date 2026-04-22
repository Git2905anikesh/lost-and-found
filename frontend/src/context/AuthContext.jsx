import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// 1. Create the context
export const AuthContext = createContext();

// 2. Create the Provider component that will wrap our App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, check if we have a valid token
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // If token exists, ask the backend for the user's data
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Invalid or expired token', error);
          // If the token is bad, delete it so they can log in again
          localStorage.removeItem('token'); 
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Update global user state
      setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Update global user state
      setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Pass all these values down to the rest of the application
  const contextData = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
