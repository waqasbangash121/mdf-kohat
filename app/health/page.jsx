'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Heart,
  Syringe,
  Stethoscope
} from 'lucide-react'

export default function HealthRecords() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const healthRecords = [
    {
      id: '1',
      cattleId: '1234',
      cattleName: 'Bessie',
      type: 'vaccination',
      description: 'Annual vaccination - Brucellosis',
      date: '2024-01-15',
      status: 'completed',
      nextDue: '2025-01-15',
      veterinarian: 'Dr. Smith',
      notes: 'All clear, no adverse reactions'
    },
    {
      id: '2',
      cattleId: '1235',
      cattleName: 'Daisy',
      type: 'checkup',
      description: 'Routine health check',
      date: '2024-01-14',
      status: 'completed',
      nextDue: '2024-04-14',
      veterinarian: 'Dr. Johnson',
      notes: 'Healthy, weight gain observed'
    },
    {
      id: '3',
      cattleId: '1236',
      cattleName: 'Molly',
      type: 'treatment',
      description: 'Mastitis treatment',
      date: '2024-01-13',
      status: 'in-progress',
      nextDue: '2024-01-20',
      veterinarian: 'Dr. Williams',
      notes: 'Antibiotics prescribed, monitoring required'
    }
  ]

  const upcomingAppointments = [
    {
      id: '4',
      cattleId: '1234',
      cattleName: 'Bessie',
      type: 'checkup',
      date: '2024-01-20',
      time: '09:00',
      veterinarian: 'Dr. Smith'
    },
    {
      id: '5',
      cattleId: '1235',
      cattleName: 'Daisy',
      type: 'vaccination',
      date: '2024-01-25',
      time: '14:00',
      veterinarian: 'Dr. Johnson'
    }
  ]

  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = record.cattleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.cattleId.includes(searchTerm) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="w-4 h-4" />
      case 'checkup':
        return <Stethoscope className="w-4 h-4" />
      case 'treatment':
        return <Heart className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Health Records</h1>
          <p className="text-gray-600">Manage cattle health, vaccinations, and medical treatments</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Health Record
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{healthRecords.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {healthRecords.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {healthRecords.filter(r => r.status === 'in-progress').length}
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
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
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
              placeholder="Search by cattle name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Health Records */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Records</h3>
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{record.cattleName} (ID: {record.cattleId})</h4>
                    <p className="text-sm text-gray-600">{record.description}</p>
                    <p className="text-xs text-gray-500">Veterinarian: {record.veterinarian}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{record.date}</p>
                </div>
              </div>
              {record.notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Notes:</strong> {record.notes}
                  </p>
                </div>
              )}
              {record.nextDue && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Next due: {record.nextDue}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
        <div className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getTypeIcon(appointment.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{appointment.cattleName} (ID: {appointment.cattleId})</p>
                  <p className="text-sm text-gray-600">{appointment.type} - {appointment.veterinarian}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">{appointment.date}</p>
                <p className="text-sm text-gray-600">{appointment.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Mastitis Treatment Required</p>
              <p className="text-sm text-yellow-700">Molly (ID: 1236) needs follow-up treatment</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Vaccination Due</p>
              <p className="text-sm text-blue-700">Bessie (ID: 1234) vaccination due in 5 days</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
} 