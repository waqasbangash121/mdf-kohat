'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  Circle,
  Milk,
  Activity,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState('week')

  const scheduleData = [
    {
      id: '1',
      title: 'Morning Milking',
      type: 'milking',
      date: '2024-01-15',
      time: '06:00',
      duration: '2 hours',
      staff: ['John Smith', 'Sarah Johnson'],
      cattle: ['Bessie', 'Daisy', 'Molly'],
      status: 'completed'
    },
    {
      id: '2',
      title: 'Health Check - Bessie',
      type: 'health',
      date: '2024-01-15',
      time: '10:00',
      duration: '1 hour',
      staff: ['Mike Wilson'],
      cattle: ['Bessie'],
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Afternoon Feeding',
      type: 'feeding',
      date: '2024-01-15',
      time: '14:00',
      duration: '1.5 hours',
      staff: ['Lisa Brown'],
      cattle: ['All'],
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Evening Milking',
      type: 'milking',
      date: '2024-01-15',
      time: '18:00',
      duration: '2 hours',
      staff: ['Sarah Johnson'],
      cattle: ['Bessie', 'Daisy', 'Molly'],
      status: 'upcoming'
    }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'milking':
        return <Milk className="w-4 h-4" />
      case 'health':
        return <Activity className="w-4 h-4" />
      case 'feeding':
        return <Circle className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'milking':
        return 'bg-blue-100 text-blue-800'
      case 'health':
        return 'bg-green-100 text-green-800'
      case 'feeding':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
          <p className="text-gray-600">Manage farm activities and staff schedules</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Calendar Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedView('day')}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedView === 'day' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
            <button 
              onClick={() => setSelectedView('week')}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedView === 'week' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setSelectedView('month')}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedView === 'month' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today&apos;s Schedule</h3>
        <div className="space-y-4">
          {scheduleData.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(event.type)}`}>
                    {getTypeIcon(event.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(event.time)} - {event.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {event.staff.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
              {event.cattle && event.cattle.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <Circle className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Cattle: {event.cattle.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Health Check - Daisy</p>
                <p className="text-sm text-gray-600">Tomorrow, 09:00 - Dr. Johnson</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Jan 16, 2024</p>
              <p className="text-xs text-gray-500">1 hour</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Milk className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Weekly Production Review</p>
                <p className="text-sm text-gray-600">Friday, 15:00 - Management Team</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Jan 19, 2024</p>
              <p className="text-xs text-gray-500">2 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center">
              <Plus className="w-4 h-4 mr-2 text-blue-600" />
              Schedule Milking
            </button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-green-600" />
              Book Health Check
            </button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center">
              <Users className="w-4 h-4 mr-2 text-purple-600" />
              Assign Staff
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold text-gray-800 mb-3">Today&apos;s Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Events:</span>
              <span className="font-medium">{scheduleData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-green-600">
                {scheduleData.filter(e => e.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Upcoming:</span>
              <span className="font-medium text-blue-600">
                {scheduleData.filter(e => e.status === 'upcoming').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold text-gray-800 mb-3">Notifications</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">Health check due for Bessie</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">Morning milking completed</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
} 