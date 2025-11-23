'use client'

'use client'

import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function PendingUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users/pending')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: number, action: string) => {
    try {
      const res = await fetch('/api/admin/users/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`User ${action}d successfully!`, {
          position: 'top-right',
          autoClose: 3000,
        })
        fetchUsers()
      } else {
        toast.error(data.error || `Failed to ${action} user`, {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Network error. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  if (loading) {
    return <div className="text-center p-5">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar role="ADMIN" />
        <div className="flex-grow-1 p-4">
          <Container fluid>
            <h2 className="mb-4">Pending Users</h2>
            {users.length === 0 ? (
              <Card>
                <Card.Body className="text-center text-muted py-5">
                  <i className="bi bi-inbox" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  <p className="mt-3 mb-0">No pending users</p>
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Mobile</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg={user.role === 'TEACHER' ? 'primary' : 'success'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td>{user.department}</td>
                          <td>{user.mobile || '-'}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="success"
                              className="me-2"
                              onClick={() => handleApprove(user.id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleApprove(user.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </Container>
        </div>
      </div>
    </>
  )
}

