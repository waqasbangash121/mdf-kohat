'use client'

import { useState, useEffect } from 'react'
import { getCattle, getStaff, getTransactions } from '../lib/actions'
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
        const [cattle, staff, transactions] = await Promise.all([
          getCattle(),
          getStaff(),
          getTransactions()
        ])
        // Stats
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
            value: transactions.filter(t => t.category === 'milk').reduce((sum, t) => sum + (t.litres || 0), 0) + 'L',
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
          },
          {
            title: 'Health Alerts',
            value: 0, // Placeholder, update when health records are connected
            change: '0',
            icon: Activity,
            gradient: 'from-red-500 to-red-600',
            bgGradient: 'from-red-50 to-red-100'
          }
        ])
        // Recent Activities (last 5 transactions)
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
      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening on your farm today.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-10 pr-4 py-2 sm:py-2.5 w-full sm:w-80 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
              <button className="relative p-2 sm:p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Enhanced Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div 
                      key={index} 
                      className="group relative bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">{stat.title}</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                          </div>
                          <div className={`p-2 sm:p-3 bg-gradient-to-r ${stat.gradient} rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                          <span className="text-xs sm:text-sm text-green-600 font-medium">{stat.change}</span>
                          <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">from last month</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Enhanced Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <button 
                          key={index}
                          className="w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] group"
                        >
                          <div className="flex items-center">
                            <div className={`p-2 bg-gradient-to-r ${action.gradient} rounded-lg mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 group-hover:text-gray-900 text-sm sm:text-base truncate">{action.title}</p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{action.description}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Enhanced Recent Activity */}
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <div key={index} className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors duration-200 group cursor-pointer">
                          <div className={`p-2 rounded-lg mr-3 sm:mr-4 ${
                            activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            activity.color === 'green' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'
                          } group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 group-hover:text-gray-900 text-sm sm:text-base truncate">{activity.title}</p>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{activity.description}</p>
                          </div>
                          <span className="text-xs text-gray-500 group-hover:text-gray-600 flex-shrink-0">{activity.time}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* New Analytics Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Weekly Performance</h3>
                    <p className="text-blue-100 text-sm sm:text-base">Your farm is performing 23% better than last week!</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold">92%</div>
                    <div className="text-sm text-blue-100">Efficiency Score</div>
                  </div>
                </div>
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[92%] transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
