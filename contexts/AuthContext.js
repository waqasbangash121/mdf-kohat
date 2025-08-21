'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth check success - user authenticated:', data.user.username);
        setUser(data.user);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // 401 is expected when not authenticated - not an error
        console.log('User not authenticated (no valid token)');
        setUser(null);
        setIsAuthenticated(false);
      } else {
        // Other status codes are actual errors
        console.error('Auth check failed with status:', response.status);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check network error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log('AuthContext login started for:', username);
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Login API response:', { status: response.status, data });

      if (response.ok) {
        console.log('Setting user state:', data.user);
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success(data.message || 'Login successful!');
        
        // Force re-check auth status to ensure state is properly updated
        setTimeout(() => {
          console.log('Re-checking auth status after login...');
          console.log('All document cookies:', document.cookie);
          
          // Check if auth-token is in document.cookie
          const authToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth-token='));
          console.log('Auth token from document.cookie:', authToken);
          
          checkAuthStatus();
        }, 200); // Increased delay
        
        return { success: true, user: data.user };
      } else {
        console.log('Login failed:', data.error);
        toast.error(data.error || 'Login failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login network error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the request fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
