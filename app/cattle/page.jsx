'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Circle, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Scale,
  Heart,
  MapPin,
  Award,
  TrendingUp,
  MoreVertical,
  X,
  DollarSign,
  User,
  Hash
} from 'lucide-react'

export default function CattleManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCattle, setEditingCattle] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    age: '',
    dateAdded: ''
  })

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
    }
  ])

  const filteredCattle = cattleData.filter(cattle => {
    const matchesSearch = cattle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cattle.id.includes(searchTerm) ||
                         cattle.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || cattle.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('New cattle data:', formData)
    
    // Add new cattle to the list
    const newCattle = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      age: parseInt(formData.age),
      price: parseInt(formData.price),
      dateAdded: formData.dateAdded || new Date().toISOString().split('T')[0]
    }
    
    setCattleData(prev => [...prev, newCattle])
    
    // Reset form and close modal
    setFormData({
      name: '',
      type: '',
      price: '',
      age: '',
      dateAdded: ''
    })
    setShowAddForm(false)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Updated cattle data:', formData)
    
    // Update the cattle in the list
    setCattleData(prev => prev.map(cattle => 
      cattle.id === editingCattle.id 
        ? {
            ...cattle,
            name: formData.name,
            type: formData.type,
            age: parseInt(formData.age),
            price: parseInt(formData.price),
            dateAdded: formData.dateAdded
          }
        : cattle
    ))
    
    // Reset form and close modal
    setFormData({
      name: '',
      type: '',
      price: '',
      age: '',
      dateAdded: ''
    })
    setShowEditForm(false)
    setEditingCattle(null)
  }

  const handleCloseForm = () => {
    setFormData({
      name: '',
      type: '',
      price: '',
      age: '',
      dateAdded: ''
    })
    setShowAddForm(false)
  }

  const handleCloseEditForm = () => {
    setFormData({
      name: '',
      type: '',
      price: '',
      age: '',
      dateAdded: ''
    })
    setShowEditForm(false)
    setEditingCattle(null)
  }

  const handleEditCattle = (cattle) => {
    setEditingCattle(cattle)
    setFormData({
      name: cattle.name,
      type: cattle.type,
      price: cattle.price ? cattle.price.toString() : '',
      age: cattle.age ? cattle.age.toString() : '',
      dateAdded: cattle.dateAdded || ''
    })
    setShowEditForm(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cattle Management</h1>
          <p className="text-gray-600">Manage your cattle inventory and track their details</p>
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Circle className="w-4 h-4 mr-1 text-green-500" />
              <span>{cattleData.length} Total Cattle</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
              <span>₨{cattleData.reduce((sum, c) => sum + c.price, 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Award className="w-4 h-4 mr-1 text-purple-500" />
              <span>{Math.round(cattleData.reduce((sum, c) => sum + c.age, 0) / cattleData.length)} Avg. Age</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Cattle
        </button>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center transition-all duration-200">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Cattle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCattle.map((cattle) => (
          <div key={cattle.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            {/* Cattle Avatar */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Circle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {cattle.name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {cattle.id}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditCattle(cattle)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cattle Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{cattle.type}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{cattle.age} years</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">₨{cattle.price.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Added</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{formatDate(cattle.dateAdded)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredCattle.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Circle className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cattle found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search criteria to find what you&apos;re looking for.'
              : 'Get started by adding your first cattle to begin managing your farm.'
            }
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Add New Cattle
          </button>
        </div>
      )}

      {/* Add New Cattle Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Add New Cattle</h3>
                  <p className="text-sm text-gray-500">Enter the details for your new cattle</p>
                </div>
              </div>
              <button
                onClick={handleCloseForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Cattle Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Cattle Name/ID</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter cattle name or ID number"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Cattle Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span>Cattle Type/Breed</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Enter cattle type or breed (e.g., Jersey, Holstein)"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Enter the type or breed of the cattle</p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>Purchase Price (PKR)</span>
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₨</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="1"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500">Enter the purchase price in Pakistani Rupees (PKR)</p>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Age (years)</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age in years"
                  min="0"
                  max="20"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Date Added */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Date Added</span>
                  </div>
                </label>
                <input
                  type="date"
                  name="dateAdded"
                  value={formData.dateAdded}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Select the date when the cattle was added to your farm</p>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  Add Cattle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cattle Modal */}
      {showEditForm && editingCattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Edit Cattle</h3>
                  <p className="text-sm text-gray-500">Update the details for {editingCattle.name}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Cattle Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Cattle Name/ID</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter cattle name or ID number"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Cattle Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span>Cattle Type/Breed</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Enter cattle type or breed (e.g., Jersey, Holstein)"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Enter the type or breed of the cattle</p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>Purchase Price (PKR)</span>
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₨</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="1"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500">Enter the purchase price in Pakistani Rupees (PKR)</p>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Age (years)</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age in years"
                  min="0"
                  max="20"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Date Added */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Date Added</span>
                  </div>
                </label>
                <input
                  type="date"
                  name="dateAdded"
                  value={formData.dateAdded}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Select the date when the cattle was added to your farm</p>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  Save Changes
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