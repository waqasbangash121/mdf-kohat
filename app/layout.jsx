import { Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from '../components/ErrorBoundary.js';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dairy Farm Management System',
  description: 'Comprehensive dairy farm management application for tracking cattle, milk production, health, and farm operations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            {children}
             <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
