'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, User, Shield, Milk } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Check if setup is needed and redirect if already authenticated
  useEffect(() => {
    const checkSetupAndAuth = async () => {
      // First check if setup is needed
      try {
        const response = await fetch('/api/auth/setup-status');
        const data = await response.json();
        
        if (data.needsSetup) {
          router.push('/setup');
          return;
        }
      } catch (error) {
        console.error('Setup status check error:', error);
      }

      // Then check authentication
      if (!loading && isAuthenticated) {
        router.push('/');
      }
    };

    checkSetupAndAuth();
  }, [isAuthenticated, loading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Login attempt started with:', formData.username);
      const result = await login(formData.username, formData.password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, preparing redirect...');
        // Add a longer delay to ensure cookie is properly set
        setTimeout(() => {
          console.log('Executing redirect to dashboard...');
          // Force a hard redirect to ensure middleware processes the request
          window.location.href = '/';
        }, 500); // Increased delay to 500ms
      } else {
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-green-300/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-emerald-300/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-blue-300/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-green-400/40 rounded-full animate-bounce delay-200"></div>
      </div>

      <div className="relative z-10 w-full max-w-md transform transition-all duration-700 hover:scale-105">
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden group">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 relative group/logo transform transition-all duration-500 hover:rotate-6 hover:scale-110">
                {/* Logo glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 blur-sm"></div>
                
                {!logoError ? (
                  <Image 
                    src="/images/mela-dairy-logo.png" 
                    alt="Mela Dairy Logo" 
                    width={124}
                    height={124}
                    className="object-contain relative z-10 transition-transform duration-300 group-hover/logo:scale-110"
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center relative z-10 transition-transform duration-300 group-hover/logo:scale-110">
                    <Milk className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-gradient">
              Mela Dairy Farm
            </h1>
            <p className="text-gray-600 animate-fade-in-up delay-200">Sign-In here with your credentials</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Username Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 group-focus-within:text-green-600">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-all duration-300 group-focus-within:text-green-500 group-focus-within:scale-110" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username or email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-base transition-all duration-300 hover:bg-white hover:shadow-md focus:bg-white focus:shadow-lg transform focus:scale-105"
                  required
                  autoComplete="username"
                />
                {/* Input glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 group-focus-within:text-green-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-all duration-300 group-focus-within:text-green-500 group-focus-within:scale-110" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-base transition-all duration-300 hover:bg-white hover:shadow-md focus:bg-white focus:shadow-lg transform focus:scale-105"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:text-green-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {/* Input glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-base shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group/button"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
              
              {isSubmitting ? (
                <>
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="animate-pulse">Signing In...</span>
                </>
              ) : (
                <span className="relative z-10">Sign In</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center relative z-10 animate-fade-in-up delay-300">
            <p className="text-sm text-gray-500 transition-colors duration-300 hover:text-gray-700">
              Secure dairy farm management system
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 group/footer">
              <Shield className="w-4 h-4 text-green-600 transition-all duration-300 group-hover/footer:scale-110 group-hover/footer:rotate-12" />
              <span className="text-xs text-green-600 font-medium transition-all duration-300 group-hover/footer:text-green-700">
                Protected by encryption
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
        
        /* Enhanced glow effects */
        .group:hover .hover\\:glow {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
