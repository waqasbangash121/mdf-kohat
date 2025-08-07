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
  Target
} from 'lucide-react'

export default function CashFlow() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState('income')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cash Flow Management</h1>
            <p className="text-gray-600">Track income, expenses, and financial performance of your dairy farm (in PKR)</p>
            <div className="flex items-center mt-3 space-x-4">
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
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button 
              onClick={() => setShowAddTransaction(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-green-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
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
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Income</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalIncome)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm">+12.5% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Total Expenses</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalExpenses)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span className="text-sm">+8.2% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Net Profit</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.netProfit)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+18.7% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Profit Margin</p>
                    <p className="text-2xl font-bold mt-1">{financialSummary.profitMargin}%</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+3.2% from last month</span>
                </div>
              </div>
            </div>

            {/* Income vs Expenses Chart Placeholder */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Monthly Trend</h3>
                <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
              <div className="h-64 bg-gradient-to-t from-gray-50 to-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Income vs Expenses Chart</p>
                  <p className="text-sm text-gray-400">Chart integration coming soon</p>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income Categories */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Income Sources</h3>
                <div className="space-y-4">
                  {incomeCategories.map((category, index) => {
                    const Icon = category.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${category.color} rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{category.name}</p>
                            <p className="text-sm text-gray-500">{category.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{formatCurrency(category.amount)}</p>
                          <p className="text-sm text-gray-500">{category.percentage}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Expense Categories */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Expense Categories</h3>
                <div className="space-y-4">
                  {expenseCategories.map((category, index) => {
                    const Icon = category.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${category.color} rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{category.name}</p>
                            <p className="text-sm text-gray-500">{category.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{formatCurrency(category.amount)}</p>
                          <p className="text-sm text-gray-500">{category.percentage}%</p>
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
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => {
                  const TransactionIcon = getTransactionIcon(transaction.type)
                  return (
                    <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-xl ${getTransactionBg(transaction.type)}`}>
                            <TransactionIcon className={`w-5 h-5 ${getTransactionColor(transaction.type)}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{transaction.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">{transaction.category}</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-500">{transaction.date} at {transaction.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-sm text-gray-500">ID: {transaction.id}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
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

        {/* Add Transaction Modal would go here */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Transaction</h3>
              <p className="text-gray-600 mb-4">Transaction form coming soon...</p>
              <button 
                onClick={() => setShowAddTransaction(false)}
                className="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 