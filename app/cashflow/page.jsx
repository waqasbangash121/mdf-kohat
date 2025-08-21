"use client";
import { Home, Truck, Users, ShoppingCart, Circle, Milk, DollarSign, Target, TrendingUp, TrendingDown, Download, BarChart3, Search, Eye, Edit, Trash2, X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatPKR, formatPKRCompact, formatPakistaniNumber } from '../../utils/currency';
import { addTransaction, getCattle, getTransactions, getStaff, updateTransaction, deleteTransaction } from '../../lib/actions';

export default function CashFlow() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1) // Pagination state
  const [mounted, setMounted] = useState(false) // Add mounted state for hydration
  const transactionsPerPage = 8
  
  // Database state
  const [cattleData, setCattleData] = useState([])
  const [staffMembers, setStaffMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Form state for adding/editing transactions
  const [formData, setFormData] = useState({
    name: '',
    type: 'income',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    // Milk-specific fields
    litres: '',
    pricePerLitre: '',
    session: 'morning',
    // Related entities
    cattleId: '',
    staffId: '',
    description: '',
    // Cattle-specific fields for purchases
    cattleName: '',
    cattleType: '',
    cattleAge: '',
    marketPrice: ''
  })

  // Edit mode state
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false) // Add loading state

  // Load data from database
  useEffect(() => {
    loadData()
  }, [])

  // Set mounted to true after component mounts (for hydration fix)
  useEffect(() => {
    setMounted(true)
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [cattle, staff, transactionData] = await Promise.all([
        getCattle(),
        getStaff(), 
        getTransactions()
      ])
      
      // Debug: Log the transaction order from database
      console.log('Transactions from DB (first 5):', transactionData.slice(0, 5).map(t => ({
        name: t.name,
        date: t.date,
        createdAt: t.createdAt
      })))
      
      setCattleData(cattle)
      setStaffMembers(staff)
      setTransactions(transactionData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions based on selected time period
  const getFilteredTransactionsByPeriod = () => {
    if (selectedPeriod === 'all') {
      return transactions; // Return all transactions for "All Time"
    }
    
    const now = new Date();
    let startDate;
    
    switch (selectedPeriod) {
      case 'weekly':
        // Get start of current week (Sunday)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        // Get start of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        // Get start of current year
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  };

  // Get filtered transactions for the selected period
  const periodFilteredTransactions = getFilteredTransactionsByPeriod();

  // Calculate totals based on filtered transactions
  const totalIncome = periodFilteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = periodFilteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0;

  // Helper function to get period display name
  const getPeriodDisplayName = () => {
    switch (selectedPeriod) {
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      case 'yearly':
        return 'This Year';
      case 'all':
        return 'All Time';
      default:
        return 'All Time';
    }
  };

  // Safe formatting function to prevent hydration errors
  const safeFormatPKRCompact = (amount) => {
    if (!mounted) {
      // Return a simple format during SSR to match initial client render
      return `Rs ${amount.toLocaleString()}`
    }
    return formatPKRCompact(amount)
  }

  const safeFormatPKR = (amount) => {
    if (!mounted) {
      // Return a simple format during SSR to match initial client render
      return `Rs ${amount.toLocaleString()}`
    }
    return formatPKR(amount)
  }

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return // Prevent double submission
    
    try {
      setIsSubmitting(true) // Start loading
      
      const transactionData = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        amount: formData.amount,
        date: formData.date,
        cattleId: formData.cattleId || null,
        staffId: formData.staffId || null,
        description: formData.description || null,
        // Milk-specific fields
        litres: formData.litres,
        pricePerLitre: formData.pricePerLitre,
        session: formData.session,
        // Cattle-specific fields for purchases
        cattleName: formData.cattleName,
        cattleType: formData.cattleType,
        cattleAge: formData.cattleAge,
        marketPrice: formData.marketPrice
      }

      console.log('Submitting transaction data:', transactionData)

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData)
        toast.success('Transaction updated successfully!')
        setEditingTransaction(null)
      } else {
        const result = await addTransaction(transactionData)
        console.log('Transaction result:', result)
        toast.success('Transaction added successfully!')
      }

      // Reset form and refresh data
      setFormData({
        name: '',
        type: 'income',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        litres: '',
        pricePerLitre: '',
        session: 'morning',
        cattleId: '',
        staffId: '',
        description: '',
        cattleName: '',
        cattleType: '',
        cattleAge: '',
        marketPrice: ''
      })
      setShowAddTransaction(false)
      
      // Force a fresh reload of data to ensure we get the latest transactions
      await loadData()
    } catch (error) {
      console.error('Error submitting transaction:', error)
      toast.error('Failed to save transaction')
    } finally {
      setIsSubmitting(false) // End loading
    }
  }

  // Handle edit transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      name: transaction.name,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().split('T')[0],
      litres: transaction.details?.litres?.toString() || '',
      pricePerLitre: transaction.details?.pricePerLitre?.toString() || '',
      session: transaction.details?.session || 'morning',
      cattleId: transaction.cattleId || '',
      staffId: transaction.staffId || '',
      description: transaction.details?.description || '',
      // Cattle-specific fields for purchases - stored in details.cattleDetails
      cattleName: transaction.details?.cattleDetails?.name || '',
      cattleType: transaction.details?.cattleDetails?.type || '',
      cattleAge: transaction.details?.cattleDetails?.age?.toString() || '',
      marketPrice: transaction.details?.cattleDetails?.marketPrice?.toString() || ''
    })
    setShowAddTransaction(true)
  }

  // Handle delete transaction
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id)
        toast.success('Transaction deleted successfully!')
        await loadData()
      } catch (error) {
        console.error('Error deleting transaction:', error)
        toast.error('Failed to delete transaction')
      }
    }
  }

  // Helper function to get relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const timeDiff = now - new Date(date);
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return null; // Use regular date for older transactions
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
      const matchesType = filterType === 'all' || transaction.type === filterType
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
      // Convert to timestamps for reliable comparison
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      
      // If dates are the same, sort by creation time (more recent first)
      if (dateA === dateB) {
        const createdA = new Date(a.createdAt).getTime()
        const createdB = new Date(b.createdAt).getTime()
        return createdB - createdA
      }
      
      return dateB - dateA // Most recent date first
    })

  // Pagination calculations
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterType]);

  // Get unique categories for filter
  const categories = [...new Set(transactions.map(tx => tx.category))]

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cash Flow Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Track income, expenses and financial performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Period Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white min-w-[120px]"
              >
                <option value="all">All Time</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
            </div>
            <button
              onClick={() => {
                setShowAddTransaction(true)
                setEditingTransaction(null)
                setFormData({
                  name: '',
                  type: 'income',
                  category: '',
                  amount: '',
                  date: new Date().toISOString().split('T')[0],
                  litres: '',
                  pricePerLitre: '',
                  session: 'morning',
                  cattleId: '',
                  staffId: '',
                  description: '',
                  cattleName: '',
                  cattleType: '',
                  cattleAge: '',
                  marketPrice: ''
                })
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <DollarSign className="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Income</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{safeFormatPKRCompact(totalIncome)}</p>
                <p className="text-green-100 text-xs mt-1">↗ {getPeriodDisplayName()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{safeFormatPKRCompact(totalExpenses)}</p>
                <p className="text-red-100 text-xs mt-1">↙ {getPeriodDisplayName()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} p-6 rounded-xl shadow-lg text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${netProfit >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>Net Profit</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{safeFormatPKRCompact(netProfit)}</p>
                <p className={`${netProfit >= 0 ? 'text-blue-100' : 'text-orange-100'} text-xs mt-1`}>
                  {netProfit >= 0 ? '↗' : '↙'} {getPeriodDisplayName()}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Target className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Profit Margin</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{profitMargin}%</p>
                <p className="text-purple-100 text-xs mt-1">📊 {getPeriodDisplayName()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    Recent Transactions
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Sorted by most recent first • {totalTransactions} total transactions • Showing {getPeriodDisplayName()}
                  </p>
                </div>
                {totalTransactions > 0 && (
                  <div className="bg-blue-50 px-3 py-2 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalTransactions)} of {totalTransactions}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Enhanced Mobile-first filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full hidden sm:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Type</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Related</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-12 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p>Loading transactions...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-12 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <BarChart3 className="w-12 h-12 text-gray-300" />
                        <p>No transactions found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((transaction, index) => {
                    const transactionDate = new Date(transaction.date);
                    const now = new Date();
                    const timeDiff = now - transactionDate;
                    const isToday = timeDiff < 24 * 60 * 60 * 1000; // Less than 24 hours
                    const isRecent = timeDiff < 7 * 24 * 60 * 60 * 1000; // Less than 7 days
                    
                    return (
                      <tr 
                        key={transaction.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                          isToday ? 'bg-blue-50 border-blue-200' : 
                          isRecent ? 'bg-gray-25' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isToday && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            )}
                            <div className={isToday ? 'font-medium text-blue-700' : ''}>
                              <div className="font-medium">{transactionDate.toLocaleDateString()}</div>
                              {getRelativeTime(transaction.date) && (
                                <div className="text-xs text-gray-500">
                                  {getRelativeTime(transaction.date)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      <td className="p-4 font-semibold text-gray-900">{transaction.name}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600 font-medium">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold">
                        <div className="flex flex-col">
                          <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {safeFormatPKR(transaction.amount)}
                          </span>
                          {transaction.category === 'cattle_purchase' && transaction.details?.cattleDetails?.marketPrice && (
                            <div className="text-xs text-gray-500 mt-1">
                              Purchase Price
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {transaction.cattle?.name || transaction.staff?.name || '-'}
                          {transaction.category === 'cattle_purchase' && transaction.details?.cattleDetails?.marketPrice && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              Market: {safeFormatPKRCompact(transaction.details.cattleDetails.marketPrice)}
                            </div>
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                            title="Edit transaction"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="sm:hidden">
              {loading ? (
                <div className="text-center p-12 text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p>Loading transactions...</p>
                  </div>
                </div>
              ) : paginatedTransactions.length === 0 ? (
                <div className="text-center p-12 text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <BarChart3 className="w-12 h-12 text-gray-300" />
                    <p>No transactions found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {paginatedTransactions.map((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    const now = new Date();
                    const timeDiff = now - transactionDate;
                    const isToday = timeDiff < 24 * 60 * 60 * 1000;
                    const isRecent = timeDiff < 7 * 24 * 60 * 60 * 1000;
                    
                    return (
                      <div 
                        key={transaction.id}
                        className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                          isToday ? 'border-blue-200 bg-blue-50' : 
                          isRecent ? 'border-gray-200' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {isToday && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                              )}
                              <h3 className={`font-semibold text-base ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                                {transaction.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{transactionDate.toLocaleDateString()}</span>
                              {getRelativeTime(transaction.date) && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600 font-medium">{getRelativeTime(transaction.date)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                transaction.type === 'income' 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {transaction.type}
                              </span>
                              <span className="text-sm text-gray-600 font-medium">{transaction.category}</span>
                            </div>
                            {(transaction.cattle?.name || transaction.staff?.name) && (
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">Related:</span> {transaction.cattle?.name || transaction.staff?.name}
                                {transaction.category === 'cattle_purchase' && transaction.details?.cattleDetails?.marketPrice && (
                                  <div className="text-xs text-green-600 font-medium mt-1">
                                    Market Price: {safeFormatPKRCompact(transaction.details.cattleDetails.marketPrice)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`font-bold text-xl ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {safeFormatPKRCompact(transaction.amount)}
                            </span>
                            {transaction.category === 'cattle_purchase' && transaction.details?.cattleDetails?.marketPrice && (
                              <div className="text-xs text-gray-500 mt-1">
                                Purchase Price
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-6 pb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white shadow-lg'
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
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Next
                  </button>
                </div>
                
                <div className="text-sm text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-100 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    <span className="hidden sm:inline">{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</span>
                    <span className="sm:hidden">{editingTransaction ? 'Edit' : 'Add'}</span>
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddTransaction(false)
                      setEditingTransaction(null)
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Enter transaction name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {formData.type === 'income' ? (
                      <>
                        <option value="milk_sales">Milk Sales</option>
                        <option value="cattle_sales">Cattle Sales</option>
                        <option value="other_income">Other Income</option>
                      </>
                    ) : (
                      <>
                        <option value="cattle_purchase">Cattle Purchase</option>
                        <option value="cattle_food">Cattle Food</option>
                        <option value="staff_salary">Staff Salary</option>
                        <option value="fuel_expense">Fuel Expense</option>
                        <option value="other_expense">Other Expense</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Milk-specific fields */}
                {formData.category === 'milk_sales' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Litres
                      </label>
                      <input
                        type="number"
                        value={formData.litres}
                        onChange={(e) => handleFormChange('litres', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        placeholder="Enter litres"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Per Litre (PKR)
                      </label>
                      <input
                        type="number"
                        value={formData.pricePerLitre}
                        onChange={(e) => handleFormChange('pricePerLitre', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        placeholder="Enter price per litre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session
                      </label>
                      <select
                        value={formData.session}
                        onChange={(e) => handleFormChange('session', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                      >
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (PKR)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                )}

                {/* Cattle Purchase Details */}
                {formData.category === 'cattle_purchase' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cattle Name
                      </label>
                      <input
                        type="text"
                        value={formData.cattleName}
                        onChange={(e) => handleFormChange('cattleName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        placeholder="Enter cattle name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cattle Type
                      </label>
                      <select
                        value={formData.cattleType}
                        onChange={(e) => handleFormChange('cattleType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Cow">Cow</option>
                        <option value="Bull">Bull</option>
                        <option value="Buffalo">Buffalo</option>
                        <option value="Calf">Calf</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        value={formData.cattleAge}
                        onChange={(e) => handleFormChange('cattleAge', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        placeholder="Enter age in years"
                        min="0"
                        max="20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Market Price (PKR) - Optional
                      </label>
                      <input
                        type="number"
                        value={formData.marketPrice}
                        onChange={(e) => handleFormChange('marketPrice', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        placeholder="Enter current market price"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Current market value for tracking investment performance
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    required
                  />
                </div>

                {/* Related Cattle - only for sales, not purchases */}
                {formData.category === 'cattle_sales' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Cattle
                    </label>
                    <select
                      value={formData.cattleId}
                      onChange={(e) => handleFormChange('cattleId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                    >
                      <option value="">Select Cattle</option>
                      {cattleData.filter(cattle => cattle.status === 'active').map(cattle => (
                        <option key={cattle.id} value={cattle.id}>
                          {cattle.name} ({cattle.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Related Staff */}
                {formData.category === 'staff_salary' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff Member
                    </label>
                    <select
                      value={formData.staffId}
                      onChange={(e) => handleFormChange('staffId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                    >
                      <option value="">Select Staff Member</option>
                      {staffMembers.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base resize-none"
                    placeholder="Additional details..."
                  />
                </div>

                <div className="flex flex-col gap-3 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg 
                          className="animate-spin h-5 w-5 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingTransaction ? 'Updating Transaction...' : 'Adding Transaction...'}
                      </>
                    ) : (
                      editingTransaction ? 'Update Transaction' : 'Add Transaction'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransaction(false)
                      setEditingTransaction(null)
                    }}
                    disabled={isSubmitting}
                    className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-semibold transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
