'use client'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Table, ProgressBar } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function StudentDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-5">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="STUDENT" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">Student Dashboard</h2>
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Card className="stats-card">
                  <Card.Body>
                    <h6 className="text-white-50 mb-3">Attendance Percentage</h6>
                    <h1 className="text-white mb-3">{stats?.attendancePercentage || 0}%</h1>
                    <ProgressBar
                      now={stats?.attendancePercentage || 0}
                      variant={stats?.attendancePercentage >= 75 ? 'success' : 'warning'}
                      style={{ height: '10px' }}
                    />
                    <div className="d-flex justify-content-between mt-3 text-white-50">
                      <small>Present: {stats?.presentRecords || 0}</small>
                      <small>Total: {stats?.totalRecords || 0}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Attendance (Last 5 days)</h5>
              </Card.Header>
              <Card.Body>
                {stats?.recentAttendance?.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Teacher</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentAttendance.map((att: any) => (
                        <tr key={att.id}>
                          <td>{new Date(att.date).toLocaleDateString()}</td>
                          <td>{att.teacher.user.fullName}</td>
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

