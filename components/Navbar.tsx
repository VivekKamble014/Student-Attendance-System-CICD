'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar as BootstrapNavbar, Nav, Dropdown } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        // If unauthorized, user will be redirected by middleware
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully', {
        position: 'top-right',
        autoClose: 2000,
      })
      setTimeout(() => {
        router.push('/login')
      }, 500)
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  // Don't return null - show navbar even if user is loading
  // This prevents the page from not rendering

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <div className="container-fluid">
        <BootstrapNavbar.Brand as={Link} href="/dashboard" className="text-primary fw-bold">
          <i className="bi bi-calendar-check me-2"></i>
          Attendance System
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <Dropdown>
                <Dropdown.Toggle variant="link" className="text-decoration-none text-dark">
                  <i className="bi bi-person-circle me-2"></i>
                  {user.fullName || user.email}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} href="/dashboard">
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link>
                <i className="bi bi-person-circle me-2"></i>
                Loading...
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </div>
    </BootstrapNavbar>
  )
}

