'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Milk, 
  Plus, 
  Calendar, 
  TrendingUp, 
  BarChart,
  Download,
  Filter,
  Target,
  Award,
  Clock,
  Droplets
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

  const cattleProduction = [
    { id: '1234', name: 'Bessie', breed: 'Jersey', today: 2.5, weekly: 17.5, monthly: 75.2, trend: '+8%', quality: 'A+' },
    { id: '1235', name: 'Daisy', breed: 'Holstein', today: 3.2, weekly: 22.4, monthly: 96.8, trend: '+12%', quality: 'A' },
    { id: '1236', name: 'Molly', breed: 'Guernsey', today: 2.8, weekly: 19.6, monthly: 84.3, trend: '+5%', quality: 'A+' },
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
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Milk Production</h1>
          <p className="text-gray-600">Track and analyze your dairy production performance</p>
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Target className="w-4 h-4 mr-1 text-blue-500" />
              <span>Goal: 2,500L/day</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Award className="w-4 h-4 mr-1 text-green-500" />
              <span>{qualityScore}% Premium Quality</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1 text-purple-500" />
              <span>Last Updated: 2 hours ago</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center transition-all duration-200">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Plus className="w-5 h-5 mr-2" />
            Record Production
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Today&apos;s Production</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalToday}L</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Milk className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
              <span className="text-sm text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Weekly Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalWeekly}L</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Daily Average</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{averageDaily}L</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+5%</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">Quality Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{qualityScore}%</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+3%</span>
              <span className="text-sm text-gray-500 ml-1">this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={selectedCattle}
              onChange={(e) => setSelectedCattle(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Cattle</option>
              <option value="1234">Bessie (Jersey)</option>
              <option value="1235">Daisy (Holstein)</option>
              <option value="1236">Molly (Guernsey)</option>
            </select>
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center transition-all duration-200">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Production Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-blue-500" />
            Production Trend
          </h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-xl font-medium">Daily</button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Weekly</button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Monthly</button>
          </div>
        </div>
        <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Interactive Production Chart</h4>
            <p className="text-gray-600">Advanced analytics and visualization will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Enhanced Individual Cattle Production */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-green-500" />
          Individual Cattle Performance
        </h3>
        <div className="space-y-4">
          {cattleProduction.map((cattle) => (
            <div key={cattle.id} className="group p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Milk className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {cattle.name}
                    </h4>
                    <p className="text-sm text-gray-600">{cattle.breed} • ID: {cattle.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Today</p>
                    <p className="text-lg font-bold text-gray-900">{cattle.today}L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">This Week</p>
                    <p className="text-lg font-bold text-gray-900">{cattle.weekly}L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">This Month</p>
                    <p className="text-lg font-bold text-gray-900">{cattle.monthly}L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Quality</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getQualityColor(cattle.quality)}`}>
                      {cattle.quality}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Trend</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{cattle.trend}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Recent Production Records */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-500" />
          Recent Production Records
        </h3>
        <div className="space-y-4">
          {productionData.slice(0, 5).map((record, index) => (
            <div key={index} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{record.date}</p>
                  <p className="text-sm text-gray-600">{record.sessions} milking sessions • Temp: {record.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-900">{record.total}L</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Average</p>
                  <p className="text-lg font-bold text-gray-900">{record.average}L</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Quality</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getQualityColor(record.quality)}`}>
                    {record.quality}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
} 