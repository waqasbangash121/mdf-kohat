'use client'

import { useState } from 'react'
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
  Mail
} from 'lucide-react'

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const staffData = [
    {
      id: '1',
      name: 'John Smith',
      role: 'Farm Manager',
      email: 'john.smith@farm.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      hireDate: '2020-03-15',
      salary: '$45,000',
      hours: '40/week',
      department: 'Management'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Milker',
      email: 'sarah.johnson@farm.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      hireDate: '2021-06-20',
      salary: '$32,000',
      hours: '35/week',
      department: 'Operations'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      role: 'Veterinary Assistant',
      email: 'mike.wilson@farm.com',
      phone: '+1 (555) 345-6789',
      status: 'active',
      hireDate: '2022-01-10',
      salary: '$38,000',
      hours: '40/week',
      department: 'Health'
    },
    {
      id: '4',
      name: 'Lisa Brown',
      role: 'Feeder',
      email: 'lisa.brown@farm.com',
      phone: '+1 (555) 456-7890',
      status: 'on-leave',
      hireDate: '2021-09-05',
      salary: '$28,000',
      hours: '30/week',
      department: 'Operations'
    }
  ]

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || staff.role === filterRole
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800'
      case 'terminated':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Farm Manager':
        return 'bg-blue-100 text-blue-800'
      case 'Milker':
        return 'bg-green-100 text-green-800'
      case 'Veterinary Assistant':
        return 'bg-purple-100 text-purple-800'
      case 'Feeder':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600">Manage farm employees, roles, and schedules</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Staff
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staffData.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-green-600">
                {staffData.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">
                {staffData.filter(s => s.status === 'on-leave').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(staffData.map(s => s.department)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="Farm Manager">Farm Manager</option>
              <option value="Milker">Milker</option>
              <option value="Veterinary Assistant">Veterinary Assistant</option>
              <option value="Feeder">Feeder</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{staff.name}</h3>
                <p className="text-sm text-gray-600">ID: {staff.id}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staff.role)}`}>
                  {staff.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">{staff.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salary:</span>
                <span className="font-medium">{staff.salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours:</span>
                <span className="font-medium">{staff.hours}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                  {staff.status}
                </span>
                <span className="text-xs text-gray-500">Hired: {staff.hireDate}</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center text-xs text-gray-500 hover:text-blue-600">
                  <Mail className="w-3 h-3 mr-1" />
                  {staff.email}
                </button>
                <button className="flex items-center text-xs text-gray-500 hover:text-green-600">
                  <Phone className="w-3 h-3 mr-1" />
                  {staff.phone}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today&apos;s Schedule</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">JS</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">John Smith</p>
                <p className="text-sm text-gray-600">Farm Manager - Morning shift</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">06:00 - 14:00</p>
              <p className="text-sm text-gray-600">8 hours</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">SJ</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Milker - Afternoon shift</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">14:00 - 22:00</p>
              <p className="text-sm text-gray-600">8 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* No Staff Found */}
      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first staff member'
            }
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New Staff
          </button>
        </div>
      )}
      </div>
    </DashboardLayout>
  )
} 