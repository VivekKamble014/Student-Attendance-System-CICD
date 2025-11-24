'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'STUDENT',
    department: '',
    mobile: '',
    rollNo: '',
    class: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ level: '', text: '', width: '0%', color: '#6c757d' })
  const [departments, setDepartments] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [loadingClasses, setLoadingClasses] = useState(false)

  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ level: '', text: '', width: '0%', color: '#6c757d' })
    }
  }, [formData.password])

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments()
  }, [])

  // Fetch classes when department changes
  useEffect(() => {
    if (formData.department) {
      fetchClasses(formData.department)
    } else {
      setClasses([])
      if (formData.class) {
        setFormData(prev => ({ ...prev, class: '' }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.department])

  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    try {
      const res = await fetch('/api/departments')
      if (res.ok) {
        const data = await res.json()
        setDepartments(data.departments || [])
      } else {
        toast.error('Failed to load departments', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      toast.error('Failed to load departments', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setLoadingDepartments(false)
    }
  }

  const fetchClasses = async (department: string) => {
    setLoadingClasses(true)
    try {
      const res = await fetch(`/api/classes?department=${encodeURIComponent(department)}`)
      if (res.ok) {
        const data = await res.json()
        const fetchedClasses = data.classes || []
        setClasses(fetchedClasses)
        // Reset class selection if current class is not in the new list
        setFormData(prev => {
          if (prev.class && !fetchedClasses.some((c: any) => c.name === prev.class)) {
            return { ...prev, class: '' }
          }
          return prev
        })
      } else {
        toast.error('Failed to load classes', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast.error('Failed to load classes', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setLoadingClasses(false)
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    if (strength <= 2) {
      return { level: 'weak', text: 'Weak', width: '33%', color: '#ef4444' }
    } else if (strength <= 3) {
      return { level: 'medium', text: 'Medium', width: '66%', color: '#f59e0b' }
    } else {
      return { level: 'strong', text: 'Strong', width: '100%', color: '#10b981' }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Client-side validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.department) {
      toast.error('Please fill in all required fields', {
        position: 'top-right',
        autoClose: 3000,
      })
      setLoading(false)
      return
    }

    if (formData.role === 'STUDENT' && (!formData.rollNo || !formData.class)) {
      toast.error('Roll number and class are required for students', {
        position: 'top-right',
        autoClose: 3000,
      })
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        position: 'top-right',
        autoClose: 3000,
      })
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address', {
        position: 'top-right',
        autoClose: 3000,
      })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let data
      try {
        data = await res.json()
      } catch (parseError) {
        toast.error('Invalid response from server. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        })
        setLoading(false)
        return
      }

      if (!res.ok) {
        // Handle different error types
        let errorMessage = 'Registration failed. Please try again.'
        if (data.details && Array.isArray(data.details)) {
          errorMessage = data.details.join('. ')
        } else if (data.error) {
          errorMessage = data.error + (data.details ? `: ${data.details}` : '')
        }

        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 4000,
        })
        setLoading(false)
        return
      }

      // Success
      toast.success('Registration successful! Waiting for admin approval. Redirecting to login...', {
        position: 'top-right',
        autoClose: 3000,
      })
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Network error. Please check your connection and try again.', {
        position: 'top-right',
        autoClose: 3000,
      })
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Container fluid className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: '100%', width: '100%', maxWidth: '100%' }}>
        <Card className="register-card shadow-lg border-0 mx-auto">
          <Card.Body className="p-5">
            <div className="auth-header">
              <div className="auth-icon">
                <i className="bi bi-person-plus"></i>
              </div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join us and start managing attendance</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-section-title">Personal Information</div>
                <Row className="g-3">
                  <Col md={12}>
                    <div className="input-group-custom">
                      <Form.Label className="form-label-custom">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                      <i className="bi bi-person input-icon"></i>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="input-group-custom">
                      <Form.Label className="form-label-custom">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      <i className="bi bi-envelope input-icon"></i>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="input-group-custom">
                      <Form.Label className="form-label-custom">Password</Form.Label>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                        style={{ paddingRight: '3rem' }}
                      />
                      <i className="bi bi-lock input-icon"></i>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: 'calc(50% + 0.75rem)',
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
                      {formData.password && (
                        <div className="password-strength">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small" style={{ color: passwordStrength.color }}>
                              Password strength: <strong>{passwordStrength.text}</strong>
                            </span>
                          </div>
                          <div 
                            className="password-strength-bar"
                            style={{
                              background: passwordStrength.color,
                              width: passwordStrength.width,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="form-section">
                <div className="form-section-title">Account Type</div>
                <div className="role-selector">
                  <div
                    className={`role-option ${formData.role === 'STUDENT' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                  >
                    <i className="bi bi-person-badge"></i>
                    <div className="role-option-label">Student</div>
                  </div>
                  <div
                    className={`role-option ${formData.role === 'TEACHER' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'TEACHER' })}
                  >
                    <i className="bi bi-person-workspace"></i>
                    <div className="role-option-label">Teacher</div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Academic Information</div>
                <Row className="g-3">
                  <Col md={12}>
                    <div className="input-group-custom">
                      <Form.Label className="form-label-custom">Department</Form.Label>
                      {loadingDepartments ? (
                        <div className="d-flex align-items-center" style={{ padding: '0.5rem' }}>
                          <Spinner animation="border" size="sm" className="me-2" />
                          <span className="text-muted small">Loading departments...</span>
                        </div>
                      ) : (
                        <Form.Select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value, class: '' })}
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
                      <i className="bi bi-building input-icon"></i>
                    </div>
                  </Col>
                  {formData.role === 'STUDENT' && (
                    <>
                      <Col md={6}>
                        <div className="input-group-custom">
                          <Form.Label className="form-label-custom">Roll Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter roll number"
                            value={formData.rollNo}
                            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                            required
                          />
                          <i className="bi bi-123 input-icon"></i>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="input-group-custom">
                          <Form.Label className="form-label-custom">Class</Form.Label>
                          {loadingClasses ? (
                            <div className="d-flex align-items-center" style={{ padding: '0.5rem' }}>
                              <Spinner animation="border" size="sm" className="me-2" />
                              <span className="text-muted small">Loading classes...</span>
                            </div>
                          ) : (
                            <Form.Select
                              value={formData.class}
                              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                              required
                              disabled={!formData.department || classes.length === 0}
                            >
                              <option value="">
                                {!formData.department 
                                  ? 'Select Department First' 
                                  : classes.length === 0 
                                  ? 'No classes available' 
                                  : 'Select Class'}
                              </option>
                              {classes.map((cls) => (
                                <option key={cls.id} value={cls.name}>
                                  {cls.name}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                          <i className="bi bi-book input-icon"></i>
                        </div>
                        {formData.department && classes.length === 0 && !loadingClasses && (
                          <small className="text-muted">
                            No classes available for this department. Please contact admin.
                          </small>
                        )}
                      </Col>
                    </>
                  )}
                  <Col md={12}>
                    <div className="input-group-custom">
                      <Form.Label className="form-label-custom">
                        Mobile Number <span className="text-muted small">(Optional)</span>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                      <i className="bi bi-phone input-icon"></i>
                    </div>
                  </Col>
                </Row>
              </div>

              <Button
                type="submit"
                className="btn-auth w-100 mb-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="mb-0 text-muted">
                  Already have an account?{' '}
                  <a href="/login" className="auth-link">
                    Sign in here
                  </a>
                </p>
              </div>
            </Form>

            <div className="mt-4 pt-4 border-top">
              <div className="d-flex align-items-center justify-content-center gap-3 text-muted small">
                <i className="bi bi-shield-check"></i>
                <span>Secure registration</span>
                <span>•</span>
                <i className="bi bi-clock-history"></i>
                <span>Admin approval required</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
