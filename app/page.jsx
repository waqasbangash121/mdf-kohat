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
  
  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  
  // Raw data states
  const [allCattle, setAllCattle] = useState([])
  const [allStaff, setAllStaff] = useState([])
  const [allTransactions, setAllTransactions] = useState([])
  const [allMilkTransactions, setAllMilkTransactions] = useState([])

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
    }
  ]

  // Helper function to get date range based on selected period
  const getDateRange = (period) => {
    const today = new Date()
    let startDate, endDate
    
    switch (period) {
      case 'daily':
        startDate = new Date(today)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'weekly':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
        break
      case 'yearly':
        startDate = new Date(today.getFullYear(), 0, 1)
        endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)
        break
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate)
          startDate.setHours(0, 0, 0, 0)
          endDate = new Date(customEndDate)
          endDate.setHours(23, 59, 59, 999)
        } else {
          return null
        }
        break
      case 'all':
      default:
        return null // No filtering
    }
    
    return { startDate, endDate }
  }

  // Filter data based on selected period
  const getFilteredData = () => {
    const dateRange = getDateRange(selectedPeriod)
    
    if (!dateRange) {
      // Return all data if no filtering
      return {
        cattle: allCattle,
        staff: allStaff,
        transactions: allTransactions,
        milkTransactions: allMilkTransactions
      }
    }
    
    const { startDate, endDate } = dateRange
    
    // Filter transactions and milk transactions by date
    const filteredTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })
    
    const filteredMilkTransactions = allMilkTransactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })
    
    // For cattle and staff, we show all active ones regardless of filter
    // but could be enhanced to filter by creation date if needed
    return {
      cattle: allCattle,
      staff: allStaff,
      transactions: filteredTransactions,
      milkTransactions: filteredMilkTransactions
    }
  }

  // Update stats when filter changes
  useEffect(() => {
    const updateStatsData = () => {
      // Helper function to get date range based on selected period
      const getDateRange = (period) => {
        const today = new Date()
        let startDate, endDate
        
        switch (period) {
          case 'daily':
            startDate = new Date(today)
            startDate.setHours(0, 0, 0, 0)
            endDate = new Date(today)
            endDate.setHours(23, 59, 59, 999)
            break
          case 'weekly':
            startDate = new Date(today)
            startDate.setDate(today.getDate() - 7)
            startDate.setHours(0, 0, 0, 0)
            endDate = new Date(today)
            endDate.setHours(23, 59, 59, 999)
            break
          case 'monthly':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1)
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
            break
          case 'yearly':
            startDate = new Date(today.getFullYear(), 0, 1)
            endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)
            break
          case 'custom':
            if (customStartDate && customEndDate) {
              startDate = new Date(customStartDate)
              startDate.setHours(0, 0, 0, 0)
              endDate = new Date(customEndDate)
              endDate.setHours(23, 59, 59, 999)
            } else {
              return null
            }
            break
          case 'all':
          default:
            return null // No filtering
        }
        
        return { startDate, endDate }
      }

      // Filter data based on selected period
      const dateRange = getDateRange(selectedPeriod)
      let filteredTransactions = allTransactions
      let filteredMilkTransactions = allMilkTransactions
      
      if (dateRange) {
        const { startDate, endDate } = dateRange
        
        // Filter transactions and milk transactions by date
        filteredTransactions = allTransactions.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate >= startDate && transactionDate <= endDate
        })
        
        filteredMilkTransactions = allMilkTransactions.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate >= startDate && transactionDate <= endDate
        })
      }
      
      // Calculate total milk production from filtered milk transactions
      const totalMilkLitres = filteredMilkTransactions.reduce((sum, transaction) => {
        const litres = transaction.details?.litres || 0
        return sum + Number(litres)
      }, 0)
      
      setStats([
        {
          title: 'Active Cattle',
          value: allCattle.filter(c => c.status === 'active').length,
          change: '+0%',
          icon: Circle,
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-blue-100'
        },
        {
          title: 'Milk Production',
          value: totalMilkLitres + 'L',
          change: '+0%',
          icon: Milk,
          gradient: 'from-green-500 to-green-600',
          bgGradient: 'from-green-50 to-green-100'
        },
        {
          title: 'Active Staff',
          value: allStaff.filter(s => s.status === 'active').length,
          change: '+0',
          icon: Users,
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-purple-100'
        }
      ])
      
      // Create recent activities from filtered transactions
      const recentTransactions = filteredTransactions.slice(0, 5).map(t => ({
        type: t.category,
        title: t.name || 'Transaction',
        description: t.category + (t.details?.litres ? ` - ${t.details.litres}L` : ''),
        time: new Date(t.date).toLocaleDateString(),
        icon: t.category === 'milk_sales' ? Milk : t.category === 'cattle_sale' ? Circle : t.category === 'health' ? Activity : Circle,
        color: t.category === 'milk_sales' ? 'green' : t.category === 'cattle_sale' ? 'blue' : t.category === 'health' ? 'red' : 'blue'
      }))
      
      setRecentActivities(recentTransactions)
    }

    if (allCattle.length > 0 || allStaff.length > 0 || allTransactions.length > 0 || allMilkTransactions.length > 0) {
      updateStatsData()
    }
  }, [selectedPeriod, customStartDate, customEndDate, allCattle, allStaff, allTransactions, allMilkTransactions])

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
        
        // Check if all responses are ok
        if (!cattleRes.ok) throw new Error('Failed to fetch cattle data')
        if (!staffRes.ok) throw new Error('Failed to fetch staff data')
        if (!transactionsRes.ok) throw new Error('Failed to fetch transactions data')
        if (!milkRes.ok) throw new Error('Failed to fetch milk data')
        
        const [cattle, staff, transactions, milkTransactions] = await Promise.all([
          cattleRes.json(),
          staffRes.json(),
          transactionsRes.json(),
          milkRes.json()
        ])
        
        // Store raw data
        setAllCattle(Array.isArray(cattle) ? cattle : [])
        setAllStaff(Array.isArray(staff) ? staff : [])
        setAllTransactions(Array.isArray(transactions) ? transactions : [])
        setAllMilkTransactions(Array.isArray(milkTransactions) ? milkTransactions : [])
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Set default empty state on error
        setAllCattle([])
        setAllStaff([])
        setAllTransactions([])
        setAllMilkTransactions([])
        setStats([
          {
            title: 'Active Cattle',
            value: '0',
            change: '+0%',
            icon: Circle,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100'
          },
          {
            title: 'Milk Production',
            value: '0L',
            change: '+0%',
            icon: Milk,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100'
          },
          {
            title: 'Active Staff',
            value: '0',
            change: '+0',
            icon: Users,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100'
          }
        ])
        setRecentActivities([])
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
            
            {/* Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-base font-medium"
                  >
                    <option value="all">All Time</option>
                    <option value="daily">Today</option>
                    <option value="weekly">Last 7 Days</option>
                    <option value="monthly">This Month</option>
                    <option value="yearly">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  {/* Custom Date Range Picker - Mobile Responsive */}
                  {selectedPeriod === 'custom' && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-300"
                          placeholder="Start Date"
                        />
                      </div>
                      <div className="hidden sm:flex items-center justify-center text-gray-500 font-medium px-2">
                        to
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-300"
                          placeholder="End Date"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                  <span className="font-medium text-center sm:text-left">
                    {selectedPeriod === 'all' && 'Showing all data'}
                    {selectedPeriod === 'daily' && 'Showing today\'s data'}
                    {selectedPeriod === 'weekly' && 'Showing last 7 days'}
                    {selectedPeriod === 'monthly' && 'Showing this month'}
                    {selectedPeriod === 'yearly' && 'Showing this year'}
                    {selectedPeriod === 'custom' && customStartDate && customEndDate && 
                      `Showing ${new Date(customStartDate).toLocaleDateString()} to ${new Date(customEndDate).toLocaleDateString()}`
                    }
                    {selectedPeriod === 'custom' && (!customStartDate || !customEndDate) && 'Select date range'}
                  </span>
                </div>
              </div>
            </div>
            
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
