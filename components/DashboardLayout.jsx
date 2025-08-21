'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
// import { Cow } from 'lucide-react'; // Commenting out Cow import
import { Circle, Milk, Users, BarChart, DollarSign, LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children, title }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart, color: 'text-blue-600', path: '/' },
    { id: 'cattle', label: 'Cattle', icon: Circle, color: 'text-green-600', path: '/cattle' },
    { id: 'milk', label: 'Milk', icon: Milk, color: 'text-purple-600', path: '/milk' },
    { id: 'staff', label: 'Staff', icon: Users, color: 'text-indigo-600', path: '/staff' },
    { id: 'cashflow', label: 'Cash', icon: DollarSign, color: 'text-emerald-600', path: '/cashflow' },
  ]


  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname === '/') return 'dashboard'
    return pathname.slice(1) // Remove leading slash
  }
  const activeTab = getActiveTab()

  const handleNavigation = (item) => {
    router.push(item.path)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Top Logo Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/images/mela-dairy-logo.png" 
              alt="Mela Dairy Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
            <div className="ml-3 sm:ml-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Mela Dairy Farm</h1>
              <p className="text-xs sm:text-sm text-gray-600">Farm Management System</p>
            </div>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Welcome, {user?.name || user?.username || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      {/* Enhanced Bottom Navigation - Sticky */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl z-50">
        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-indigo-50/30 rounded-t-3xl"></div>
        
        {/* Active Tab Indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
        
        <div className="relative z-10 flex justify-around items-center px-2 py-2 sm:py-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`group flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-300 min-w-0 flex-1 transform ${
                  isActive
                    ? 'text-white scale-105 -translate-y-0.5'
                    : 'text-gray-500 hover:text-gray-700 hover:scale-105 hover:-translate-y-0.5'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Enhanced Icon Container */}
                <div className={`relative p-2 sm:p-2.5 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 shadow-lg' 
                    : 'bg-gray-50 group-hover:bg-gray-100 group-hover:shadow-md'
                }`}>
                  {/* Floating Animation Circles for Active State */}
                  {isActive && (
                    <>
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                    </>
                  )}
                  
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600 group-hover:text-gray-800'
                  }`} />
                  
                  {/* Active Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-xl opacity-20 blur-sm"></div>
                  )}
                </div>
                
                {/* Enhanced Label */}
                <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                  isActive 
                    ? 'text-gray-800' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {item.label}
                </span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>
        
        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </nav>

      {/* Custom Styles for Enhanced Animations */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.4);
          }
        }

        .group:hover .hover\\:animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        /* Enhanced backdrop blur for better glass effect */
        nav {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  )
} 