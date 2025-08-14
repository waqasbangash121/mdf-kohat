"use client";
import { Home, Truck, Users, ShoppingCart, Circle, Milk, DollarSign, Target, TrendingUp, TrendingDown, Download, BarChart3, Search, Eye, Edit, Trash2, X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatPKR, formatPKRCompact, formatPakistaniNumber } from '../../utils/currency';
import { addTransaction, getCattle, getTransactions, getStaff, updateTransaction, deleteTransaction } from '../../lib/actions';

export default function CashFlow() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
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
    cattleAge: ''
  })

  // Edit mode state
  const [editingTransaction, setEditingTransaction] = useState(null)

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

  // Calculate totals
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0;

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
    
    try {
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
        cattleAge: formData.cattleAge
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
        cattleAge: ''
      })
      setShowAddTransaction(false)
      
      // Force a fresh reload of data to ensure we get the latest transactions
      await loadData()
    } catch (error) {
      console.error('Error submitting transaction:', error)
      toast.error('Failed to save transaction')
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
      description: transaction.details?.description || ''
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
                cattleAge: ''
              })
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <DollarSign className="w-4 h-4" />
            <span className="sm:inline">Add Transaction</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Income</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{safeFormatPKRCompact(totalIncome)}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Expenses</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">{safeFormatPKRCompact(totalExpenses)}</p>
              </div>
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Net Profit</p>
                <p className={`text-lg sm:text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {safeFormatPKRCompact(netProfit)}
                </p>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Profit Margin</p>
                <p className={`text-lg sm:text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitMargin}%
                </p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">Recent Transactions</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Sorted by most recent first • {totalTransactions} total transactions
                  </p>
                  {totalTransactions > 0 && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalTransactions)} of {totalTransactions}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Mobile-first filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  <th className="text-left p-4 font-medium text-gray-700">Date</th>
                  <th className="text-left p-4 font-medium text-gray-700">Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Type</th>
                  <th className="text-left p-4 font-medium text-gray-700">Category</th>
                  <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-700">Related</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">Loading...</td>
                  </tr>
                ) : paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">No transactions found</td>
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
                        className={`border-b hover:bg-gray-50 ${
                          isToday ? 'bg-blue-50 border-blue-200' : 
                          isRecent ? 'bg-gray-50' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isToday && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            )}
                            <div className={isToday ? 'font-medium text-blue-700' : ''}>
                              <div>{transactionDate.toLocaleDateString()}</div>
                              {getRelativeTime(transaction.date) && (
                                <div className="text-xs text-gray-500">
                                  {getRelativeTime(transaction.date)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      <td className="p-4 font-medium">{transaction.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="p-4">{transaction.category}</td>
                      <td className="p-4 font-medium">
                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {safeFormatPKR(transaction.amount)}
                        </span>
                      </td>
                      <td className="p-4">
                        {transaction.cattle?.name || transaction.staff?.name || '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-600 hover:text-red-800"
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
                <div className="text-center p-8 text-gray-500">Loading...</div>
              ) : paginatedTransactions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No transactions found</div>
              ) : (
                <div className="space-y-3 p-4">
                  {paginatedTransactions.map((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    const now = new Date();
                    const timeDiff = now - transactionDate;
                    const isToday = timeDiff < 24 * 60 * 60 * 1000;
                    const isRecent = timeDiff < 7 * 24 * 60 * 60 * 1000;
                    
                    return (
                      <div 
                        key={transaction.id}
                        className={`bg-white border rounded-lg p-4 ${
                          isToday ? 'border-blue-200 bg-blue-50' : 
                          isRecent ? 'border-gray-200' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {isToday && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                              )}
                              <h3 className={`font-medium text-sm ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                                {transaction.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{transactionDate.toLocaleDateString()}</span>
                              {getRelativeTime(transaction.date) && (
                                <>
                                  <span>•</span>
                                  <span>{getRelativeTime(transaction.date)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                transaction.type === 'income' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type}
                              </span>
                              <span className="text-xs text-gray-600">{transaction.category}</span>
                            </div>
                            {(transaction.cattle?.name || transaction.staff?.name) && (
                              <div className="text-xs text-gray-500">
                                Related: {transaction.cattle?.name || transaction.staff?.name}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`font-bold text-lg ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {safeFormatPKRCompact(transaction.amount)}
                            </span>
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
              <div className="flex items-center justify-between mt-6 px-4 pb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        return <span key={page} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddTransaction(false)
                      setEditingTransaction(null)
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Litres
                      </label>
                      <input
                        type="number"
                        value={formData.litres}
                        onChange={(e) => handleFormChange('litres', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Litre (PKR)
                      </label>
                      <input
                        type="number"
                        value={formData.pricePerLitre}
                        onChange={(e) => handleFormChange('pricePerLitre', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session
                      </label>
                      <select
                        value={formData.session}
                        onChange={(e) => handleFormChange('session', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (PKR)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                {/* Cattle Purchase Details */}
                {formData.category === 'cattle_purchase' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cattle Name
                      </label>
                      <input
                        type="text"
                        value={formData.cattleName}
                        onChange={(e) => handleFormChange('cattleName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter cattle name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cattle Type
                      </label>
                      <select
                        value={formData.cattleType}
                        onChange={(e) => handleFormChange('cattleType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        value={formData.cattleAge}
                        onChange={(e) => handleFormChange('cattleAge', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter age in years"
                        min="0"
                        max="20"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Related Cattle - only for sales, not purchases */}
                {formData.category === 'cattle_sales' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Related Cattle
                    </label>
                    <select
                      value={formData.cattleId}
                      onChange={(e) => handleFormChange('cattleId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Staff Member
                    </label>
                    <select
                      value={formData.staffId}
                      onChange={(e) => handleFormChange('staffId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional details..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransaction(false)
                      setEditingTransaction(null)
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
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
