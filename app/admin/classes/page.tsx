'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Form, Modal, Spinner } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { toast } from 'react-toastify'

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', department: '' })

  useEffect(() => {
    fetchClasses()
    fetchDepartments()
  }, [])

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

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setClasses(data.classes || [])
      } else {
        toast.error('Failed to fetch classes')
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast.error('Failed to fetch classes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingClass ? `/api/classes/${editingClass.id}` : '/api/classes'
      const method = editingClass ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(editingClass ? 'Class updated successfully!' : 'Class created successfully!')
        setShowModal(false)
        setEditingClass(null)
        setFormData({ name: '', department: '' })
        fetchClasses()
      } else {
        toast.error(data.error || 'Failed to save class')
      }
    } catch (error) {
      console.error('Failed to save class:', error)
      toast.error('An error occurred while saving class')
    }
  }

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem)
    setFormData({ name: classItem.name, department: classItem.department })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) return

    try {
      const res = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Class deleted successfully!')
        fetchClasses()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete class')
      }
    } catch (error) {
      console.error('Failed to delete class:', error)
      toast.error('Failed to delete class')
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="ADMIN" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Classes</h2>
              <Button onClick={() => { setShowModal(true); setEditingClass(null); setFormData({ name: '', department: '' }) }}>
                <i className="bi bi-plus-circle me-2"></i>Add Class
              </Button>
            </div>

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">Loading classes...</p>
                  </div>
                ) : classes.length === 0 ? (
                  <p className="text-muted text-center p-5">No classes found</p>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((classItem) => (
                        <tr key={classItem.id}>
                          <td>{classItem.name}</td>
                          <td>{classItem.department}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2"
                              onClick={() => handleEdit(classItem)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(classItem.id)}
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

            <Modal show={showModal} onHide={() => { setShowModal(false); setEditingClass(null); setFormData({ name: '', department: '' }) }}>
              <Modal.Header closeButton>
                <Modal.Title>{editingClass ? 'Edit Class' : 'Add Class'}</Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
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
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => { setShowModal(false); setFormData({ name: '', department: '' }) }}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingClass ? 'Update' : 'Create'}
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

