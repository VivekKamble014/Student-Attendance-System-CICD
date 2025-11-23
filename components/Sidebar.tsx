'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Nav } from 'react-bootstrap'

interface SidebarProps {
  role: string
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { href: '/admin/users', label: 'Pending Users', icon: 'bi-people' },
    { href: '/admin/students', label: 'Students', icon: 'bi-person-badge' },
    { href: '/admin/teachers', label: 'Teachers', icon: 'bi-person-workspace' },
    { href: '/admin/attendance', label: 'Mark Attendance', icon: 'bi-calendar-check' },
    { href: '/admin/attendance/view', label: 'View Attendance', icon: 'bi-calendar3' },
    { href: '/admin/departments', label: 'Departments', icon: 'bi-building' },
    { href: '/admin/classes', label: 'Classes', icon: 'bi-book' },
  ]

  const teacherLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { href: '/teacher/students', label: 'Students', icon: 'bi-person-badge' },
    { href: '/teacher/attendance', label: 'Mark Attendance', icon: 'bi-calendar-check' },
    { href: '/teacher/attendance/view', label: 'View Attendance', icon: 'bi-calendar3' },
  ]

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { href: '/student/attendance', label: 'My Attendance', icon: 'bi-calendar-check' },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'TEACHER' ? teacherLinks : studentLinks

  return (
    <div className="sidebar p-3">
      <Nav className="flex-column">
        {links.map((link) => (
          <Nav.Link
            key={link.href}
            as={Link}
            href={link.href}
            className={pathname === link.href ? 'active' : ''}
          >
            <i className={`${link.icon} me-2`}></i>
            {link.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  )
}

