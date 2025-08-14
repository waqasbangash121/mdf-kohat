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
  const [chartView, setChartView] = useState('daily') // New state for chart view
  const [currentPage, setCurrentPage] = useState(1) // Pagination state
  const recordsPerPage = 8
  const [chartItemsToShow, setChartItemsToShow] = useState(10) // Chart items limit
  const chartItemsIncrement = 10 // How many more items to show when "Show More" is clicked

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

  // Pagination calculations
  const totalRecords = filteredMilkProductions.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedRecords = filteredMilkProductions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriod, customMonth, customStart, customEnd]);

  // Reset chart items when chart view or period changes
  useEffect(() => {
    setChartItemsToShow(10);
  }, [chartView, selectedPeriod, customMonth, customStart, customEnd]);

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
        const { getTransactions } = await import('../../lib/actions')
        const allTransactions = await getTransactions()
        // Only keep milk sales
        const milkSales = Array.isArray(allTransactions)
          ? allTransactions.filter(tx => tx.category === 'milk_sales')
          : [];
        setMilkProductions(milkSales)
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

            {/* Only real milk_sales data is shown below (table and chart) */}

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

                  {/* Chart View Selector */}
                  <select
                    value={chartView}
                    onChange={(e) => setChartView(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-base font-medium"
                  >
                    <option value="daily">Daily View</option>
                    <option value="weekly">Weekly View</option>
                    <option value="monthly">Monthly View</option>
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

            {/* Mobile-First Milk Sales Table View */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-8 mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-xl font-bold text-gray-800">Milk Sales Records</h2>
                {totalRecords > 0 && (
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords} records
                  </div>
                )}
              </div>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading milk sales data...</div>
              ) : filteredMilkProductions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No milk sales data for the selected period.</div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Litres</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Litre</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {paginatedRecords.map((record) => {
                          const details = record.details || {};
                          const litres = details.litres ?? '';
                          const pricePerLitre = details.pricePerLitre ?? '';
                          const session = details.session ?? '';
                          const totalValue = litres && pricePerLitre ? Number(litres) * Number(pricePerLitre) : null;
                          return (
                            <tr key={record.id} className="hover:bg-blue-50">
                              <td className="px-4 py-3 whitespace-nowrap">{record.date ? new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{litres !== '' ? litres : 'N/A'}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{pricePerLitre !== '' ? `₨${pricePerLitre}` : 'N/A'}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{session ? (session.charAt(0).toUpperCase() + session.slice(1)) : 'N/A'}</td>
                              <td className="px-4 py-3 whitespace-nowrap font-bold text-green-700">{totalValue !== null ? `₨${totalValue.toLocaleString()}` : 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                    {paginatedRecords.map((record) => {
                      const details = record.details || {};
                      const litres = details.litres ?? '';
                      const pricePerLitre = details.pricePerLitre ?? '';
                      const session = details.session ?? '';
                      const totalValue = litres && pricePerLitre ? Number(litres) * Number(pricePerLitre) : null;
                      return (
                        <div key={record.id} className="bg-white/70 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {record.date ? new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {session ? (session.charAt(0).toUpperCase() + session.slice(1) + ' Session') : 'Unknown Session'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {totalValue !== null ? `₨${totalValue.toLocaleString()}` : 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500">Total Value</div>
                            </div>
                          </div>
                          
                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">Litres</div>
                              <div className="font-semibold text-blue-600">{litres !== '' ? `${litres}L` : 'N/A'}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">Price/Litre</div>
                              <div className="font-semibold text-green-600">{pricePerLitre !== '' ? `₨${pricePerLitre}` : 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile-Responsive Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2 sm:px-4 gap-4">
                      <div className="flex items-center space-x-2 order-2 sm:order-1">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="hidden sm:inline">Previous</span>
                          <span className="sm:hidden">‹</span>
                        </button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                            // Mobile: Show fewer pages
                            const isMobile = window.innerWidth < 640;
                            const showPage = isMobile 
                              ? (page === 1 || page === totalPages || page === currentPage || (page >= currentPage - 1 && page <= currentPage + 1))
                              : (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1));
                              
                            if (showPage) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                    currentPage === page
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              (page === currentPage - 2 && currentPage > 3) ||
                              (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                              return <span key={page} className="px-2 text-gray-500 hidden sm:inline">...</span>;
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <span className="sm:hidden">›</span>
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-700 order-1 sm:order-2">
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile-First Milk Sales Trends Chart Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Milk Sales Trends</h2>
              
              {filteredMilkProductions.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  No data available for chart
                </div>
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  {/* Mobile-Responsive Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {filteredMilkProductions.reduce((sum, record) => {
                          const litres = record.details?.litres || 0;
                          return sum + Number(litres);
                        }, 0)}L
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Total Litres</div>
                    </div>
                    <div className="bg-green-50 p-3 sm:p-4 rounded-xl text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        ₨{filteredMilkProductions.reduce((sum, record) => {
                          const details = record.details || {};
                          const litres = details.litres || 0;
                          const price = details.pricePerLitre || 0;
                          return sum + (Number(litres) * Number(price));
                        }, 0).toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="bg-purple-50 p-3 sm:p-4 rounded-xl text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        ₨{filteredMilkProductions.length > 0 
                          ? Math.round(filteredMilkProductions.reduce((sum, record) => {
                              const price = record.details?.pricePerLitre || 0;
                              return sum + Number(price);
                            }, 0) / filteredMilkProductions.length)
                          : 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Avg Price/L</div>
                    </div>
                  </div>

                  {/* Mobile-Responsive Daily Production Chart */}
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                      {chartView === 'daily' ? 'Daily' : chartView === 'weekly' ? 'Weekly' : 'Monthly'} Production Volume
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {(() => {
                        // Group by selected chart view
                        const groupedData = {};
                        filteredMilkProductions.forEach(record => {
                          let key;
                          const date = new Date(record.date);
                          
                          if (chartView === 'daily') {
                            key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          } else if (chartView === 'weekly') {
                            // Get week start (Monday)
                            const weekStart = new Date(date);
                            const day = weekStart.getDay();
                            const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
                            weekStart.setDate(diff);
                            key = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                          } else { // monthly
                            key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                          }
                          
                          const litres = Number(record.details?.litres || 0);
                          groupedData[key] = (groupedData[key] || 0) + litres;
                        });
                        
                        const maxVolume = Math.max(...Object.values(groupedData));
                        const allEntries = Object.entries(groupedData);
                        const visibleEntries = allEntries.slice(0, chartItemsToShow);
                        const hasMoreItems = allEntries.length > chartItemsToShow;
                        
                        return (
                          <>
                            {visibleEntries.map(([period, volume]) => (
                              <div key={period} className="flex items-center gap-2 sm:gap-4">
                                <div className="w-20 sm:w-32 text-xs sm:text-sm font-medium text-gray-600 truncate">{period}</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-5 sm:h-6 relative overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-1 sm:pr-2"
                                    style={{ width: `${(volume / maxVolume) * 100}%` }}
                                  >
                                    <span className="text-white text-xs font-bold">{volume}L</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {hasMoreItems && (
                              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    Showing {chartItemsToShow} of {allEntries.length} periods
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => setChartItemsToShow(prev => Math.min(prev + chartItemsIncrement, allEntries.length))}
                                      className="px-2 sm:px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                      Show More ({Math.min(chartItemsIncrement, allEntries.length - chartItemsToShow)})
                                    </button>
                                    <button
                                      onClick={() => setChartItemsToShow(allEntries.length)}
                                      className="px-2 sm:px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                      Show All
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {chartItemsToShow > 10 && allEntries.length > 10 && (
                              <div className="pt-2">
                                <button
                                  onClick={() => setChartItemsToShow(10)}
                                  className="px-2 sm:px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  Show Less
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Mobile-Responsive Revenue Chart */}
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                      {chartView === 'daily' ? 'Daily' : chartView === 'weekly' ? 'Weekly' : 'Monthly'} Revenue
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {(() => {
                        // Group by selected chart view for revenue
                        const groupedRevenue = {};
                        filteredMilkProductions.forEach(record => {
                          let key;
                          const date = new Date(record.date);
                          
                          if (chartView === 'daily') {
                            key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          } else if (chartView === 'weekly') {
                            // Get week start (Monday)
                            const weekStart = new Date(date);
                            const day = weekStart.getDay();
                            const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
                            weekStart.setDate(diff);
                            key = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                          } else { // monthly
                            key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                          }
                          
                          const details = record.details || {};
                          const revenue = Number(details.litres || 0) * Number(details.pricePerLitre || 0);
                          groupedRevenue[key] = (groupedRevenue[key] || 0) + revenue;
                        });
                        
                        const maxRevenue = Math.max(...Object.values(groupedRevenue));
                        const allRevenueEntries = Object.entries(groupedRevenue);
                        const visibleRevenueEntries = allRevenueEntries.slice(0, chartItemsToShow);
                        const hasMoreRevenueItems = allRevenueEntries.length > chartItemsToShow;
                        
                        return (
                          <>
                            {visibleRevenueEntries.map(([period, revenue]) => (
                              <div key={period} className="flex items-center gap-2 sm:gap-4">
                                <div className="w-20 sm:w-32 text-xs sm:text-sm font-medium text-gray-600 truncate">{period}</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-5 sm:h-6 relative overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-1 sm:pr-2"
                                    style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                                  >
                                    <span className="text-white text-xs font-bold">₨{revenue.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {hasMoreRevenueItems && (
                              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    Showing {chartItemsToShow} of {allRevenueEntries.length} periods
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => setChartItemsToShow(prev => Math.min(prev + chartItemsIncrement, allRevenueEntries.length))}
                                      className="px-2 sm:px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                    >
                                      Show More ({Math.min(chartItemsIncrement, allRevenueEntries.length - chartItemsToShow)})
                                    </button>
                                    <button
                                      onClick={() => setChartItemsToShow(allRevenueEntries.length)}
                                      className="px-2 sm:px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                      Show All
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {chartItemsToShow > 10 && allRevenueEntries.length > 10 && (
                              <div className="pt-2">
                                <button
                                  onClick={() => setChartItemsToShow(10)}
                                  className="px-2 sm:px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  Show Less
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Mobile-Responsive Session Distribution */}
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Session Distribution</h3>
                    <div className="flex items-center justify-center">
                      {(() => {
                        const sessionData = {};
                        filteredMilkProductions.forEach(record => {
                          const session = record.details?.session || 'unknown';
                          const litres = Number(record.details?.litres || 0);
                          sessionData[session] = (sessionData[session] || 0) + litres;
                        });
                        
                        const total = Object.values(sessionData).reduce((sum, val) => sum + val, 0);
                        const sessions = Object.entries(sessionData);
                        
                        if (total === 0) {
                          return <div className="text-gray-500">No session data available</div>;
                        }
                        
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                            {sessions.map(([session, litres], index) => {
                              const percentage = ((litres / total) * 100).toFixed(1);
                              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                              return (
                                <div key={session} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${colors[index % colors.length]}`}></div>
                                  <div className="flex-1">
                                    <div className="font-semibold capitalize text-sm sm:text-base">{session}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">{litres}L ({percentage}%)</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
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