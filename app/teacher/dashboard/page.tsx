'use client'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function TeacherDashboard() {
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
          myAttendance: 0,
          todayAttendance: 0,
          weekAttendance: 0,
          recentAttendance: []
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Set empty stats so dashboard still renders
      setStats({
        myAttendance: 0,
        recentAttendance: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex">
          <Sidebar role="TEACHER" />
          <div className="flex-grow-1 p-4">
            <Container fluid>
              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <div className="text-center">
                  <Spinner animation="border" variant="primary" className="mb-3" />
                  <p className="text-muted">Loading dashboard stats...</p>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="TEACHER" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">Teacher Dashboard</h2>
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="stats-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-white-50 mb-2">Total Attendance Records</h6>
                        <h2 className="text-white mb-0">{stats?.myAttendance || 0}</h2>
                      </div>
                      <i className="bi bi-calendar-check" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stats-card success">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-white-50 mb-2">Today's Records</h6>
                        <h2 className="text-white mb-0">{stats?.todayAttendance || 0}</h2>
                      </div>
                      <i className="bi bi-calendar-day" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stats-card info">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-white-50 mb-2">This Week</h6>
                        <h2 className="text-white mb-0">{stats?.weekAttendance || 0}</h2>
                      </div>
                      <i className="bi bi-calendar-week" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Attendance Activity</h5>
              </Card.Header>
              <Card.Body>
                {stats?.recentAttendance?.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentAttendance.map((att: any) => (
                        <tr key={att.id}>
                          <td>{new Date(att.date).toLocaleDateString()}</td>
                          <td>{att.student.user.fullName}</td>
                          <td>
                            <span className={`badge bg-${att.status === 'PRESENT' ? 'success' : 'danger'}`}>
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No recent attendance records</p>
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </>
  )
}

