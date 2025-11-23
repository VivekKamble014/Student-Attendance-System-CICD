'use client'

import Link from 'next/link'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`home-navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease',
        padding: '1rem 0',
      }}
    >
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold" style={{ fontSize: '1.75rem', color: '#4f46e5' }}>
          <i className="bi bi-calendar-check me-2"></i>
          Attendance Pro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} href="#features" className="mx-2">
              Features
            </Nav.Link>
            <Nav.Link as={Link} href="#testimonials" className="mx-2">
              Testimonials
            </Nav.Link>
            <Nav.Link as={Link} href="#about" className="mx-2">
              About
            </Nav.Link>
            <Nav.Link as={Link} href="/login" className="mx-2">
              <Button variant="outline-primary" size="sm">
                Login
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} href="/register" className="mx-2">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

