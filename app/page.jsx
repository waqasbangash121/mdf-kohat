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
            {/* Removed search bar and notification bell from dashboard header */}
          </div>
        </header>

        {/* Enhanced Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center items-center mx-auto w-full max-w-3xl">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={index}
                      className="group relative bg-white p-5 sm:p-7 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-3xl`}></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900">{stat.title}</p>
                            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{stat.value}</p>
                          </div>
                          <div className={`p-3 sm:p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                          <span className="text-sm sm:text-base text-green-600 font-semibold">{stat.change}</span>
                          <span className="text-sm sm:text-base text-gray-500 ml-2 hidden sm:inline">from last month</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Removed Quick Actions and Recent Activity sections */}

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
