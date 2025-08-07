import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '../components/ErrorBoundary'

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
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
