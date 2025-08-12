'use client'

import { useState, useEffect } from 'react'
import { getCattle, editCattle } from '../../lib/actions'
import { toast } from 'react-toastify'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Circle, 
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
  Hash,
  ArrowRight
} from 'lucide-react'

export default function CattleManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  // Add Cattle
  const handleAddCattle = async (e) => {
    e.preventDefault()
    try {
      // Convert price and age to numbers, date to Date
      const cattleDataToSave = {
        name: formData.name,
        type: formData.type,
        price: formData.price ? parseInt(formData.price) : 0,
        age: formData.age ? parseInt(formData.age) : 0,
        date: formData.dateAdded ? new Date(formData.dateAdded).toISOString() : new Date().toISOString()
      }
      await import('../../lib/actions').then(({ addCattle }) =>
        addCattle(cattleDataToSave)
      )
      // Reload cattle data
      const cattle = await import('../../lib/actions').then(({ getCattle }) => getCattle())
      setCattleData(cattle)
      setFormData({ name: '', type: '', price: '', age: '', dateAdded: '' })
      setShowAddForm(false)
  toast.success('Cattle added successfully!')
    } catch (error) {
  toast.error('Failed to add cattle!')
    }
  }
  const [searchTerm, setSearchTerm] = useState('')
  // Removed status filter (not in schema)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCattle, setEditingCattle] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    age: '',
    dateAdded: ''
  })

  const [cattleData, setCattleData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCattle() {
      setLoading(true)
      try {
        const cattle = await getCattle()
        setCattleData(cattle)
      } catch (error) {
        console.error('Error loading cattle:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCattle()
  }, [])

  const filteredCattle = cattleData.filter(cattle => {
    const matchesSearch = cattle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cattle.id.includes(searchTerm) ||
                         cattle.type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const cattleDataToUpdate = {
        name: formData.name,
        type: formData.type,
        age: formData.age ? parseInt(formData.age) : 0,
        price: formData.price ? parseInt(formData.price) : 0,
        date: formData.dateAdded ? new Date(formData.dateAdded).toISOString() : new Date().toISOString()
      }
      await editCattle(editingCattle.id, cattleDataToUpdate)
      const cattle = await getCattle()
      setCattleData(cattle)
      setFormData({ name: '', type: '', price: '', age: '', dateAdded: '' })
      setShowEditForm(false)
      setEditingCattle(null)
      toast.success('Cattle updated successfully!')
    } catch (error) {
      toast.error('Failed to update cattle!')
    }
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
  dateAdded: cattle.date ? new Date(cattle.date).toISOString().slice(0,10) : ''
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
      {/* Beautiful Main Content with Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-8 sm:py-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                  Cattle Management
                </h1>
                <p className="text-lg sm:text-xl text-green-100 mb-4">
                  Monitor and manage your livestock with advanced tracking
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <Circle className="w-5 h-5 mr-2 text-green-200" />
                    <span className="font-semibold">{cattleData.length} Total Cattle</span>
                  </div>
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <DollarSign className="w-5 h-5 mr-2 text-green-200" />
                    <span className="font-semibold">₨{cattleData.reduce((sum, c) => sum + c.price, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <Award className="w-5 h-5 mr-2 text-green-200" />
                    <span className="font-semibold">{cattleData.length ? Math.round(cattleData.reduce((sum, c) => sum + c.age, 0) / cattleData.length) : 0} Avg. Age</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 flex items-center font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  <User className="w-6 h-6 mr-3" />
                  Add New Cattle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <main className="relative -mt-8 sm:-mt-12 px-4 sm:px-6 pb-20">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            
            {/* Beautiful Search & Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or breed type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base placeholder-gray-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button className="px-6 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center justify-center transition-all duration-300 text-base font-medium bg-white shadow-sm hover:shadow-md">
                    <Filter className="w-5 h-5 mr-2" />
                    Advanced Filters
                  </button>
                  <div className="flex border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`px-6 py-3 transition-all duration-300 text-base font-medium ${viewMode === 'grid' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                    >
                      Grid View
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`px-6 py-3 transition-all duration-300 text-base font-medium ${viewMode === 'list' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                    >
                      List View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Beautiful Cattle Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCattle.map((cattle, index) => (
                <div 
                  key={cattle.id} 
                  className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                  
                  <div className="relative z-10">
                    {/* Cattle Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Circle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 mb-1">
                            {cattle.name}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {cattle.id}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEditCattle(cattle)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110" 
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Cattle Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Breed</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{cattle.type}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Age</p>
                        <p className="text-sm font-bold text-gray-800">{cattle.age} years</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Value</p>
                        <p className="text-sm font-bold text-gray-800">₨{cattle.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Added</p>
                        <p className="text-sm font-bold text-gray-800">{formatDate(cattle.date)}</p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-green-600">Healthy</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Empty State */}
            {filteredCattle.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Circle className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No cattle found</h3>
                <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm 
                    ? "Try adjusting your search criteria to find what you're looking for."
                    : 'Start building your livestock inventory by adding your first cattle.'
                  }
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Add Your First Cattle
                </button>
              </div>
            )}
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
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Add New Cattle</h3>
                  <p className="text-xs text-gray-500">Enter the details for your new cattle</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={handleAddCattle} className="p-4 space-y-4">
              {/* Cattle Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cattle Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter cattle name"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {/* Cattle Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cattle Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Enter cattle type (e.g., Jersey, Holstein)"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price (PKR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {/* Age */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age in years"
                  min="0"
                  max="20"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {/* Date Added */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date Added</label>
                <input
                  type="date"
                  name="dateAdded"
                  value={formData.dateAdded}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {/* Form Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg font-medium text-sm"
                >
                  Add Cattle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {filteredCattle.length === 0 && (
        <div className="text-center py-8 sm:py-16 px-4">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Circle className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No cattle found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search criteria to find what you&apos;re looking for.'
              : 'No cattle data available at the moment.'
            }
          </p>
        </div>
      )}

      {/* Edit Cattle Modal - Mobile Responsive */}
      {showEditForm && editingCattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Edit Cattle</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Update the details for {editingCattle.name}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditForm}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
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
                  <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₨</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="1"
                    required
                    className="w-full pl-8 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500">Select the date when the cattle was added to your farm</p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 