'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Circle, 
  Milk, 
  Users, 
  BarChart, 
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
    { id: 'cattle', label: 'Cattle', icon: Circle, color: 'text-green-600', path: '/cattle' },
    { id: 'milk', label: 'Milk', icon: Milk, color: 'text-purple-600', path: '/milk' },
    { id: 'staff', label: 'Staff', icon: Users, color: 'text-indigo-600', path: '/staff' },
    { id: 'cashflow', label: 'Cash', icon: DollarSign, color: 'text-emerald-600', path: '/cashflow' },
  ]

  const handleNavigation = (item) => {
    router.push(item.path)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dairy Farm</h1>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation - Sticky */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center px-2 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-100 shadow-sm' 
                    : 'group-hover:bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                </div>
                <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 