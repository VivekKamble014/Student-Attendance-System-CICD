'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Form, Button, Table, Row, Col } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { toast } from 'react-toastify'

export default function AdminMarkAttendancePage() {
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    }
  }

  const fetchStudents = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/students?class=${encodeURIComponent(selectedClass)}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
        // Initialize attendance state - default to PRESENT
        const initial: Record<number, string> = {}
        data.students.forEach((s: any) => {
          initial[s.id] = 'PRESENT'
        })
        setAttendance(initial)
      } else {
        toast.error('Failed to fetch students')
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
      toast.error('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const attendanceList = Object.entries(attendance).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status,
      }))

      const res = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          date: selectedDate,
          attendanceList,
        }),
      })

      if (res.ok) {
        toast.success('Attendance marked successfully!')
        setAttendance({})
        setStudents([])
        setSelectedClass('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to mark attendance')
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error)
      toast.error('An error occurred while marking attendance')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="ADMIN" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">Mark Attendance</h2>

            <Card className="mb-4">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Select Class</Form.Label>
                        <Form.Select
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                          required
                        >
                          <option value="">Select a class</option>
                          {classes.map((cls) => (
                            <option key={cls.id} value={cls.name}>
                              {cls.name} - {cls.department}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>&nbsp;</Form.Label>
                        <div>
                          <Button
                            type="button"
                            variant="outline-primary"
                            onClick={fetchStudents}
                            disabled={!selectedClass || loading}
                          >
                            {loading ? 'Loading...' : 'Load Students'}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {students.length > 0 && (
                    <>
                      <hr />
                      <div className="mb-3">
                        <h5>Mark Attendance for {students.length} students</h5>
                      </div>
                      <Table responsive className="attendance-table">
                        <thead>
                          <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td>{student.rollNo}</td>
                              <td>{student.user.fullName}</td>
                              <td>{student.class}</td>
                              <td>
                                <Form.Select
                                  value={attendance[student.id] || 'PRESENT'}
                                  onChange={(e) =>
                                    setAttendance({ ...attendance, [student.id]: e.target.value })
                                  }
                                  size="sm"
                                >
                                  <option value="PRESENT">Present</option>
                                  <option value="ABSENT">Absent</option>
                                </Form.Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Save Attendance
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </>
  )
}

