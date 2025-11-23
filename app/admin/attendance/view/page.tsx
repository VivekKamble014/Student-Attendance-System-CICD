'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Form, Badge, Button, Row, Col } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { toast } from 'react-toastify'

export default function AdminViewAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    date: '',
    studentId: '',
    class: '',
  })

  useEffect(() => {
    fetchAttendance()
  }, [filters])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.date) params.append('date', filters.date)
      if (filters.studentId) params.append('studentId', filters.studentId)
      if (filters.class) params.append('class', filters.class)

      const res = await fetch(`/api/attendance?${params.toString()}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setAttendance(data.attendance || [])
      } else {
        toast.error('Failed to fetch attendance records')
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
      toast.error('Failed to fetch attendance records')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return

    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Attendance record deleted successfully')
        fetchAttendance()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete attendance record')
      }
    } catch (error) {
      console.error('Failed to delete attendance:', error)
      toast.error('Failed to delete attendance record')
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="ADMIN" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">View Attendance</h2>

            <Card className="mb-4">
              <Card.Body>
                <Form>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Filter by Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.date}
                          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Filter by Class</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter class name"
                          value={filters.class}
                          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>&nbsp;</Form.Label>
                        <div>
                          <Button
                            variant="outline-secondary"
                            onClick={() => setFilters({ date: '', studentId: '', class: '' })}
                          >
                            <i className="bi bi-x-circle me-2"></i>
                            Clear Filters
                          </Button>
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
                  <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading attendance records...</p>
                  </div>
                ) : attendance.length === 0 ? (
                  <p className="text-muted text-center p-5">No attendance records found</p>
                ) : (
                  <div className="table-responsive">
                    <Table responsive hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Student</th>
                          <th>Roll No</th>
                          <th>Class</th>
                          <th>Status</th>
                          <th>Marked By</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((att) => (
                          <tr key={att.id}>
                            <td>{new Date(att.date).toLocaleDateString()}</td>
                            <td>{att.student.user.fullName}</td>
                            <td>{att.student.rollNo}</td>
                            <td>{att.student.class}</td>
                            <td>
                              <Badge bg={att.status === 'PRESENT' ? 'success' : 'danger'}>
                                {att.status}
                              </Badge>
                            </td>
                            <td>{att.teacher?.user?.fullName || 'System'}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDelete(att.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </>
  )
}

