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
    description: ''
  })

  // Edit mode state
  const [editingTransaction, setEditingTransaction] = useState(null)

  // Load data from database
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [cattle, staff, transactionData] = await Promise.all([
        getCattle(),
        getStaff(), 
        getTransactions()
      ])
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
        session: formData.session
      }

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData)
        toast.success('Transaction updated successfully!')
        setEditingTransaction(null)
      } else {
        await addTransaction(transactionData)
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
        description: ''
      })
      setShowAddTransaction(false)
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

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  const categories = [...new Set(transactions.map(tx => tx.category))]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cash Flow Management</h1>
            <p className="text-gray-600 mt-1">Track income, expenses and financial performance</p>
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
                description: ''
              })
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatPKR(totalIncome)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatPKR(totalExpenses)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPKR(netProfit)}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Profit Margin</p>
                <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitMargin}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
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
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">No transactions found</td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {new Date(transaction.date).toLocaleDateString()}
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
                          {formatPKR(transaction.amount)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddTransaction(false)
                    setEditingTransaction(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Related Cattle */}
                {(formData.category === 'cattle_sales' || formData.category === 'cattle_purchase') && (
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
                      {cattleData.map(cattle => (
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
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransaction(false)
                      setEditingTransaction(null)
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
