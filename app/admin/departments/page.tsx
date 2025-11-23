'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Form, Modal, Spinner } from 'react-bootstrap'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { toast } from 'react-toastify'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', code: '' })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setDepartments(data.departments || [])
      } else {
        toast.error('Failed to fetch departments')
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      toast.error('Failed to fetch departments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingDept ? `/api/departments/${editingDept.id}` : '/api/departments'
      const method = editingDept ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(editingDept ? 'Department updated successfully!' : 'Department created successfully!')
        setShowModal(false)
        setEditingDept(null)
        setFormData({ name: '', code: '' })
        fetchDepartments()
      } else {
        toast.error(data.error || 'Failed to save department')
      }
    } catch (error) {
      console.error('Failed to save department:', error)
      toast.error('An error occurred while saving department')
    }
  }

  const handleEdit = (dept: any) => {
    setEditingDept(dept)
    setFormData({ name: dept.name, code: dept.code })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department? This action cannot be undone.')) return

    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Department deleted successfully!')
        fetchDepartments()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete department')
      }
    } catch (error) {
      console.error('Failed to delete department:', error)
      toast.error('Failed to delete department')
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
              <h2>Departments</h2>
              <Button onClick={() => { setShowModal(true); setEditingDept(null); setFormData({ name: '', code: '' }) }}>
                <i className="bi bi-plus-circle me-2"></i>Add Department
              </Button>
            </div>

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">Loading departments...</p>
                  </div>
                ) : departments.length === 0 ? (
                  <p className="text-muted text-center p-5">No departments found</p>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept.id}>
                          <td>{dept.name}</td>
                          <td>{dept.code}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2"
                              onClick={() => handleEdit(dept)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(dept.id)}
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

            <Modal show={showModal} onHide={() => { setShowModal(false); setEditingDept(null); setFormData({ name: '', code: '' }) }}>
              <Modal.Header closeButton>
                <Modal.Title>{editingDept ? 'Edit Department' : 'Add Department'}</Modal.Title>
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
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => { setShowModal(false); setFormData({ name: '', code: '' }) }}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingDept ? 'Update' : 'Create'}
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

