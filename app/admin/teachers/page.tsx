'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Form, Modal, Badge, InputGroup, Row, Col, Spinner } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { toast } from 'react-toastify'

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    department: '',
    mobile: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTeachers()
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (searchTerm !== '') {
      const timer = setTimeout(() => fetchTeachers(), 500)
      return () => clearTimeout(timer)
    } else {
      fetchTeachers()
    }
  }, [searchTerm])

  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    try {
      const res = await fetch('/api/departments', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setDepartments(data.departments || [])
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    } finally {
      setLoadingDepartments(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`/api/teachers?search=${searchTerm}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setTeachers(data.teachers || [])
      } else {
        toast.error('Failed to fetch teachers')
      }
    } catch (error) {
      console.error('Failed to fetch teachers:', error)
      toast.error('Failed to fetch teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const url = editingTeacher
        ? `/api/teachers/${editingTeacher.id}`
        : '/api/teachers'
      const method = editingTeacher ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(editingTeacher ? 'Teacher updated successfully!' : 'Teacher created successfully!')
        setShowModal(false)
        setEditingTeacher(null)
        resetForm()
        fetchTeachers()
      } else {
        toast.error(data.error || 'Failed to save teacher')
      }
    } catch (error) {
      console.error('Failed to save teacher:', error)
      toast.error('An error occurred while saving teacher')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (teacher: any) => {
    setEditingTeacher(teacher)
    setFormData({
      email: teacher.user.email,
      password: '',
      fullName: teacher.user.fullName,
      department: teacher.department,
      mobile: teacher.user.mobile || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) return

    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Teacher deleted successfully!')
        fetchTeachers()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete teacher')
      }
    } catch (error) {
      console.error('Failed to delete teacher:', error)
      toast.error('Failed to delete teacher')
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      department: '',
      mobile: '',
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
              <h2>Teachers</h2>
              <Button onClick={() => { setShowModal(true); setEditingTeacher(null); resetForm() }}>
                <i className="bi bi-plus-circle me-2"></i>Add Teacher
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
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">Loading teachers...</p>
                  </div>
                ) : teachers.length === 0 ? (
                  <p className="text-muted text-center p-5">No teachers found</p>
                ) : (
                  <div className="table-responsive">
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Mobile</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map((teacher) => (
                          <tr key={teacher.id}>
                            <td>{teacher.user.fullName}</td>
                            <td>{teacher.user.email}</td>
                            <td>{teacher.department}</td>
                            <td>{teacher.user.mobile || '-'}</td>
                            <td>
                              <Badge bg={teacher.user.status === 'APPROVED' ? 'success' : 'warning'}>
                                {teacher.user.status}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="me-2"
                                onClick={() => handleEdit(teacher)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDelete(teacher.id)}
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

            <Modal show={showModal} onHide={() => { setShowModal(false); setEditingTeacher(null); resetForm() }} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          placeholder="Enter full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          disabled={!!editingTeacher}
                          placeholder="Enter email address"
                        />
                        {editingTeacher && (
                          <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Password {editingTeacher ? '(Leave blank to keep current)' : <span className="text-danger">*</span>}
                        </Form.Label>
                        <Form.Control
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required={!editingTeacher}
                          minLength={6}
                          placeholder={editingTeacher ? "Enter new password (optional)" : "Enter password (min 6 characters)"}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                        {loadingDepartments ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Form.Select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            required
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.name}>
                                {dept.name} ({dept.code})
                              </option>
                            ))}
                          </Form.Select>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          placeholder="Enter mobile number (optional)"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => { setShowModal(false); resetForm() }}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {editingTeacher ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingTeacher ? 'Update Teacher' : 'Create Teacher'
                    )}
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

