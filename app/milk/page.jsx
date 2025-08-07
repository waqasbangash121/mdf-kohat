'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Milk, 
  Calendar, 
  TrendingUp, 
  BarChart,
  Download,
  Filter,
  Target,
  Award,
  Clock
} from 'lucide-react'

export default function MilkProduction() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedCattle, setSelectedCattle] = useState('all')

  const productionData = [
    { date: '2024-01-15', total: 2450, average: 2.8, sessions: 2, quality: 'A+', temperature: 4.2 },
    { date: '2024-01-14', total: 2380, average: 2.7, sessions: 2, quality: 'A', temperature: 4.1 },
    { date: '2024-01-13', total: 2520, average: 2.9, sessions: 2, quality: 'A+', temperature: 4.0 },
    { date: '2024-01-12', total: 2410, average: 2.8, sessions: 2, quality: 'A', temperature: 4.3 },
    { date: '2024-01-11', total: 2350, average: 2.7, sessions: 2, quality: 'A+', temperature: 4.2 },
    { date: '2024-01-10', total: 2480, average: 2.9, sessions: 2, quality: 'A', temperature: 4.1 },
    { date: '2024-01-09', total: 2420, average: 2.8, sessions: 2, quality: 'A+', temperature: 4.0 },
  ]

  const totalToday = productionData[0]?.total || 0
  const totalWeekly = productionData.reduce((sum, day) => sum + day.total, 0)
  const averageDaily = Math.round(totalWeekly / productionData.length)
  const qualityScore = Math.round(productionData.filter(d => d.quality === 'A+').length / productionData.length * 100)

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'A+': return 'bg-green-100 text-green-800 border-green-200'
      case 'A': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'B': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
      {/* Enhanced Header - Mobile Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Milk Production</h1>
          <p className="text-sm sm:text-base text-gray-600">Track and analyze your dairy production performance</p>
          <div className="flex flex-col sm:flex-row sm:items-center mt-3 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500 flex-shrink-0" />
              <span>Goal: 2,500L/day</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500 flex-shrink-0" />
              <span>{qualityScore}% Premium Quality</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-500 flex-shrink-0" />
              <span>Last Updated: 2 hours ago</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200 text-sm sm:text-base">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">Today&apos;s Production</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{totalToday}L</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Milk className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-xs sm:text-sm text-green-600 font-medium">+8%</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">from yesterday</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:hidden">vs yesterday</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">Weekly Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{totalWeekly}L</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-xs sm:text-sm text-green-600 font-medium">+12%</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">from last week</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:hidden">vs last week</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">Daily Average</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{averageDaily}L</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-xs sm:text-sm text-green-600 font-medium">+5%</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">from last month</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:hidden">vs last month</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">Quality Score</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{qualityScore}%</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-xs sm:text-sm text-green-600 font-medium">+3%</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">this month</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:hidden">this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters - Mobile Responsive */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={selectedCattle}
              onChange={(e) => setSelectedCattle(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            >
              <option value="all">All Cattle</option>
              <option value="1234">Bessie (Jersey)</option>
              <option value="1235">Daisy (Holstein)</option>
              <option value="1236">Molly (Guernsey)</option>
            </select>
            <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200 text-sm sm:text-base">
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Production Chart - Mobile Responsive */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
            <BarChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
            Production Trend
          </h3>
          <div className="flex space-x-2">
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-100 text-blue-600 rounded-xl font-medium">Daily</button>
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Weekly</button>
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Monthly</button>
          </div>
        </div>
        <div className="h-60 sm:h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100">
          <div className="text-center p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <BarChart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Interactive Production Chart</h4>
            <p className="text-sm sm:text-base text-gray-600">Advanced analytics and visualization will be displayed here</p>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
} 