'use client'

import { useState, useEffect } from 'react'
// ...existing code...
import DashboardLayout from '../components/DashboardLayout'
import { 
  Circle, 
  Milk, 
  Activity, 
  Users, 
  Plus,
  Search,
  Bell,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function Dashboard() {

  const [stats, setStats] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  // Quick actions are static, not database-driven
  const quickActions = [
    { 
      title: 'Add New Cattle', 
      description: 'Register a new cattle in the system',
      icon: Plus, 
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Record Milk Production', 
      description: "Log today's milk production data",
      icon: Milk, 
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'Schedule Health Check', 
      description: 'Book a veterinary appointment',
      icon: Activity, 
      color: 'red',
      gradient: 'from-red-500 to-red-600'
    }
  ]

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        const [cattleRes, staffRes, transactionsRes, milkRes] = await Promise.all([
          fetch('/api/cattle'),
          fetch('/api/staff'),
          fetch('/api/transaction'),
          fetch('/api/milk')
        ])
        const [cattle, staff, transactions, milkProductions] = await Promise.all([
          cattleRes.json(),
          staffRes.json(),
          transactionsRes.json(),
          milkRes.json()
        ])
        setStats([
          {
            title: 'Total Cattle',
            value: cattle.length,
            change: '+0%',
            icon: Circle,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100'
          },
          {
            title: 'Milk Production',
            value: milkProductions.reduce((sum, m) => sum + (m.litres || 0), 0) + 'L',
            change: '+0%',
            icon: Milk,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100'
          },
          {
            title: 'Active Staff',
            value: staff.length,
            change: '+0',
            icon: Users,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100'
          }
        ])
        setRecentActivities(transactions.slice(0, 5).map(t => ({
          type: t.category,
          title: t.transactionName,
          description: t.category + (t.litres ? ` - ${t.litres}L` : ''),
          time: new Date(t.date).toLocaleDateString(),
          icon: t.category === 'milk' ? Milk : t.category === 'sell cattle' ? Circle : t.category === 'health' ? Activity : Circle,
          color: t.category === 'milk' ? 'green' : t.category === 'sell cattle' ? 'blue' : t.category === 'health' ? 'red' : 'blue'
        })))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  return (
    <DashboardLayout>
      {/* Beautiful Main Content with Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-8 sm:py-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                Welcome to Dashboard
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
                Monitor, manage, and optimize your dairy operations with real-time insights
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/80">
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Content */}
        <main className="relative -mt-8 sm:-mt-12 px-4 sm:px-6 pb-20">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            
            {/* Beautiful Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="group relative bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                    style={{
                      animationName: 'fadeInUp',
                      animationDuration: '0.8s',
                      animationTimingFunction: 'ease-out',
                      animationFillMode: 'forwards',
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    {/* Animated Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl`}></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <p className="text-sm sm:text-base font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300 mb-2">
                            {stat.title}
                          </p>
                          <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 group-hover:scale-105 transition-transform duration-300">
                            {stat.value}
                          </p>
                        </div>
                        <div className={`p-3 sm:p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Performance Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-1 bg-green-100 rounded-full mr-3">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <span className="text-lg font-bold text-green-600">{stat.change}</span>
                            <p className="text-xs text-gray-500">vs last month</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Interactive Performance Dashboard */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Farm Performance Analytics</h3>
                    <p className="text-blue-100 text-sm sm:text-base opacity-90">
                      Real-time insights into your dairy operations
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-3xl sm:text-4xl font-extrabold mb-1">92%</div>
                    <div className="text-sm text-blue-100">Overall Efficiency</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
                  {[
                    { label: 'Milk Quality', value: '98%', color: 'from-green-500 to-emerald-500' },
                    { label: 'Health Score', value: '94%', color: 'from-blue-500 to-cyan-500' },
                    { label: 'Productivity', value: '89%', color: 'from-purple-500 to-pink-500' },
                    { label: 'Efficiency', value: '92%', color: 'from-orange-500 to-red-500' }
                  ].map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                      <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {metric.value}
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{metric.label}</p>
                    </div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Weekly Performance</span>
                    <span>92% Complete</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '92%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Insights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mr-4">
                    <Milk className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Today&apos;s Production</h3>
                    <p className="text-sm text-gray-600">Milk collection status</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {stats.find(s => s.title === 'Milk Production')?.value || '0L'}
                </div>
                <p className="text-sm text-gray-600">Target: 2,500L daily</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Team Status</h3>
                    <p className="text-sm text-gray-600">Active workforce</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {stats.find(s => s.title === 'Active Staff')?.value || '0'} Active
                </div>
                <p className="text-sm text-gray-600">All hands on deck</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </DashboardLayout>
  )
}
