'use client'

import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import Link from 'next/link'
import HomeNavbar from '@/components/HomeNavbar'
import HomeFooter from '@/components/HomeFooter'

export default function Home() {
  const features = [
    {
      icon: 'bi-people',
      title: 'Role-Based Access',
      description: 'Separate dashboards for Admin, Teachers, and Students with appropriate permissions.',
    },
    {
      icon: 'bi-calendar-check',
      title: 'Easy Attendance Marking',
      description: 'Mark attendance quickly with bulk operations. Filter by class, date, or student.',
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure Authentication',
      description: 'JWT-based authentication with admin approval system for new registrations.',
    },
    {
      icon: 'bi-graph-up',
      title: 'Analytics Dashboard',
      description: 'Comprehensive statistics and reports for attendance tracking and analysis.',
    },
    {
      icon: 'bi-bell',
      title: 'Notifications',
      description: 'Real-time notifications for account approvals and important updates.',
    },
    {
      icon: 'bi-device-hdd',
      title: 'Data Management',
      description: 'Efficient CRUD operations for students, teachers, departments, and classes.',
    },
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Principal, ABC University',
      image: '👩‍💼',
      text: 'Attendance Pro has revolutionized how we track student attendance. The interface is intuitive and the reporting features are excellent.',
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Department Head, XYZ College',
      image: '👨‍🏫',
      text: 'As a teacher, I love how easy it is to mark attendance. The bulk operations save me so much time every day.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student, Tech Institute',
      image: '👩‍🎓',
      text: 'I can easily check my attendance percentage and see my records. It\'s transparent and user-friendly.',
    },
    {
      name: 'James Wilson',
      role: 'IT Administrator',
      image: '👨‍💻',
      text: 'The system is robust, secure, and easy to deploy. The Docker setup made our deployment seamless.',
    },
  ]

  return (
    <>
      <HomeNavbar />
      
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          paddingTop: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        />
        <Container className="position-relative">
          <Row className="align-items-center">
            <Col lg={6} className="text-white mb-5 mb-lg-0">
              <h1
                className="display-3 fw-bold mb-4"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  lineHeight: '1.2',
                }}
              >
                Streamline Your
                <br />
                <span style={{ color: '#fbbf24' }}>Attendance Management</span>
              </h1>
              <p className="lead mb-4" style={{ fontSize: '1.25rem', opacity: 0.95 }}>
                A comprehensive, modern solution for educational institutions to manage student
                attendance efficiently. Built with Next.js, MySQL, and Docker for scalability and reliability.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button
                  as={Link as any}
                  href="/register"
                  size="lg"
                  style={{
                    backgroundColor: '#fbbf24',
                    border: 'none',
                    color: '#1e293b',
                    fontWeight: 600,
                    padding: '0.75rem 2rem',
                  }}
                  className="shadow-lg"
                >
                  Get Started Free
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
                <Button
                  as={Link as any}
                  href="/login"
                  variant="outline-light"
                  size="lg"
                  style={{
                    padding: '0.75rem 2rem',
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '3rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <i className="bi bi-calendar-check" style={{ fontSize: '8rem', color: '#fbbf24' }}></i>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Powerful Features</h2>
              <p className="lead text-muted">
                Everything you need to manage attendance efficiently
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index}>
                <Card
                  className="h-100 border-0 shadow-sm"
                  style={{
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <Card.Body className="p-4">
                    <div
                      className="mb-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#667eea',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i className={`bi ${feature.icon}`} style={{ fontSize: '2rem', color: 'white' }}></i>
                    </div>
                    <Card.Title className="h5 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">What Our Users Say</h2>
              <p className="lead text-muted">
                Trusted by educational institutions worldwide
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col md={6} lg={3} key={index}>
                <Card
                  className="h-100 border-0 shadow-sm"
                  style={{
                    backgroundColor: '#f8fafc',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="text-center mb-3">
                      <div
                        style={{
                          fontSize: '3rem',
                          width: '80px',
                          height: '80px',
                          margin: '0 auto',
                          backgroundColor: '#e0e7ff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {testimonial.image}
                      </div>
                    </div>
                    <Card.Text className="text-muted mb-3" style={{ fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Card.Text>
                    <div className="text-center">
                      <strong>{testimonial.name}</strong>
                      <br />
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Developer Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '2.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
                <h3 className="fw-bold mb-4" style={{ color: '#1e293b' }}>
                  <i className="bi bi-code-slash me-2" style={{ color: '#667eea' }}></i>
                  About the Developer
                </h3>
                <div className="mb-3">
                  <p className="mb-2" style={{ color: '#64748b' }}>
                    <i className="bi bi-person-circle me-2" style={{ color: '#667eea' }}></i>
                    <strong style={{ color: '#1e293b' }}>Name:</strong> Vivek Kamble
                  </p>
                  <p className="mb-2" style={{ color: '#64748b' }}>
                    <i className="bi bi-mortarboard me-2" style={{ color: '#667eea' }}></i>
                    <strong style={{ color: '#1e293b' }}>Class:</strong> MCA Div A
                  </p>
                  <p className="mb-2" style={{ color: '#64748b' }}>
                    <i className="bi bi-123 me-2" style={{ color: '#667eea' }}></i>
                    <strong style={{ color: '#1e293b' }}>Roll No:</strong> 2401084
                  </p>
                  <p className="mb-0" style={{ color: '#64748b' }}>
                    <i className="bi bi-building me-2" style={{ color: '#667eea' }}></i>
                    <strong style={{ color: '#1e293b' }}>College:</strong>{' '}
                    <a 
                      href="https://imcc.mespune.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#667eea', 
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      M.E.Society's Institute of Management and Career Courses (IMCC)
                      <i className="bi bi-box-arrow-up-right ms-1" style={{ fontSize: '0.8rem' }}></i>
                    </a>
                  </p>
                </div>
                <p className="mt-3 mb-0" style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  This Student Attendance Management System was developed as part of academic project work.
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '2.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
                <h3 className="fw-bold mb-4" style={{ color: '#1e293b' }}>
                  <i className="bi bi-tools me-2" style={{ color: '#667eea' }}></i>
                  Technology Stack
                </h3>
                <Row className="g-3">
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                      <i className="bi bi-filetype-jsx" style={{ fontSize: '2rem', color: '#667eea' }}></i>
                      <p className="mb-0 mt-2 small" style={{ color: '#64748b' }}>Next.js</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                      <i className="bi bi-database" style={{ fontSize: '2rem', color: '#667eea' }}></i>
                      <p className="mb-0 mt-2 small" style={{ color: '#64748b' }}>MySQL</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                      <i className="bi bi-box" style={{ fontSize: '2rem', color: '#667eea' }}></i>
                      <p className="mb-0 mt-2 small" style={{ color: '#64748b' }}>Docker</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                      <i className="bi bi-gear" style={{ fontSize: '2rem', color: '#667eea' }}></i>
                      <p className="mb-0 mt-2 small" style={{ color: '#64748b' }}>Jenkins</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About/Stats Section */}
      <section id="about" style={{ padding: '5rem 0', backgroundColor: '#667eea', color: 'white' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Why Choose Attendance Pro?</h2>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={3} className="text-center">
              <i className="bi bi-speedometer2" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <h4 className="fw-bold">Fast & Reliable</h4>
              <p className="opacity-90">Lightning-fast performance with 99.9% uptime</p>
            </Col>
            <Col md={3} className="text-center">
              <i className="bi bi-shield-lock" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <h4 className="fw-bold">Secure</h4>
              <p className="opacity-90">Enterprise-grade security with JWT authentication</p>
            </Col>
            <Col md={3} className="text-center">
              <i className="bi bi-phone" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <h4 className="fw-bold">Responsive</h4>
              <p className="opacity-90">Works seamlessly on all devices and screen sizes</p>
            </Col>
            <Col md={3} className="text-center">
              <i className="bi bi-headset" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <h4 className="fw-bold">Support</h4>
              <p className="opacity-90">24/7 support and comprehensive documentation</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <Container>
          <Row>
            <Col className="text-center">
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '4rem 2rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              >
                <h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
                <p className="lead text-muted mb-4">
                  Join thousands of institutions already using Attendance Pro
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Button
                    as={Link as any}
                    href="/register"
                    size="lg"
                    style={{
                      backgroundColor: '#667eea',
                      border: 'none',
                      padding: '0.75rem 2.5rem',
                      fontWeight: 600,
                    }}
                  >
                    Create Free Account
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Button>
                  <Button
                    as={Link as any}
                    href="/login"
                    variant="outline-primary"
                    size="lg"
                    style={{
                      padding: '0.75rem 2.5rem',
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <HomeFooter />
    </>
  )
}
