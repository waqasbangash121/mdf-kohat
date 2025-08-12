'use client'

import { useState, useEffect } from 'react'
import { addStaff, editStaff, deleteStaff } from '../../lib/actions'
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
        const res = await fetch('/api/staff')
        const staff = await res.json()
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
      {/* Beautiful Main Content with Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 overflow-hidden">
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-8 sm:py-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                  Staff Management
                </h1>
                <p className="text-lg sm:text-xl text-purple-100 mb-4">
                  Manage farm employees, roles, and schedules efficiently
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <Users className="w-5 h-5 mr-2 text-purple-200" />
                    <span className="font-semibold">{staffData.length} Total Staff</span>
                  </div>
                  <div className="flex items-center text-white/90 bg-white/20 rounded-full px-4 py-2">
                    <UserCheck className="w-5 h-5 mr-2 text-purple-200" />
                    <span className="font-semibold">{staffData.filter(s => s.status === 'active').length} Active</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 flex items-center font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Add New Staff
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <main className="relative -mt-8 sm:-mt-12 px-4 sm:px-6 pb-20">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

            {/* Beautiful Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Total Staff Card */}
              <div 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: '0ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 mb-2">Total Staff</p>
                      <p className="text-3xl font-bold text-purple-700">{staffData.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="font-medium">Team members</span>
                  </div>
                </div>
              </div>

              {/* Active Staff Card */}
              <div 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: '100ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 mb-2">Active Staff</p>
                      <p className="text-3xl font-bold text-green-700">{staffData.filter(s => s.status === 'active').length}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <UserCheck className="w-4 h-4 mr-1" />
                    <span className="font-medium">Working today</span>
                  </div>
                </div>
              </div>

              {/* On Leave Card */}
              <div 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: '200ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 mb-2">On Leave</p>
                      <p className="text-3xl font-bold text-yellow-700">{staffData.filter(s => s.status === 'on-leave').length}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-medium">Temporary absence</span>
                  </div>
                </div>
              </div>

              {/* Relieved/Terminated Card */}
              <div 
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: '300ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 mb-2">Relieved/Terminated</p>
                      <p className="text-3xl font-bold text-red-700">{staffData.filter(s => s.status === 'relieved' || s.status === 'terminated').length}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <UserX className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-red-600">
                    <UserX className="w-4 h-4 mr-1" />
                    <span className="font-medium">Former employees</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Beautiful Search & Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base placeholder-gray-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-medium transition-all duration-300"
                  >
                    <option value="all">All Roles</option>
                    {Array.from(new Set(staffData.map(s => s.position))).filter(Boolean).map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-medium transition-all duration-300"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="relieved">Relieved</option>
                    <option value="terminated">Terminated</option>
                  </select>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <Filter className="w-5 h-5 mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Beautiful Staff Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredStaff.map((staff, index) => (
                <div 
                  key={staff.id} 
                  className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100 opacity-0 group-hover:opacity-30 transition-all duration-500 rounded-3xl"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                  
                  <div className="relative z-10">
                    {/* Staff Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 mb-1 truncate">
                            {staff.name}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {staff.id}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor(staff.status)}`}>
                            {staff.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(staff)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Staff Details Grid */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl group-hover:from-purple-50 group-hover:to-indigo-50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">CNIC</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800 truncate max-w-32">{staff.cnic || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl group-hover:from-purple-50 group-hover:to-indigo-50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">Salary</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">₨{staff.salary || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl group-hover:from-purple-50 group-hover:to-indigo-50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">Contact</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800 truncate max-w-32">{staff.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Staff Footer */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Hired: {staff.dateOfHiring ? new Date(staff.dateOfHiring).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {staff.email && (
                          <button className="flex items-center text-xs text-gray-500 hover:text-purple-600 transition-colors truncate flex-1">
                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{staff.email}</span>
                          </button>
                        )}
                        {staff.phone && (
                          <button className="flex items-center text-xs text-gray-500 hover:text-green-600 transition-colors">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>Call</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Empty State */}
            {filteredStaff.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Users className="w-16 h-16 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No staff found</h3>
                <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters to find what you&apos;re looking for.'
                    : 'Start building your team by adding your first staff member.'
                  }
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-indigo-700 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Add Your First Staff Member
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

      {/* Enhanced Add New Staff Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Add New Staff</h3>
                  <p className="text-sm text-gray-500">Enter the details for your new staff member</p>
                </div>
              </div>
              <button
                onClick={handleCloseForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Staff Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* CNIC */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                />
                <p className="text-xs text-gray-500">Format: XXXXX-XXXXXXX-X</p>
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* Date of Hiring */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="relieved">Relieved</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold text-base transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-2xl hover:from-purple-700 hover:to-indigo-700 shadow-lg font-semibold text-base transition-all duration-300 transform hover:scale-105"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Edit Staff Modal */}
      {showEditForm && editingStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <Edit className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Edit Staff Member</h3>
                  <p className="text-sm text-gray-500">Update the details for {editingStaff.name}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Staff Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* CNIC */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base"
                />
                <p className="text-xs text-gray-500">Format: XXXXX-XXXXXXX-X</p>
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* Date of Hiring */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="relieved">Relieved</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base transform hover:scale-105"
                >
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}