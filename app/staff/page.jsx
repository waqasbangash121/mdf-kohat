'use client'

import { useState, useEffect } from 'react'
import { getStaff, addStaff, editStaff, deleteStaff } from '../../lib/actions'
import { toast } from 'react-toastify'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Phone,
  Mail,
  User,
  Hash,
  CreditCard,
  X,
  DollarSign
} from 'lucide-react'

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    phone: '',
    salary: '',
    dateOfHiring: '',
    status: 'active'
  })
  const [staffData, setStaffData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStaff() {
      setLoading(true)
      try {
        const staff = await getStaff()
        setStaffData(staff)
      } catch (error) {
        console.error('Error loading staff:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStaff()
  }, [])

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800'
      case 'terminated':
        return 'bg-red-100 text-red-800'
      case 'relieved':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (position) => {
    // Generate a consistent color based on position
    if (!position) return 'bg-gray-100 text-gray-800';
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800', 
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ]
    const index = position.length % colors.length
    return colors[index]
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addStaff({
        name: formData.name,
        cnic: formData.cnic,
        phone: formData.phone,
        salary: formData.salary,
        dateOfHiring: formData.dateOfHiring,
        status: formData.status
      })
      // Reload staff data
      const staff = await getStaff()
      setStaffData(staff)
      setFormData({
        name: '',
        cnic: '',
        phone: '',
        salary: '',
        dateOfHiring: '',
        status: 'active'
      })
      setShowAddForm(false)
      toast.success('Staff member added successfully!')
    } catch (error) {
      toast.error('Failed to add staff member!')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await editStaff(editingStaff.id, {
        name: formData.name,
        cnic: formData.cnic,
        phone: formData.phone,
        salary: formData.salary,
        dateOfHiring: formData.dateOfHiring,
        status: formData.status
      })
      // Reload staff data
      const staff = await getStaff()
      setStaffData(staff)
      setFormData({
        name: '',
        cnic: '',
        phone: '',
        salary: '',
        dateOfHiring: '',
        status: 'active'
      })
      setShowEditForm(false)
      setEditingStaff(null)
      toast.success('Staff member updated successfully!')
    } catch (error) {
      toast.error('Failed to update staff member!')
    }
  }

  const handleEdit = (staff) => {
    setEditingStaff(staff)
    setFormData({
      name: staff.name || '',
      cnic: staff.cnic || '',
      phone: staff.phone || '',
      contact: staff.phone || '',
      salary: staff.salary !== undefined && staff.salary !== null ? staff.salary.toString() : '',
      dateOfHiring: staff.dateOfHiring ? new Date(staff.dateOfHiring).toISOString().split('T')[0] : '',
      status: staff.status || 'active'
    })
    setShowEditForm(true)
  }

  const handleDelete = async (staffId) => {
    // Confirm deletion with a toast instead of window.confirm
    try {
      await deleteStaff(staffId)
      const staff = await getStaff()
      setStaffData(staff)
      toast.success('Staff member deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete staff member!')
    }
  }

  const handleCloseForm = () => {
    setFormData({
      name: '',
      age: '',
      cnic: '',
      position: '',
      salary: '',
      contactNumber: '',
      dateOfHiring: '',
      status: 'active'
    })
    setShowAddForm(false)
  }

  const handleCloseEditForm = () => {
    setFormData({
      name: '',
      age: '',
      cnic: '',
      position: '',
      salary: '',
      contactNumber: '',
      dateOfHiring: '',
      status: 'active'
    })
    setShowEditForm(false)
    setEditingStaff(null)
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-sm text-gray-600">Manage farm employees, roles, and schedules</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Staff
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{staffData.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-50 rounded-full">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {staffData.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-50 rounded-full">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {staffData.filter(s => s.status === 'on-leave').length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-50 rounded-full">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Relieved/Terminated</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {staffData.filter(s => s.status === 'relieved' || s.status === 'terminated').length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-red-50 rounded-full">
              <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Roles</option>
              {Array.from(new Set(staffData.map(s => s.position))).filter(Boolean).map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="relieved">Relieved</option>
              <option value="terminated">Terminated</option>
            </select>
            <button className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm">
              <Filter className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{staff.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">ID: {staff.id}</p>
              </div>
              <div className="flex space-x-1 sm:space-x-2 ml-2">
                <button className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={() => handleEdit(staff)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(staff.id)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">CNIC:</span>
                <span className="font-medium text-xs sm:text-sm truncate max-w-24 sm:max-w-none">{staff.cnic || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Salary:</span>
                <span className="font-medium text-xs sm:text-sm truncate max-w-20 sm:max-w-none">{staff.salary || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Contact:</span>
                <span className="font-medium text-xs sm:text-sm truncate max-w-24 sm:max-w-none">{staff.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                  {staff.status}
                </span>
                <span className="text-xs text-gray-500">Hired: {staff.dateOfHiring ? new Date(staff.dateOfHiring).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center text-xs text-gray-500 hover:text-blue-600 truncate">
                  <Mail className="w-3 h-3 mr-1" />
                  <span className="truncate">{staff.email}</span>
                </button>
                <button className="flex items-center text-xs text-gray-500 hover:text-green-600 truncate">
                  <Phone className="w-3 h-3 mr-1" />
                  <span className="truncate">{staff.phone}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Staff Found */}
      {filteredStaff.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
            {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first staff member'
            }
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Staff
          </button>
        </div>
      )}

      {/* Add New Staff Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Add New Staff</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Enter the details for your new staff member</p>
                </div>
              </div>
              <button
                onClick={handleCloseForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Staff Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Full Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>


              {/* CNIC */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>CNIC</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  placeholder="Enter CNIC (e.g., 12345-1234567-1)"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <p className="text-xs text-gray-500">Format: XXXXX-XXXXXXX-X</p>
              </div>


              {/* Salary */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>Salary (PKR)</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter salary amount"
                  min="0"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Phone</span>
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Date of Hiring */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Date of Hiring</span>
                  </div>
                </label>
                <input
                  type="date"
                  name="dateOfHiring"
                  value={formData.dateOfHiring}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span>Status</span>
                  </div>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="relieved">Relieved</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditForm && editingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Edit Staff Member</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Update the details for {editingStaff.name}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Staff Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Full Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>


              {/* CNIC */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>CNIC</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  placeholder="Enter CNIC (e.g., 12345-1234567-1)"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <p className="text-xs text-gray-500">Format: XXXXX-XXXXXXX-X</p>
              </div>


              {/* Salary */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>Salary (PKR)</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter salary amount"
                  min="0"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Contact Number</span>
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Date of Hiring */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Date of Hiring</span>
                  </div>
                </label>
                <input
                  type="date"
                  name="dateOfHiring"
                  value={formData.dateOfHiring}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span>Status</span>
                  </div>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="relieved">Relieved</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                >
                  Update Staff
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