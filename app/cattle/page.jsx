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
        purchasePrice: formData.price ? parseInt(formData.price) : 0,
        age: formData.age ? parseInt(formData.age) : 0,
        purchaseDate: formData.dateAdded ? new Date(formData.dateAdded).toISOString() : new Date().toISOString()
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
  const [showSoldCattle, setShowSoldCattle] = useState(false)
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingCattle, setDeletingCattle] = useState(null)

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

  // Enhanced filter to exclude sold cattle by default and improved search
  const filteredCattle = cattleData.filter(cattle => {
    if (!cattle) return false;
    
    // Enhanced search functionality
    const searchTerm_trimmed = searchTerm.trim();
    const searchLower = searchTerm_trimmed.toLowerCase();
    
    if (searchTerm_trimmed === '') return showSoldCattle || cattle.status !== 'sold';
    
    // Helper function to safely search in text fields
    const searchInTextField = (field) => {
      if (field === null || field === undefined) return false;
      return String(field).toLowerCase().includes(searchLower);
    };
    
    // Special handling for price (can be decimal)
    const searchInPrice = (price, searchTerm) => {
      if (price === null || price === undefined) return false;
      return String(price).includes(searchTerm);
    };
    
    // Search in all relevant fields (excluding age)
    const matchesSearch = 
      searchInTextField(cattle.name) ||
      searchInTextField(cattle.id) ||
      searchInTextField(cattle.type) ||
      searchInPrice(cattle.purchasePrice, searchTerm_trimmed);
    
    // Filter by status: show only active cattle unless showSoldCattle is true
    const matchesStatus = showSoldCattle || cattle.status !== 'sold';
    
    return matchesSearch && matchesStatus;
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
        price: cattle.purchasePrice ? cattle.purchasePrice.toString() : '',
        age: cattle.age ? cattle.age.toString() : '',
  dateAdded: cattle.purchaseDate ? new Date(cattle.purchaseDate).toISOString().slice(0,10) : ''
      })
    setShowEditForm(true)
  }

  const handleDeleteCattle = (cattle) => {
    setDeletingCattle(cattle)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteCattle = async () => {
    if (!deletingCattle) return
    
    try {
      // Import deleteCattle function and call it
      await import('../../lib/actions').then(({ deleteCattle }) =>
        deleteCattle(deletingCattle.id)
      )
      // Reload cattle data
      const cattle = await getCattle()
      setCattleData(cattle)
      setShowDeleteConfirm(false)
      setDeletingCattle(null)
      toast.success('Cattle deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete cattle!')
      console.error('Delete error:', error)
    }
  }

  const cancelDeleteCattle = () => {
    setShowDeleteConfirm(false)
    setDeletingCattle(null)
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
                    <span className="font-semibold">{cattleData.filter(cattle => cattle.status !== 'sold').length} Active Cattle</span>
                  </div>
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <DollarSign className="w-5 h-5 mr-2 text-green-200" />
                    <span className="font-semibold">₨{cattleData.filter(cattle => cattle.status !== 'sold').reduce((sum, c) => sum + (c.purchasePrice || 0), 0).toLocaleString()}</span>
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
                    placeholder="Search by name, ID, breed type, price, or age..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-12 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base placeholder-gray-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowSoldCattle(!showSoldCattle)}
                      className={`px-6 py-3 border rounded-2xl flex items-center justify-center transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md ${
                        showSoldCattle 
                          ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      {showSoldCattle ? 'Hide Sold' : 'Show Sold'}
                    </button>
                    
                    {/* Search Results Counter */}
                    {(searchTerm || filteredCattle.length !== cattleData.length) && (
                      <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
                        {filteredCattle.length} of {cattleData.length} cattle
                        {searchTerm && (
                          <span className="ml-1">
                            matching &ldquo;<span className="font-medium">{searchTerm}</span>&rdquo;
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
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

            {/* Cattle Display - Grid or List View */}
            {viewMode === 'grid' ? (
              /* Mobile-Responsive Cattle Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredCattle.map((cattle, index) => (
                  <div 
                    key={cattle.id} 
                    className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer overflow-hidden"
                    style={{
                      animationName: 'fadeInUp',
                      animationDuration: '0.8s',
                      animationTimingFunction: 'ease-out',
                      animationFillMode: 'forwards',
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-2xl sm:rounded-3xl"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-6 sm:translate-x-8 -translate-y-6 sm:-translate-y-8"></div>
                    
                    <div className="relative z-10">
                      {/* Cattle Header */}
                      <div className="flex items-start justify-between mb-4 sm:mb-6">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0">
                            <Circle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 mb-1 truncate">
                              {cattle.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">ID: {cattle.id}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button 
                            onClick={() => handleEditCattle(cattle)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110"
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCattle(cattle)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Cattle Details Grid */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">Breed</p>
                          <p className="text-sm font-bold text-gray-800 truncate">{cattle.type}</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">Age</p>
                          <p className="text-sm font-bold text-gray-800">{cattle.age} years</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">Value</p>
                          <p className="text-sm font-bold text-gray-800 truncate">₨{cattle.purchasePrice?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">Added</p>
                          <p className="text-sm font-bold text-gray-800 truncate">{formatDate(cattle.purchaseDate)}</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            cattle.status === 'sold' 
                              ? 'bg-red-500' 
                              : cattle.status === 'active' 
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          }`}></div>
                          <span className={`text-xs font-semibold truncate ${
                            cattle.status === 'sold' 
                              ? 'text-red-600' 
                              : cattle.status === 'active' 
                              ? 'text-green-600'
                              : 'text-gray-600'
                          }`}>
                            {cattle.status === 'sold' ? 'Sold' : cattle.status === 'active' ? 'Active' : cattle.status || 'Unknown'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Beautiful Mobile Responsive Cattle List View */
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                      <tr>
                        <th className="text-left p-6 font-semibold text-gray-700">Cattle</th>
                        <th className="text-left p-6 font-semibold text-gray-700">Type/Breed</th>
                        <th className="text-left p-6 font-semibold text-gray-700">Age</th>
                        <th className="text-left p-6 font-semibold text-gray-700">Value</th>
                        <th className="text-left p-6 font-semibold text-gray-700">Date Added</th>
                        <th className="text-left p-6 font-semibold text-gray-700">Status</th>
                        <th className="text-left p-6 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCattle.map((cattle, index) => (
                        <tr 
                          key={cattle.id}
                          className="border-b border-gray-100 hover:bg-green-50/50 transition-all duration-300 group"
                          style={{
                            animationName: 'fadeInUp',
                            animationDuration: '0.6s',
                            animationTimingFunction: 'ease-out',
                            animationFillMode: 'forwards',
                            animationDelay: `${index * 50}ms`
                          }}
                        >
                          <td className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                                <Circle className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                  {cattle.name}
                                </h3>
                                <p className="text-sm text-gray-500">ID: {cattle.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="font-medium text-gray-800">{cattle.type}</span>
                          </td>
                          <td className="p-6">
                            <span className="font-medium text-gray-800">{cattle.age} years</span>
                          </td>
                          <td className="p-6">
                            <span className="font-bold text-green-600">₨{cattle.purchasePrice?.toLocaleString() || 'N/A'}</span>
                          </td>
                          <td className="p-6">
                            <span className="text-gray-600">{formatDate(cattle.purchaseDate)}</span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                cattle.status === 'sold' 
                                  ? 'bg-red-500' 
                                  : cattle.status === 'active' 
                                  ? 'bg-green-500'
                                  : 'bg-gray-500'
                              }`}></div>
                              <span className={`text-sm font-medium ${
                                cattle.status === 'sold' 
                                  ? 'text-red-600' 
                                  : cattle.status === 'active' 
                                  ? 'text-green-600'
                                  : 'text-gray-600'
                              }`}>
                                {cattle.status === 'sold' ? 'Sold' : cattle.status === 'active' ? 'Active' : cattle.status || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditCattle(cattle)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCattle(cattle)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {filteredCattle.map((cattle, index) => (
                    <div 
                      key={cattle.id}
                      className="p-4 hover:bg-green-50/50 transition-all duration-300 bg-white/50 border-l-4 border-l-green-200 mx-2 my-2 rounded-r-xl shadow-sm"
                      style={{
                        animationName: 'fadeInUp',
                        animationDuration: '0.6s',
                        animationTimingFunction: 'ease-out',
                        animationFillMode: 'forwards',
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <Circle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {cattle.name}
                            </h3>
                            <p className="text-sm text-gray-500">ID: {cattle.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            cattle.status === 'sold' 
                              ? 'bg-red-500' 
                              : cattle.status === 'active' 
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            cattle.status === 'sold' 
                              ? 'text-red-600' 
                              : cattle.status === 'active' 
                              ? 'text-green-600'
                              : 'text-gray-600'
                          }`}>
                            {cattle.status === 'sold' ? 'Sold' : cattle.status === 'active' ? 'Active' : cattle.status || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Type/Breed</p>
                          <p className="font-medium text-gray-800">{cattle.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Age</p>
                          <p className="font-medium text-gray-800">{cattle.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Value</p>
                          <p className="font-bold text-green-600">₨{cattle.purchasePrice?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Date Added</p>
                          <p className="text-gray-600 text-sm">{formatDate(cattle.purchaseDate)}</p>
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="flex justify-end space-x-2 pt-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditCattle(cattle)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCattle(cattle)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Empty State */}
            {filteredCattle.length === 0 && !loading && (
              <div className="text-center py-16 px-4">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  {searchTerm ? (
                    <Search className="w-16 h-16 text-green-600" />
                  ) : (
                    <Circle className="w-16 h-16 text-green-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {searchTerm ? 'No cattle found' : 'No cattle available'}
                </h3>
                <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? (
                    <>
                      No cattle found matching &ldquo;<span className="font-semibold text-gray-800">{searchTerm}</span>&rdquo;.
                      <br />
                      Try adjusting your search criteria or{' '}
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="text-green-600 hover:text-green-700 font-medium underline"
                      >
                        clear the search
                      </button>.
                    </>
                  ) : (
                    'Start building your livestock inventory by adding your first cattle.'
                  )}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Add Your First Cattle
                  </button>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16 px-4">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Circle className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading cattle...</h3>
                <p className="text-base text-gray-600">Please wait while we fetch your livestock data.</p>
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
      {/* Mobile-Responsive Add Cattle Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4">
          <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-lg sm:max-w-2xl mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-3xl">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl mr-3 sm:mr-4">
                  <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Cattle</h3>
              </div>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-all duration-200"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleAddCattle} className="space-y-4 sm:space-y-6">
              {/* Cattle Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Cattle Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter cattle name"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Cattle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Cattle Type/Breed
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Enter cattle type (e.g., Jersey, Holstein, Guernsey)"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Purchase Price (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter purchase price in PKR"
                  min="0"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age in years"
                  min="0"
                  max="20"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Date Added */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Date Added
                </label>
                <input
                  type="date"
                  name="dateAdded"
                  value={formData.dateAdded}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold text-base sm:text-lg order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 order-1 sm:order-2"
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

      {/* Mobile-Responsive Edit Cattle Modal */}
      {showEditForm && editingCattle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4">
          <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-lg sm:max-w-2xl mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-3xl">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl mr-3 sm:mr-4">
                  <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Cattle</h3>
              </div>
              <button 
                onClick={handleCloseEditForm}
                className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-all duration-200"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
              {/* Cattle Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Cattle Name/ID
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter cattle name or ID number"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Cattle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Cattle Type/Breed
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Enter cattle type or breed (e.g., Jersey, Holstein)"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Enter the type or breed of the cattle</p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Purchase Price (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-base sm:text-lg">₨</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full pl-8 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                    required
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Enter the purchase price in Pakistani Rupees (PKR)</p>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age in years"
                  min="0"
                  max="20"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
              </div>

              {/* Date Added */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Date Added
                </label>
                <input
                  type="date"
                  name="dateAdded"
                  value={formData.dateAdded}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-base sm:text-lg transition-all duration-200"
                  required
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Select the date when the cattle was added to your farm</p>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold text-base sm:text-lg order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 order-1 sm:order-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile-Responsive Delete Confirmation Modal */}
      {showDeleteConfirm && deletingCattle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-2 sm:p-4">
          <div className="bg-white/95 backdrop-blur-lg border border-red-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md mx-auto shadow-3xl">
            <div className="text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-red-100 rounded-full">
                  <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Delete Cattle
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{deletingCattle.name}"</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={cancelDeleteCattle}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold text-base sm:text-lg order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCattle}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl sm:rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 order-1 sm:order-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 