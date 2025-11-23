'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Card, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Ensure cookies are sent and received
      })

      const data = await res.json()

      if (!res.ok) {
        setLoading(false)
        if (res.status === 403) {
          toast.error(data.error || 'Your account is pending approval', {
            position: 'top-right',
            autoClose: 4000,
          })
        } else if (res.status === 401) {
          toast.error('Invalid email or password', {
            position: 'top-right',
            autoClose: 3000,
          })
        } else {
          toast.error(data.error || 'Login failed. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
          })
        }
        return
      }

      // Login successful - cookie is set in response
      toast.success('Login successful! Redirecting to dashboard...', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
      })

      // Determine redirect path based on role
      const redirectPath = data.user?.role === 'ADMIN' 
        ? '/admin/dashboard' 
        : data.user?.role === 'TEACHER'
        ? '/teacher/dashboard'
        : data.user?.role === 'STUDENT'
        ? '/student/dashboard'
        : '/dashboard'

      console.log('Login successful, redirecting to:', redirectPath)
      console.log('User role:', data.user?.role)

      // Redirect after toast shows
      // Cookie is set in response headers, will be sent automatically
      setTimeout(() => {
        console.log('Executing redirect to:', redirectPath)
        window.location.href = redirectPath
      }, 1500)
    } catch (error) {
      setLoading(false)
      toast.error('Network error. Please check your connection and try again.', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  return (
    <div className="login-container">
      <Container fluid className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: '100%', width: '100%', maxWidth: '100%' }}>
        <Card className="login-card shadow-lg border-0 mx-auto">
          <Card.Body className="p-5">
            <div className="auth-header">
              <div className="auth-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to continue to your account</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <div className="input-group-custom">
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <i className="bi bi-envelope input-icon"></i>
              </div>

              <div className="input-group-custom">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <i className="bi bi-lock input-icon"></i>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    zIndex: 10,
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#667eea'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Remember me"
                  className="text-muted small"
                />
                <a href="#" className="text-decoration-none small" style={{ color: '#667eea' }}>
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="btn-auth w-100 mb-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="mb-0 text-muted">
                  Don't have an account?{' '}
                  <a href="/register" className="auth-link">
                    Create one now
                  </a>
                </p>
              </div>
            </Form>

            <div className="mt-4 pt-4 border-top text-center">
              <p className="text-muted small mb-0">
                <i className="bi bi-shield-check me-1"></i>
                Secure login with JWT authentication
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
