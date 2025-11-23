'use client'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats', {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      } else if (res.status === 401 || res.status === 403) {
        window.location.href = '/login'
        return
      } else {
        // Set empty stats so dashboard still renders
        setStats({
          totalStudents: 0,
          totalTeachers: 0,
          pendingUsers: 0,
          totalAttendance: 0
        })
      }
    } catch (error) {
      // Set empty stats so dashboard still renders
      setStats({
        totalStudents: 0,
        totalTeachers: 0,
        pendingUsers: 0,
        totalAttendance: 0
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="ADMIN" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">Admin Dashboard</h2>
            {loading ? (
              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <div className="text-center">
                  <Spinner animation="border" variant="primary" className="mb-3" />
                  <p className="text-muted">Loading dashboard stats...</p>
                </div>
              </div>
            ) : (
              <Row className="g-4">
                <Col md={3}>
                  <Card className="stats-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Total Students</h6>
                          <h2 className="text-white mb-0">{stats?.totalStudents || 0}</h2>
                        </div>
                        <i className="bi bi-people" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="stats-card success">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Total Teachers</h6>
                          <h2 className="text-white mb-0">{stats?.totalTeachers || 0}</h2>
                        </div>
                        <i className="bi bi-person-badge" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="stats-card warning">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Pending Users</h6>
                          <h2 className="text-white mb-0">{stats?.pendingUsers || 0}</h2>
                        </div>
                        <i className="bi bi-clock-history" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="stats-card info">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Total Attendance</h6>
                          <h2 className="text-white mb-0">{stats?.totalAttendance || 0}</h2>
                        </div>
                        <i className="bi bi-calendar-check" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Container>
        </div>
      </div>
    </>
  )
}

