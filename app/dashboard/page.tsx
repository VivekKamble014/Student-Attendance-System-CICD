'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Spinner } from 'react-bootstrap'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        const data = await res.json()
        
        // Redirect based on role
        if (data.user?.role === 'ADMIN') {
          router.replace('/admin/dashboard')
        } else if (data.user?.role === 'TEACHER') {
          router.replace('/teacher/dashboard')
        } else if (data.user?.role === 'STUDENT') {
          router.replace('/student/dashboard')
        } else {
          router.replace('/login')
        }
      } else {
        router.replace('/login')
      }
    } catch (error) {
      router.replace('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Loading dashboard...</p>
      </div>
    </div>
  )
}

