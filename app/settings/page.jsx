'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import { Card } from '../../components/card'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    name: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { user, checkAuthStatus } = useAuth()

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        email: user.email || '',
        name: user.name || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        // Refresh user data in AuthContext
        await checkAuthStatus()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      setLoading(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while changing password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Settings</h1>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6 sm:mb-8">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 sm:flex-none py-3 sm:py-2 px-4 sm:px-1 border-b-2 font-medium text-sm sm:text-base text-center sm:text-left ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 sm:flex-none py-3 sm:py-2 px-4 sm:px-1 sm:ml-8 border-b-2 font-medium text-sm sm:text-base text-center sm:text-left ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-md text-sm sm:text-base ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength="3"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength="6"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Must be at least 6 characters long</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength="6"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        /* Ensure proper spacing on mobile */
        @media (max-width: 640px) {
          .space-y-4 > * + * {
            margin-top: 1rem;
          }
          
          .space-y-6 > * + * {
            margin-top: 1.5rem;
          }
          
          /* Better touch targets for mobile */
          input[type="text"],
          input[type="email"],
          input[type="password"] {
            min-height: 44px;
          }
          
          button {
            min-height: 44px;
          }
          
          /* Prevent zoom on input focus for iOS */
          input[type="text"],
          input[type="email"],
          input[type="password"] {
            font-size: 16px;
          }
        }
        
        /* Enhanced focus states for better accessibility */
        input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        button:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </DashboardLayout>
  )
}
