"use client";
import { Home, Truck, Users, ShoppingCart, Circle, Milk, DollarSign, Target, TrendingUp, TrendingDown, Download, BarChart3, Search, Eye, Edit, Trash2, X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatPKR, formatPKRCompact, formatPakistaniNumber } from '../../utils/currency';
import { addTransaction } from '../../lib/actions';

export default function CashFlow() {
  // ...existing code...
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState('income')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  // Database state
  const [cattleData, setCattleData] = useState([])
  const [staffMembers, setStaffMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Form state variables
  const [formData, setFormData] = useState({
    transactionName: '',
    transactionType: '',
    category: '',
    cattleAction: '',
    selectedCattle: '',
    cattleType: '',
    cattleAge: '',
    cattleName: '',
    amount: '',
    date: '',
    litres: '',
    pricePerLitre: '',
    session: '',
    selectedStaff: '',
  })

  // Load data from database
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [cattleRes, staffRes, transactionRes] = await Promise.all([
          fetch('/api/cattle'),
          fetch('/api/staff'),
          fetch('/api/transaction')
        ])
        const [cattle, staff, transactionData] = await Promise.all([
          cattleRes.json(),
          staffRes.json(),
          transactionRes.json()
        ])
        setCattleData(cattle)
        setStaffMembers(staff)
        setTransactions(transactionData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Calculate total income from transactions
  const totalIncome = transactions
    .filter(tx => tx.type === 'income' && tx.amount)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Calculate total expenses from transactions
  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense' && tx.amount)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Calculate net profit from total income and expenses
  const netProfit = totalIncome - totalExpenses;
  // Calculate profit margin
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0;

  const monthlyTrend = [
    { month: 'Jan', income: 9800000, expenses: 6500000, profit: 3300000 },
    { month: 'Feb', income: 10500000, expenses: 7200000, profit: 3300000 },
    { month: 'Mar', income: 11200000, expenses: 7800000, profit: 3400000 },
    { month: 'Apr', income: 11800000, expenses: 8200000, profit: 3600000 },
    { month: 'May', income: 12580000, expenses: 8740000, profit: 3840000 }
  ]

  const incomeCategories = [
    { 
      name: 'Milk Sales', 
      amount: 8950000, 
      percentage: 71.2, 
      icon: Milk, 
      color: 'bg-blue-500',
      transactions: 156
    },
    { 
      name: 'Cattle Sales', 
      amount: 2800000, 
      percentage: 22.3, 
      icon: Circle, 
      color: 'bg-green-500',
      transactions: 8
    },
    { 
      name: 'Other Income', 
      amount: 830000, 
      percentage: 6.5, 
      icon: DollarSign, 
      color: 'bg-purple-500',
      transactions: 12
    }
  ]

  const expenseCategories = [
    {
      name: 'Buy Cattle',
      amount: 0, // Update dynamically if needed
      percentage: 0,
      icon: Circle, // Or another relevant icon
      color: 'bg-teal-500',
      transactions: 0
    },
    { 
      name: 'Feed & Fodder', 
      amount: 3240000, 
      percentage: 37.1, 
      icon: ShoppingCart, 
      color: 'bg-orange-500',
      transactions: 45
    },
    { 
      name: 'Staff Salaries', 
      amount: 2400000, 
      percentage: 27.5, 
      icon: Users, 
      color: 'bg-indigo-500',
      transactions: 15
    },
    { 
      name: 'Fuel & Transport', 
      amount: 1280000, 
      percentage: 14.6, 
      icon: Truck, 
      color: 'bg-red-500',
      transactions: 28
    },
    { 
      name: 'Rent & Utilities', 
      amount: 920000, 
      percentage: 10.5, 
      icon: Home, 
      color: 'bg-yellow-500',
      transactions: 8
    },
    { 
      name: 'Medical & Vet', 
      amount: 580000, 
      percentage: 6.6, 
      icon: Target, 
      color: 'bg-pink-500',
      transactions: 18
    },
    { 
      name: 'Other Expenses', 
      amount: 320000, 
      percentage: 3.7, 
      icon: DollarSign, 
      color: 'bg-gray-500',
      transactions: 22
    }
  ]

  const recentTransactions = [
    {
      id: 'TXN001',
      type: 'income',
      category: 'Milk Sales',
      description: 'Daily milk collection - Vendor A',
      amount: 450000,  // PKR 4,50,000
      date: '2024-01-15',
      time: '09:30 AM',
      status: 'completed'
    },
    {
      id: 'TXN002',
      type: 'expense',
      category: 'Feed & Fodder',
      description: 'Premium cattle feed - 500kg',
      amount: 280000,  // PKR 2,80,000
      date: '2024-01-15',
      time: '08:15 AM',
      status: 'completed'
    },
    {
      id: 'TXN003',
      type: 'income',
      category: 'Cattle Sales',
      description: 'Holstein cow #H234 - Premium grade',
      amount: 1500000,  // PKR 15,00,000
      date: '2024-01-14',
      time: '03:45 PM',
      status: 'completed'
    },
    {
      id: 'TXN004',
      type: 'expense',
      category: 'Staff Salaries',
      description: 'Monthly salary - Farm Manager',
      amount: 800000,  // PKR 8,00,000
      date: '2024-01-14',
      time: '11:00 AM',
      status: 'completed'
    },
    {
      id: 'TXN005',
      type: 'expense',
      category: 'Fuel & Transport',
      description: 'Diesel for tractor and vehicles',
      amount: 120000,  // PKR 1,20,000
      date: '2024-01-13',
      time: '02:20 PM',
      status: 'completed'
    }
  ]

  // Use natural language PKR formatting for better readability
  const formatCurrency = (amount) => {
    return formatPKR(amount)
  }

  const getTransactionIcon = (type) => {
    return type === 'income' ? ArrowUpRight : ArrowDownRight
  }

  const getTransactionColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  const getTransactionBg = (type) => {
    return type === 'income' ? 'bg-green-50' : 'bg-red-50'
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      transactionName: '',
      transactionType: '',
      category: '',
      cattleAction: '',
      selectedCattle: '',
      cattleType: '',
      cattleAge: '',
      amount: '',
      date: '',
      litres: '',
      pricePerLitre: '',
      session: '',
      selectedStaff: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let transactionPayload = {
        ...formData,
        selectedCattle: formData.selectedCattle === '' ? null : formData.selectedCattle
      }
      // If buying cattle, add cattle first and link transaction
      if (
        formData.transactionType === 'expense' &&
        formData.category === 'buy cattle'
      ) {
        // Validate required fields for cattle
        if (!formData.cattleName || !formData.cattleType || !formData.cattleAge || !formData.amount || !formData.date) {
          toast.error('Please fill all required cattle fields.')
          return
        }
        // Add cattle to database
        const cattleDataToSave = {
          name: formData.cattleName,
          type: formData.cattleType,
          age: parseInt(formData.cattleAge),
          price: parseInt(formData.amount),
          date: new Date(formData.date).toISOString()
        }
        try {
          const { addCattle } = await import('../../lib/actions')
          const newCattle = await addCattle(cattleDataToSave)
          transactionPayload.selectedCattle = newCattle.id
          // Always add transaction after cattle is added
          await addTransaction(transactionPayload)
          toast.success('Cattle added and transaction recorded successfully!')
        } catch (err) {
          toast.error(err?.message || 'Failed to add cattle or record transaction!')
          return
        }
      } else {
        // Add transaction to database (for all other cases)
        await addTransaction(transactionPayload)
        toast.success('Transaction added successfully!')
      }
      // No need to call removeCattle here; backend already deletes cattle for sell cattle transactions
      // Reload data
      const [cattle, transactionData] = await Promise.all([
        getCattle(),
        getTransactions()
      ])
      setCattleData(cattle)
      setTransactions(transactionData)
      // Reset form and close modal
      resetForm()
      setShowAddTransaction(false)
    } catch (error) {
      toast.error(error?.message || 'Failed to add transaction!')
    }
  }

  const renderFormFields = () => {
    switch (formData.category) {
      case 'sell cattle':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Cattle to Sell
                </label>
                <select
                  value={formData.selectedCattle}
                  onChange={(e) => handleFormChange('selectedCattle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Cattle</option>
                  {cattleData.map((cattle) => (
                    <option key={cattle.id} value={cattle.id}>
                      {cattle.name} - {cattle.type} (ID: {cattle.id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Amount (PKR)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter sale amount in PKR"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'milk':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Litres
                </label>
                <input
                  type="number"
                  value={formData.litres}
                  onChange={(e) => handleFormChange('litres', e.target.value)}
                  placeholder="Enter number of litres"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Litre (PKR)
                </label>
                <input
                  type="number"
                  value={formData.pricePerLitre}
                  onChange={(e) => handleFormChange('pricePerLitre', e.target.value)}
                  placeholder="Enter price per litre"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Sale
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Session</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>
          </>
        );
      case 'other income':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter amount in PKR"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'buy cattle':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cattle Name</label>
                <input
                  type="text"
                  value={formData.cattleName || ''}
                  onChange={(e) => handleFormChange('cattleName', e.target.value)}
                  placeholder="Enter cattle name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cattle Type/Breed</label>
                <input
                  type="text"
                  value={formData.cattleType}
                  onChange={(e) => handleFormChange('cattleType', e.target.value)}
                  placeholder="Enter cattle type (e.g., Jersey, Holstein, Guernsey)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={formData.cattleAge}
                  onChange={(e) => handleFormChange('cattleAge', e.target.value)}
                  placeholder="Enter age in years"
                  min="0"
                  max="20"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Amount (PKR)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter purchase amount in PKR"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'cattle food':
      case 'staff salary':
      case 'fuel expense':
      case 'other expense':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (PKR)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter amount in PKR"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </>
        );
    }
    return null;
  }

  return (
    <DashboardLayout>
      <>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow"
                onClick={() => setShowAddTransaction(true)}
              >
                + Add Transaction
              </button>
            </div>
            {/* Financial Summary Cards - Mobile Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs sm:text-sm">Total Income</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(totalIncome)}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center">
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">+12.5% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 sm:p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-xs sm:text-sm">Total Expenses</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center">
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">+8.2% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Net Profit</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(netProfit)}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">+18.7% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 sm:p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs sm:text-sm">Profit Margin</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{profitMargin}%</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">+3.2% from last month</span>
                </div>
              </div>
            </div>

            {/* Income vs Expenses Chart Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Section */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-500" />Income Transactions</h3>
                <div className="space-y-4 max-h-[28rem] overflow-y-auto">
                  {transactions.filter(tx => tx.type === 'income').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No income transactions found.</div>
                  ) : (
                    transactions.filter(tx => tx.type === 'income').map((tx) => (
                      <div key={tx.id} className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-4 shadow flex flex-col gap-2">
                        {/* Transaction Name */}
                        {tx.name && (
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-green-800">{tx.name}</span>
                            <span className="text-xs text-gray-500">{tx.date ? new Date(tx.date).toLocaleDateString() : '-'}</span>
                          </div>
                        )}
                        {/* Transaction Type */}
                        {tx.type && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Type</span>
                            <span className="font-semibold text-green-700">{tx.type}</span>
                          </div>
                        )}
                        {/* Category */}
                        {tx.category && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Category</span>
                            <span className="font-semibold text-green-700">{tx.category}</span>
                          </div>
                        )}
                        {/* Amount */}
                        {tx.amount && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Amount</span>
                            <span className="font-semibold text-green-700">{formatPKR(tx.amount)}</span>
                          </div>
                        )}
                        {/* Details */}
                        {tx.details && (
                          <div className="text-sm text-gray-500">{tx.details}</div>
                        )}
                        {/* Show any other fields with values */}
                        {Object.entries(tx).map(([key, value]) => (
                          ['id', 'name', 'type', 'category', 'amount', 'details', 'date', 'milkProductionId', 'cattleId', 'cattle'].includes(key) || !value ? null : (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                              <span className="font-semibold text-green-700">{String(value)}</span>
                            </div>
                          )
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* Expense Section */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center"><TrendingDown className="w-5 h-5 mr-2 text-red-500" />Expense Transactions</h3>
                <div className="space-y-4 max-h-[28rem] overflow-y-auto">
                  {transactions.filter(tx => tx.type === 'expense').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No expense transactions found.</div>
                  ) : (
                    transactions.filter(tx => tx.type === 'expense').map((tx) => (
                      <div key={tx.id} className="bg-gradient-to-r from-red-50 to-pink-100 border border-red-200 rounded-xl p-4 shadow flex flex-col gap-2">
                        {/* Transaction Name */}
                        {tx.name && (
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-red-800">{tx.name}</span>
                            <span className="text-xs text-gray-500">{tx.date ? new Date(tx.date).toLocaleDateString() : '-'}</span>
                          </div>
                        )}
                        {/* Transaction Type */}
                        {tx.type && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Type</span>
                            <span className="font-semibold text-red-700">{tx.type}</span>
                          </div>
                        )}
                        {/* Category */}
                        {tx.category && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Category</span>
                            <span className="font-semibold text-red-700">{tx.category}</span>
                          </div>
                        )}
                        {/* Amount */}
                        {tx.amount && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Amount</span>
                            <span className="font-semibold text-red-700">{formatPKR(tx.amount)}</span>
                          </div>
                        )}
                        {/* Details */}
                        {tx.details && (
                          <div className="text-sm text-gray-500">{tx.details}</div>
                        )}
                        {/* Show cattle name if present and hide cattleId/cattle fields */}
                        {tx.cattle && tx.cattle.name && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Cattle Name</span>
                            <span className="font-semibold text-red-700">{tx.cattle.name}</span>
                          </div>
                        )}
                        {/* Show any other fields with values except cattleId/cattle */}
                        {Object.entries(tx).map(([key, value]) =>
                          (['id', 'name', 'type', 'category', 'amount', 'details', 'date', 'milkProductionId', 'cattleId', 'cattle'].includes(key) || !value) ? null : (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                              <span className="font-semibold text-red-700">{String(value)}</span>
                            </div>
                          )
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions - Styled Cards */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {transactions.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">No transactions found.</div>
              ) : (
                transactions.map((transaction) => {
                  const TransactionIcon = getTransactionIcon(transaction.type)
                  return (
                    <div key={transaction.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <TransactionIcon className={`w-6 h-6 ${getTransactionColor(transaction.type)}`} />
                          <span className="font-bold text-lg text-gray-800">{transaction.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded bg-gray-50 text-gray-600 font-semibold`}>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-semibold">Amount:</span>
                        <span className="ml-2 text-blue-700">{formatCurrency(transaction.amount)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-semibold">Date:</span>
                        <span className="ml-2">{new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      {transaction.incomeType && (
                        <div className="flex items-center text-sm text-green-600">
                          <span className="font-semibold">Income Type:</span>
                          <span className="ml-2">{transaction.incomeType}</span>
                        </div>
                      )}
                      {transaction.expenseType && (
                        <div className="flex items-center text-sm text-red-600">
                          <span className="font-semibold">Expense Type:</span>
                          <span className="ml-2">{transaction.expenseType}</span>
                        </div>
                      )}
                      {transaction.cattle && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold">Cattle:</span>
                          <span className="ml-2">{transaction.cattle.name} ({transaction.cattle.type})</span>
                        </div>
                      )}
                      {transaction.staff && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold">Staff:</span>
                          <span className="ml-2">{transaction.staff.name}</span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Add Transaction Modal - Mobile Responsive */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Add New Transaction</h3>
                <button 
                  onClick={() => {
                    setShowAddTransaction(false)
                    resetForm()
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Name
                  </label>
                  <input
                    type="text"
                    value={formData.transactionName}
                    onChange={(e) => handleFormChange('transactionName', e.target.value)}
                    placeholder="Enter transaction name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Transaction Type (Income/Expense) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => {
                      handleFormChange('transactionType', e.target.value)
                      handleFormChange('category', '') // Reset category when transaction type changes
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Transaction Type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                {/* Category based on Transaction Type */}
                {formData.transactionType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {formData.transactionType === 'income' ? (
                        <>
                          <option value="sell cattle">Sell Cattle</option>
                          <option value="milk">Milk</option>
                          <option value="other income">Other</option>
                        </>
                      ) : (
                        <>
                          <option value="buy cattle">Buy Cattle</option>
                          <option value="cattle food">Cattle Food</option>
                          <option value="staff salary">Staff Salary</option>
                          <option value="fuel expense">Fuel Expense</option>
                          <option value="other expense">Other Expense</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Dynamic Form Fields */}
                {formData.category && renderFormFields()}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransaction(false)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  )
}