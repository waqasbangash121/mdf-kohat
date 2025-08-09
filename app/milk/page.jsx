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
            {/* Removed qualityScore display as requested */}
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
        {/* Today's Production Card */}
        <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">Today's Production</p>
                <p className="text-lg sm:text-xl font-bold text-blue-700">{todaysProduction} L</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Milk className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Total Card */}
        <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">Weekly Total</p>
                <p className="text-lg sm:text-xl font-bold text-green-700">{weeklyTotal} L</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Average Card */}
        <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700">Daily Average</p>
                <p className="text-lg sm:text-xl font-bold text-purple-700">{dailyAverage} L</p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
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
                className="ml-2 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onChange={e => setCustomMonth(e.target.value)}
              />
            )}
            {/* Custom Date Range Picker */}
            {selectedPeriod === 'customRange' && (
              <div className="flex items-center ml-2 gap-2">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onChange={e => setCustomStart(e.target.value)}
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onChange={e => setCustomEnd(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Milk Production Records - Styled Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading milk production records...</div>
        ) : filteredMilkProductions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No milk production records found.</div>
        ) : (
          filteredMilkProductions.map((record) => (
            <div key={record.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Milk className="w-6 h-6 text-blue-500" />
                  <span className="font-bold text-lg text-gray-800">{record.litres}L</span>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 font-semibold">{record.session.charAt(0).toUpperCase() + record.session.slice(1)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BarChart className="w-4 h-4 mr-1 text-gray-400" />
                Price per Litre: <span className="ml-1 font-semibold text-blue-700">₨{record.pricePerLitre}</span>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </DashboardLayout>
  )
} 