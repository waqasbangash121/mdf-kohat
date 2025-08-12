'use client'

import { useState, useEffect } from 'react'
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
  // Custom filter state
  const [customMonth, setCustomMonth] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedCattle, setSelectedCattle] = useState('all')

  const [milkProductions, setMilkProductions] = useState([])
  const [loading, setLoading] = useState(true)

  // Helper to get start date for selected period
  function getPeriodRange(period) {
    const today = new Date();
    let start, end;
    if (period === 'customMonth' && customMonth) {
      // customMonth format: 'YYYY-MM'
      const parts = customMonth.split('-');
      if (parts.length === 2) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0, 23, 59, 59, 999);
        return { start, end };
      }
    }
    if (period === 'customRange' && customStart && customEnd) {
      start = new Date(customStart);
      end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    switch (period) {
      case 'week':
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        end = today;
        break;
      case 'lastWeek':
        end = new Date(today);
        end.setDate(today.getDate() - 7);
        start = new Date(end);
        start.setDate(end.getDate() - 6);
        break;
      case 'month':
        start = new Date(today);
        start.setMonth(today.getMonth() - 1);
        end = today;
        break;
      case 'lastMonth':
        end = new Date(today);
        end.setMonth(today.getMonth() - 1);
        start = new Date(end);
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start = new Date(today);
        start.setMonth(today.getMonth() - 3);
        end = today;
        break;
      case 'year':
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
        end = today;
        break;
      case 'lastYear':
        end = new Date(today);
        end.setFullYear(today.getFullYear() - 1);
        start = new Date(end);
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        end = today;
    }
    return { start, end };
  }

  // Filter milkProductions by selectedPeriod
  const { start: periodStart, end: periodEnd } = getPeriodRange(selectedPeriod);
  const filteredMilkProductions = milkProductions.filter(mp => {
    if (!mp.date) return false;
    const dateObj = typeof mp.date === 'string' ? new Date(mp.date) : mp.date;
    return dateObj >= periodStart && dateObj <= periodEnd;
  });

  // Calculate Today's Production
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todaysProduction = milkProductions
    .filter(mp => {
      if (!mp.date) return false;
      const dateStr = typeof mp.date === 'string'
        ? mp.date.slice(0, 10)
        : new Date(mp.date).toISOString().slice(0, 10);
      return dateStr === todayStr;
    })
    .reduce((sum, mp) => sum + Number(mp.litres), 0);

  // Calculate Weekly Total
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);
  const weeklyTotal = milkProductions
    .filter(mp => {
      if (!mp.date) return false;
      const dateObj = typeof mp.date === 'string' ? new Date(mp.date) : mp.date;
      return dateObj >= weekAgo && dateObj <= today;
    })
    .reduce((sum, mp) => sum + Number(mp.litres), 0);

  // Calculate Daily Average
  const daysWithData = new Set(milkProductions.map(mp => {
    if (!mp.date) return null;
    return typeof mp.date === 'string'
      ? mp.date.slice(0, 10)
      : new Date(mp.date).toISOString().slice(0, 10);
  }));
  const dailyAverage = daysWithData.size > 0 ? (milkProductions.reduce((sum, mp) => sum + Number(mp.litres), 0) / daysWithData.size).toFixed(2) : 0;

  useEffect(() => {
    async function fetchMilkProductions() {
      setLoading(true)
      try {
        const { getMilkProductions } = await import('../../lib/actions')
        const data = await getMilkProductions()
        setMilkProductions(data)
      } catch (error) {
        console.error('Error fetching milk productions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMilkProductions()
  }, [])

  return (
    <DashboardLayout>
      {/* Beautiful Main Content with Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 py-8 sm:py-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                  Milk Production
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-4">
                  Track and analyze your dairy production performance
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <Target className="w-5 h-5 mr-2 text-blue-200" />
                    <span className="font-semibold">Goal: 2,500L/day</span>
                  </div>
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <Clock className="w-5 h-5 mr-2 text-blue-200" />
                    <span className="font-semibold">Last Updated: 2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 flex items-center font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <Download className="w-6 h-6 mr-3" />
                  Export Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <main className="relative -mt-8 sm:-mt-12 px-4 sm:px-6 pb-20">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

            {/* Beautiful Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Today's Production Card */}
              <div 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: '0ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 mb-2">Today&apos;s Production</p>
                      <p className="text-3xl font-bold text-blue-700">{todaysProduction} L</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+12% from yesterday</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Milk className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: `${(todaysProduction / 2500) * 100}%`}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Target: 2,500L</p>
                </div>
              </div>

              {/* Weekly Total Card */}
              <div 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: '100ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 mb-2">Weekly Total</p>
                      <p className="text-3xl font-bold text-green-700">{weeklyTotal} L</p>
                      <div className="flex items-center mt-2">
                        <Award className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">Above target</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Weekly Goal</span>
                    <span className="font-semibold text-green-600">17,500L</span>
                  </div>
                </div>
              </div>

              {/* Daily Average Card */}
              <div 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: '200ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 mb-2">Daily Average</p>
                      <p className="text-3xl font-bold text-purple-700">{dailyAverage} L</p>
                      <div className="flex items-center mt-2">
                        <BarChart className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-purple-600 font-medium">Consistent growth</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <BarChart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Performance</span>
                    <span className="font-semibold text-purple-600">Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Beautiful Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-base font-medium"
                  >
                    <optgroup label="Current Periods">
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </optgroup>
                    <optgroup label="Previous Periods">
                      <option value="lastWeek">Last Week</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="lastYear">Last Year</option>
                    </optgroup>
                    <optgroup label="Custom">
                      <option value="customMonth">Select Month...</option>
                      <option value="customRange">Select Date Range...</option>
                    </optgroup>
                  </select>

                  {/* Custom Month Picker */}
                  {selectedPeriod === 'customMonth' && (
                    <input
                      type="month"
                      className="px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-300"
                      onChange={e => setCustomMonth(e.target.value)}
                    />
                  )}
                  {/* Custom Date Range Picker */}
                  {selectedPeriod === 'customRange' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="date"
                        className="px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-300"
                        onChange={e => setCustomStart(e.target.value)}
                      />
                      <span className="text-gray-500 font-medium">to</span>
                      <input
                        type="date"
                        className="px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-300"
                        onChange={e => setCustomEnd(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Filter className="w-5 h-5 mr-2" />
                  Apply Filter
                </button>
              </div>
            </div>

            {/* Beautiful Milk Production Records */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {loading ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Milk className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-500 font-medium">Loading milk production records...</p>
                </div>
              ) : filteredMilkProductions.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Milk className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No production records found</h3>
                  <p className="text-gray-500 mb-6">No milk production data available for the selected period.</p>
                </div>
              ) : (
                filteredMilkProductions.map((record, index) => (
                  <div 
                    key={record.id} 
                    className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.8s ease-out forwards'
                    }}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl transform translate-x-6 -translate-y-6"></div>
                    
                    <div className="relative z-10">
                      {/* Record Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <Milk className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-800">{record.litres}L</p>
                            <p className="text-sm text-gray-500">Production Volume</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 font-semibold text-sm">
                          {record.session.charAt(0).toUpperCase() + record.session.slice(1)}
                        </span>
                      </div>

                      {/* Record Details */}
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="font-medium">
                            {new Date(record.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <BarChart className="w-4 h-4 mr-3 text-gray-400" />
                            <span>Price per Litre</span>
                          </div>
                          <span className="font-bold text-blue-700">₨{record.pricePerLitre}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Total Value</span>
                            <span className="text-lg font-bold text-green-600">
                              ₨{(record.litres * record.pricePerLitre).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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