'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Circle, 
  Milk, 
  Users, 
  Settings, 
  BarChart, 
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react'

export default function DashboardLayout({ children, title }) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname === '/') return 'dashboard'
    return pathname.slice(1) // Remove leading slash
  }
  
  const activeTab = getActiveTab()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart, color: 'text-blue-600', path: '/' },
    { id: 'cattle', label: 'Cattle Management', icon: Circle, color: 'text-green-600', path: '/cattle' },
    { id: 'milk', label: 'Milk Production', icon: Milk, color: 'text-purple-600', path: '/milk' },
    { id: 'staff', label: 'Staff Management', icon: Users, color: 'text-indigo-600', path: '/staff' },
    { id: 'cashflow', label: 'Cash Flow', icon: DollarSign, color: 'text-emerald-600', path: '/cashflow' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600', path: '/settings' },
  ]

  const handleNavigation = (item) => {
    router.push(item.path)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-white shadow-xl border-r border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dairy Farm</h1>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`group w-full flex items-center px-4 py-3 mb-2 text-left rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg mr-3 transition-colors ${
                  isActive 
                    ? 'bg-white shadow-sm' 
                    : 'group-hover:bg-white group-hover:shadow-sm'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-gray-500'}`} />
                </div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <ArrowRight className="w-4 h-4 ml-auto text-blue-500" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
} 