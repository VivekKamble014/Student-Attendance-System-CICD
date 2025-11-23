'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Form, Badge, Button } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function ViewAttendancePage() {
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

      const res = await fetch(`/api/attendance?${params.toString()}`)
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return

    try {
      const res = await fetch(`/api/attendance/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAttendance()
      }
    } catch (error) {
      console.error('Failed to delete attendance:', error)
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="TEACHER" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">View Attendance</h2>

            <Card className="mb-4">
              <Card.Body>
                <Form>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Label>Filter by Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={filters.date}
                          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Label>Filter by Class</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter class"
                          value={filters.class}
                          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Label>&nbsp;</Form.Label>
                        <div>
                          <Button
                            variant="outline-secondary"
                            onClick={() => setFilters({ date: '', studentId: '', class: '' })}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
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
                          <td>{att.teacher.user.fullName}</td>
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
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </>
  )
}

