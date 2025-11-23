'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Form, Badge, Row, Col } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    fetchAttendance()
  }, [filters])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const res = await fetch(`/api/student/attendance?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setAttendance(data.attendance)
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const presentCount = attendance.filter(a => a.status === 'PRESENT').length
  const absentCount = attendance.filter(a => a.status === 'ABSENT').length
  const totalCount = attendance.length
  const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(2) : 0

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="STUDENT" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">My Attendance</h2>

            <Row className="g-4 mb-4">
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <h6 className="text-white-50 mb-2">Total Records</h6>
                    <h2 className="text-white mb-0">{totalCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card success">
                  <Card.Body>
                    <h6 className="text-white-50 mb-2">Present</h6>
                    <h2 className="text-white mb-0">{presentCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card warning">
                  <Card.Body>
                    <h6 className="text-white-50 mb-2">Absent</h6>
                    <h2 className="text-white mb-0">{absentCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card info">
                  <Card.Body>
                    <h6 className="text-white-50 mb-2">Percentage</h6>
                    <h2 className="text-white mb-0">{percentage}%</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="mb-4">
              <Card.Body>
                <Form>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>&nbsp;</Form.Label>
                        <div>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setFilters({ startDate: '', endDate: '' })}
                          >
                            Clear Filters
                          </button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-5">Loading...</div>
                ) : attendance.length === 0 ? (
                  <p className="text-muted text-center p-5">No attendance records found</p>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Teacher</th>
                        <th>Status</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((att) => (
                        <tr key={att.id}>
                          <td>{new Date(att.date).toLocaleDateString()}</td>
                          <td>{att.teacher.user.fullName}</td>
                          <td>
                            <Badge bg={att.status === 'PRESENT' ? 'success' : 'danger'}>
                              {att.status}
                            </Badge>
                          </td>
                          <td>{att.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </>
  )
}

