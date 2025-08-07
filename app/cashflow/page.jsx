'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { formatPKR, formatPKRNatural } from '../../utils/currency'
import { 
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  PieChart,
  BarChart3,
  Circle,
  Milk,
  Users,
  Truck,
  Home,
  Zap,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  X
} from 'lucide-react'

export default function CashFlow() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState('income')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Form state variables
  const [formData, setFormData] = useState({
    transactionName: '',
    transactionType: '', // 'income' or 'expense'
    category: '',
    cattleAction: '', // Buy or Sell for cattle
    selectedCattle: '', // For cattle selection
    cattleType: '', // For new cattle type
    cattleAge: '', // For new cattle age
    amount: '',
    date: '',
    litres: '', // For milk transactions
    pricePerLitre: '',
    session: '', // Morning or Evening for milk
    selectedStaff: '', // For staff salary
  })

  // Sample staff data
  const staffMembers = [
    { id: 1, name: 'Ahmed Khan', position: 'Farm Manager' },
    { id: 2, name: 'Muhammad Ali', position: 'Milk Collector' },
    { id: 3, name: 'Fatima Bibi', position: 'Cattle Caretaker' },
    { id: 4, name: 'Hassan Raza', position: 'Driver' },
    { id: 5, name: 'Ayesha Khan', position: 'Accountant' }
  ]

  // Sample cattle data - convert to state for dynamic updates
  const [cattleData, setCattleData] = useState([
    {
      id: '1234',
      name: 'Bessie',
      type: 'Jersey',
      age: 4,
      price: 150000,
      dateAdded: '2024-01-15'
    },
    {
      id: '1235',
      name: 'Daisy',
      type: 'Holstein',
      age: 6,
      price: 180000,
      dateAdded: '2024-01-14'
    },
    {
      id: '1236',
      name: 'Molly',
      type: 'Guernsey',
      age: 3,
      price: 120000,
      dateAdded: '2024-01-13'
    },
    {
      id: '1237',
      name: 'Rosie',
      type: 'Ayrshire',
      age: 5,
      price: 160000,
      dateAdded: '2024-01-12'
    },
    {
      id: '1238',
      name: 'Buttercup',
      type: 'Brown Swiss',
      age: 7,
      price: 200000,
      dateAdded: '2024-01-11'
    }
  ])

  // Financial data (in PKR)
  const financialSummary = {
    totalIncome: 12580000,  // 12.58 million PKR
    totalExpenses: 8740000,  // 8.74 million PKR
    netProfit: 3840000,     // 3.84 million PKR
    profitMargin: 30.5
  }

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
    return formatPKRNatural(amount)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // If this is a "buy cattle" transaction, add the new cattle to the cattleData
    if (formData.category === 'buy cattle') {
      const newCattle = {
        id: String(Date.now()), // Generate a unique ID
        name: formData.transactionName || `Cattle-${Date.now()}`, // Use transaction name or generate one
        type: formData.cattleType,
        age: parseInt(formData.cattleAge),
        price: parseInt(formData.amount),
        dateAdded: formData.date
      }
      
      // Add to cattleData using state setter
      setCattleData(prevCattleData => [...prevCattleData, newCattle])
      console.log('New cattle added:', newCattle)
    }
    
    // If this is a "sell cattle" transaction, remove the cattle from cattleData
    if (formData.category === 'sell cattle' && formData.selectedCattle) {
      setCattleData(prevCattleData => {
        const soldCattleIndex = prevCattleData.findIndex(cattle => cattle.id === formData.selectedCattle)
        if (soldCattleIndex !== -1) {
          const soldCattle = prevCattleData[soldCattleIndex]
          console.log('Cattle sold and removed:', soldCattle)
          return prevCattleData.filter((_, index) => index !== soldCattleIndex)
        }
        return prevCattleData
      })
    }
    
    // Here you would typically save the transaction to your backend
    console.log('Transaction Data:', formData)
    
    // Reset form and close modal
    resetForm()
    setShowAddTransaction(false)
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
        )

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
        )

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
        )

      case 'buy cattle':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cattle Type/Breed
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years)
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Amount (PKR)
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
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
        )

      case 'cattle food':
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
                  Date of Transaction
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
        )

      case 'staff salary':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Staff Member
                </label>
                <select
                  value={formData.selectedStaff}
                  onChange={(e) => handleFormChange('selectedStaff', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Staff Member</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} - {staff.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid (PKR)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  placeholder="Enter salary amount"
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
        )

      case 'fuel expense':
      case 'other expense':
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
                  Date of Transaction
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
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
        {/* Enhanced Header - Mobile Responsive */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Cash Flow Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Track income, expenses, and financial performance of your dairy farm (in PKR)</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span>+{financialSummary.profitMargin}% profit margin</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
                <span>{formatCurrency(financialSummary.netProfit)} net profit</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button 
              onClick={() => setShowAddTransaction(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 sm:px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-green-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Tab Navigation - Mobile Responsive with Horizontal Scroll */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'income', label: 'Income', icon: TrendingUp },
              { id: 'expenses', label: 'Expenses', icon: TrendingDown },
              { id: 'transactions', label: 'Transactions', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Financial Summary Cards - Mobile Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs sm:text-sm">Total Income</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalIncome)}</p>
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
                    <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalExpenses)}</p>
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
                    <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(financialSummary.netProfit)}</p>
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
                    <p className="text-lg sm:text-2xl font-bold mt-1">{financialSummary.profitMargin}%</p>
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
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Monthly Trend</h3>
                <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm self-start sm:self-auto">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
              <div className="h-48 sm:h-64 bg-gradient-to-t from-gray-50 to-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm sm:text-base text-gray-500">Income vs Expenses Chart</p>
                  <p className="text-xs sm:text-sm text-gray-400">Chart integration coming soon</p>
                </div>
              </div>
            </div>

            {/* Category Breakdown - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Income Categories */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Income Sources</h3>
                <div className="space-y-3 sm:space-y-4">
                  {incomeCategories.map((category, index) => {
                    const Icon = category.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`p-1.5 sm:p-2 ${category.color} rounded-lg`}>
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm sm:text-base">{category.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{category.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">{formatCurrency(category.amount)}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{category.percentage}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Expense Categories */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Expense Categories</h3>
                <div className="space-y-3 sm:space-y-4">
                  {expenseCategories.map((category, index) => {
                    const Icon = category.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`p-1.5 sm:p-2 ${category.color} rounded-lg`}>
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm sm:text-base">{category.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{category.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">{formatCurrency(category.amount)}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{category.percentage}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Search and Filter - Mobile Responsive */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">All Categories</option>
                <option value="income">Income Only</option>
                <option value="expenses">Expenses Only</option>
                <option value="milk">Milk Sales</option>
                <option value="cattle">Cattle Sales</option>
                <option value="feed">Feed & Fodder</option>
                <option value="salaries">Staff Salaries</option>
              </select>
            </div>

            {/* Transactions List - Mobile Responsive */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => {
                  const TransactionIcon = getTransactionIcon(transaction.type)
                  return (
                    <div key={transaction.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                          <div className={`p-2 rounded-xl ${getTransactionBg(transaction.type)} flex-shrink-0`}>
                            <TransactionIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${getTransactionColor(transaction.type)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm sm:text-base">{transaction.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                              <span className="text-xs sm:text-sm text-gray-500">{transaction.category}</span>
                              <span className="hidden sm:inline text-sm text-gray-400">•</span>
                              <span className="text-xs sm:text-sm text-gray-500">{transaction.date} at {transaction.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          <div className="text-right">
                            <p className={`font-semibold ${getTransactionColor(transaction.type)} text-sm sm:text-base`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">ID: {transaction.id}</p>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
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
      </div>
    </DashboardLayout>
  )
} 