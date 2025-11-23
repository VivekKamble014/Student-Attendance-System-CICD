import type { Metadata } from 'next'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import ToastProvider from '@/components/ToastProvider'

export const metadata: Metadata = {
  title: 'Student Attendance Management System',
  description: 'A comprehensive attendance management system for educational institutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}

