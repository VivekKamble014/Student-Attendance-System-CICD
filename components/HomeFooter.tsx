'use client'

import Link from 'next/link'
import { Container, Row, Col } from 'react-bootstrap'

export default function HomeFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="home-footer" style={{
      backgroundColor: '#1e293b',
      color: '#cbd5e1',
      padding: '4rem 0 2rem',
      marginTop: '4rem',
    }}>
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="text-white mb-3">
              <i className="bi bi-calendar-check me-2"></i>
              Attendance Pro
            </h5>
            <p style={{ color: '#94a3b8' }}>
              A comprehensive attendance management system designed for modern educational institutions.
              Streamline your attendance tracking with ease.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" style={{ color: '#cbd5e1', fontSize: '1.5rem' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" style={{ color: '#cbd5e1', fontSize: '1.5rem' }}>
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" style={{ color: '#cbd5e1', fontSize: '1.5rem' }}>
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" style={{ color: '#cbd5e1', fontSize: '1.5rem' }}>
                <i className="bi bi-github"></i>
              </a>
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="#features" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Features
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#testimonials" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Testimonials
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  About
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h6 className="text-white mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Register
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Documentation
                </a>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h6 className="text-white mb-3">Contact</h6>
            <ul className="list-unstyled">
              <li className="mb-2" style={{ color: '#94a3b8' }}>
                <i className="bi bi-envelope me-2"></i>
                support@attendancepro.com
              </li>
              <li className="mb-2" style={{ color: '#94a3b8' }}>
                <i className="bi bi-telephone me-2"></i>
                +1 (555) 123-4567
              </li>
              <li className="mb-2" style={{ color: '#94a3b8' }}>
                <i className="bi bi-geo-alt me-2"></i>
                123 Education St, City
              </li>
            </ul>
          </Col>
        </Row>
        <hr style={{ borderColor: '#334155', margin: '2rem 0 1rem' }} />
        <Row>
          <Col className="text-center">
            <p className="mb-2" style={{ color: '#64748b' }}>
              © {currentYear} Attendance Pro. All rights reserved.
            </p>
            <div style={{ 
              borderTop: '1px solid #334155', 
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <p className="mb-1" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                <strong style={{ color: '#cbd5e1' }}>Developed by:</strong>
              </p>
              <p className="mb-1" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                <i className="bi bi-person-badge me-2"></i>
                <strong style={{ color: '#cbd5e1' }}>Vivek Kamble</strong>
              </p>
              <p className="mb-1" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <i className="bi bi-mortarboard me-2"></i>
                MCA Div A | Roll No: 2401084
              </p>
              <p className="mb-0" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                <i className="bi bi-building me-2"></i>
                <a 
                  href="https://imcc.mespune.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#94a3b8', 
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#cbd5e1'
                    e.currentTarget.style.textDecoration = 'underline'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8'
                    e.currentTarget.style.textDecoration = 'none'
                  }}
                >
                  M.E.Society's Institute of Management and Career Courses (IMCC)
                  <i className="bi bi-box-arrow-up-right ms-1" style={{ fontSize: '0.7rem' }}></i>
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

