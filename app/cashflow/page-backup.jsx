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
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select Cattle to Sell
                      </label>
                      <select
                        value={formData.selectedCattle}
                        onChange={(e) => handleFormChange('selectedCattle', e.target.value)}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Sale Amount (PKR)
                      </label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleFormChange('amount', e.target.value)}
                        placeholder="Enter sale amount in PKR"
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Sale Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleFormChange('date', e.target.value)}
                        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </>
              );
      case 'milk':
        return (
          <>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Number of Litres
                </label>
                <input
                  type="number"
                  value={formData.litres}
                  onChange={(e) => handleFormChange('litres', e.target.value)}
                  placeholder="Enter number of litres"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price per Litre (PKR)
                </label>
                <input
                  type="number"
                  value={formData.pricePerLitre}
                  onChange={(e) => handleFormChange('pricePerLitre', e.target.value)}
                  placeholder="Enter price per litre"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Date of Sale
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Session
                </label>
                <select
                  value={formData.session}
                  onChange={(e) => handleFormChange('session', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
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
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter amount in PKR"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'buy cattle':
        return (
          <>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Cattle Name</label>
                <input
                  type="text"
                  value={formData.cattleName || ''}
                  onChange={(e) => handleFormChange('cattleName', e.target.value)}
                  placeholder="Enter cattle name"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Cattle Type/Breed</label>
                <input
                  type="text"
                  value={formData.cattleType}
                  onChange={(e) => handleFormChange('cattleType', e.target.value)}
                  placeholder="Enter cattle type (e.g., Jersey, Holstein, Guernsey)"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Age (years)</label>
                <input
                  type="number"
                  value={formData.cattleAge}
                  onChange={(e) => handleFormChange('cattleAge', e.target.value)}
                  placeholder="Enter age in years"
                  min="0"
                  max="20"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Purchase Amount (PKR)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter purchase amount in PKR"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Purchase Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
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
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amount (PKR)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter amount in PKR"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-lg transition-all duration-200"
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
      {/* Beautiful Main Content with Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-8 sm:py-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                  Cash Flow Management
                </h1>
                <p className="text-lg sm:text-xl text-emerald-100 mb-4">
                  Track income, expenses, and optimize your farm&apos;s financial performance
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-200" />
                    <span className="font-semibold">Net Profit: {formatCurrency(netProfit)}</span>
                  </div>
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <Target className="w-5 h-5 mr-2 text-emerald-200" />
                    <span className="font-semibold">Margin: {profitMargin}%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <button
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 flex items-center font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  <DollarSign className="w-6 h-6 mr-3" />
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <main className="relative -mt-8 sm:-mt-12 px-4 sm:px-6 pb-20">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            {/* Financial Summary Cards - Enhanced with Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="group bg-white/80 backdrop-blur-sm border border-green-200/50 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600/80 text-sm font-medium">Total Income</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">{formatCurrency(totalIncome)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-300">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-semibold">+12.5% from last month</span>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-red-200/50 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600/80 text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-700 mt-2">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl group-hover:from-red-600 group-hover:to-pink-700 transition-all duration-300">
                    <TrendingDown className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowDownRight className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-600 font-semibold">+8.2% from last month</span>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-blue-200/50 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600/80 text-sm font-medium">Net Profit</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">{formatCurrency(netProfit)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600 font-semibold">+18.7% from last month</span>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-purple-200/50 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600/80 text-sm font-medium">Profit Margin</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-700 mt-2">{profitMargin}%</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl group-hover:from-purple-600 group-hover:to-violet-700 transition-all duration-300">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-600 font-semibold">+3.2% from last month</span>
                </div>
              </div>
            </div>

            {/* Income vs Expenses Chart - Enhanced with Glass Morphism */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Income Section */}
              <div className="bg-white/60 backdrop-blur-lg border border-green-200/50 rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-700 flex items-center">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mr-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    Income Transactions
                  </h3>
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {transactions.filter(tx => tx.type === 'income').length} Records
                  </div>
                </div>
                <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-2">
                  {transactions.filter(tx => tx.type === 'income').length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-green-500" />
                      </div>
                      <p className="text-gray-500 text-lg">No income transactions found.</p>
                    </div>
                  ) : (
                    transactions.filter(tx => tx.type === 'income').map((tx, index) => (
                      <div key={tx.id} 
                           className="group bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/60 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                           style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Transaction Name */}
                        {tx.name && (
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-lg text-green-800 group-hover:text-green-900 transition-colors">{tx.name}</span>
                            <span className="text-xs text-gray-500 bg-white/60 px-3 py-1 rounded-full">
                              {tx.date ? new Date(tx.date).toLocaleDateString() : '-'}
                            </span>
                          </div>
                        )}
                        {/* Transaction Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {tx.type && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">Type</span>
                              <span className="font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-lg text-xs">{tx.type}</span>
                            </div>
                          )}
                          {tx.category && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">Category</span>
                              <span className="font-semibold text-green-700">{tx.category}</span>
                            </div>
                          )}
                          {tx.amount && (
                            <div className="flex items-center justify-between sm:col-span-2">
                              <span className="text-sm text-gray-600 font-medium">Amount</span>
                              <span className="font-bold text-green-700 text-lg">{formatPKR(tx.amount)}</span>
                            </div>
                          )}
                        </div>
                        {/* Details */}
                        {tx.details && (
                          <div className="mt-3 text-sm text-gray-600 bg-white/50 p-3 rounded-xl">{tx.details}</div>
                        )}
                        {/* Additional Fields */}
                        {Object.entries(tx).map(([key, value]) => (
                          ['id', 'name', 'type', 'category', 'amount', 'details', 'date', 'milkProductionId', 'cattleId', 'cattle'].includes(key) || !value ? null : (
                            <div key={key} className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-600 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
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
              <div className="bg-white/60 backdrop-blur-lg border border-red-200/50 rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-700 flex items-center">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mr-4">
                      <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                    Expense Transactions
                  </h3>
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {transactions.filter(tx => tx.type === 'expense').length} Records
                  </div>
                </div>
                <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-2">
                  {transactions.filter(tx => tx.type === 'expense').length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingDown className="w-10 h-10 text-red-500" />
                      </div>
                      <p className="text-gray-500 text-lg">No expense transactions found.</p>
                    </div>
                  ) : (
                    transactions.filter(tx => tx.type === 'expense').map((tx, index) => (
                      <div key={tx.id} 
                           className="group bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                           style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Transaction Name */}
                        {tx.name && (
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-lg text-red-800 group-hover:text-red-900 transition-colors">{tx.name}</span>
                            <span className="text-xs text-gray-500 bg-white/60 px-3 py-1 rounded-full">
                              {tx.date ? new Date(tx.date).toLocaleDateString() : '-'}
                            </span>
                          </div>
                        )}
                        {/* Transaction Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {tx.type && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">Type</span>
                              <span className="font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-lg text-xs">{tx.type}</span>
                            </div>
                          )}
                          {tx.category && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 font-medium">Category</span>
                              <span className="font-semibold text-red-700">{tx.category}</span>
                            </div>
                          )}
                          {tx.amount && (
                            <div className="flex items-center justify-between sm:col-span-2">
                              <span className="text-sm text-gray-600 font-medium">Amount</span>
                              <span className="font-bold text-red-700 text-lg">{formatPKR(tx.amount)}</span>
                            </div>
                          )}
                        </div>
                        {/* Details */}
                        {tx.details && (
                          <div className="mt-3 text-sm text-gray-600 bg-white/50 p-3 rounded-xl">{tx.details}</div>
                        )}
                        {/* Show cattle name if present */}
                        {tx.cattle && tx.cattle.name && (
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600 font-medium">Cattle Name</span>
                            <span className="font-semibold text-red-700">{tx.cattle.name}</span>
                          </div>
                        )}
                        {/* Additional Fields */}
                        {Object.entries(tx).map(([key, value]) =>
                          (['id', 'name', 'type', 'category', 'amount', 'details', 'date', 'milkProductionId', 'cattleId', 'cattle'].includes(key) || !value) ? null : (
                            <div key={key} className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-600 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
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
        </main>

        {/* Recent Transactions - Enhanced Grid Layout */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {transactions.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xl">No transactions found.</p>
                </div>
              ) : (
                transactions.map((transaction, index) => {
                  const TransactionIcon = getTransactionIcon(transaction.type)
                  return (
                    <div key={transaction.id} 
                         className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                         style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-2xl ${transaction.type === 'income' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}>
                            <TransactionIcon className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors">{transaction.name}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Amount</span>
                          <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Date</span>
                          <span className="text-gray-700 font-semibold">
                            {new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        
                        {transaction.incomeType && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Income Type</span>
                            <span className="text-green-600 font-semibold">{transaction.incomeType}</span>
                          </div>
                        )}
                        
                        {transaction.expenseType && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Expense Type</span>
                            <span className="text-red-600 font-semibold">{transaction.expenseType}</span>
                          </div>
                        )}
                        
                        {transaction.cattle && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Cattle</span>
                            <span className="text-gray-700 font-semibold">{transaction.cattle.name} ({transaction.cattle.type})</span>
                          </div>
                        )}
                        
                        {transaction.staff && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Staff</span>
                            <span className="text-gray-700 font-semibold">{transaction.staff.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Enhanced Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-6 sm:p-8 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-3xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl mr-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Add New Transaction</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowAddTransaction(false)
                    resetForm()
                  }}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Transaction Name
                  </label>
                  <input
                    type="text"
                    value={formData.transactionName}
                    onChange={(e) => handleFormChange('transactionName', e.target.value)}
                    placeholder="Enter transaction name"
                    className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 text-lg transition-all duration-200"
                    required
                  />
                </div>

                {/* Transaction Type (Income/Expense) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Transaction Type
                  </label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => {
                      handleFormChange('transactionType', e.target.value)
                      handleFormChange('category', '') // Reset category when transaction type changes
                    }}
                    className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 text-lg transition-all duration-200"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50/50 text-lg transition-all duration-200"
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
                {formData.category && (
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50">
                    {renderFormFields()}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransaction(false)
                      resetForm()
                    }}
                    className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Add Transaction
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