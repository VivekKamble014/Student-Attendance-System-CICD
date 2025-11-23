'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Form, Modal, Badge, InputGroup } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    rollNo: '',
    class: '',
    department: '',
    mobile: '',
    status: 'Active',
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/students?search=${searchTerm}`)
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm !== '') {
      const timer = setTimeout(() => fetchStudents(), 500)
      return () => clearTimeout(timer)
    } else {
      fetchStudents()
    }
  }, [searchTerm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingStudent
        ? `/api/students/${editingStudent.id}`
        : '/api/students'
      const method = editingStudent ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setEditingStudent(null)
        resetForm()
        fetchStudents()
      }
    } catch (error) {
      console.error('Failed to save student:', error)
    }
  }

  const handleEdit = (student: any) => {
    setEditingStudent(student)
    setFormData({
      email: student.user.email,
      password: '',
      fullName: student.user.fullName,
      rollNo: student.rollNo,
      class: student.class,
      department: student.department,
      mobile: student.user.mobile || '',
      status: student.status,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error('Failed to delete student:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      rollNo: '',
      class: '',
      department: '',
      mobile: '',
      status: 'Active',
    })
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="ADMIN" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Students</h2>
              <Button onClick={() => { setShowModal(true); setEditingStudent(null); resetForm() }}>
                <i className="bi bi-plus-circle me-2"></i>Add Student
              </Button>
            </div>

            <Card className="mb-3">
              <Card.Body>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-5">Loading...</div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.rollNo}</td>
                          <td>{student.user.fullName}</td>
                          <td>{student.user.email}</td>
                          <td>{student.class}</td>
                          <td>{student.department}</td>
                          <td>
                            <Badge bg={student.status === 'Active' ? 'success' : 'secondary'}>
                              {student.status}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2"
                              onClick={() => handleEdit(student)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(student.id)}
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

            <Modal show={showModal} onHide={() => { setShowModal(false); setEditingStudent(null); resetForm() }}>
              <Modal.Header closeButton>
                <Modal.Title>{editingStudent ? 'Edit Student' : 'Add Student'}</Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={!!editingStudent}
                    />
                  </Form.Group>
                  {!editingStudent && (
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </Form.Group>
                  )}
                  <Form.Group className="mb-3">
                    <Form.Label>Roll Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Class</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => { setShowModal(false); resetForm() }}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingStudent ? 'Update' : 'Create'}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </Container>
        </div>
      </div>
    </>
  )
}

