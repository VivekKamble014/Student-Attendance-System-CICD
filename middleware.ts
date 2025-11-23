import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from './lib/auth-edge'

export async function middleware(request: NextRequest) {
  let token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Debug: Log all cookies (only in development)
  if (process.env.NODE_ENV === 'development') {
    const allCookies = request.cookies.getAll()
    console.log('[Middleware] Request to:', pathname)
    console.log('[Middleware] All cookies:', allCookies.map(c => c.name))
    console.log('[Middleware] Token exists:', !!token)
  }

  // Public routes
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      // If user has token, verify it and redirect to appropriate dashboard
      const payload = await verifyTokenEdge(token)
      if (payload) {
        const dashboardPath = payload.role === 'ADMIN' 
          ? '/admin/dashboard'
          : payload.role === 'TEACHER'
          ? '/teacher/dashboard'
          : payload.role === 'STUDENT'
          ? '/student/dashboard'
          : '/dashboard'
        console.log('[Middleware] Redirecting authenticated user from', pathname, 'to', dashboardPath)
        return NextResponse.redirect(new URL(dashboardPath, request.url))
      } else {
        console.log('[Middleware] Token invalid on public route, allowing access')
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    console.log('[Middleware] No token found for path:', pathname)
    console.log('[Middleware] Available cookies:', request.cookies.getAll().map(c => c.name))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Token found, verifying... Token length:', token.length)
  }
  
  const payload = await verifyTokenEdge(token)
  if (!payload) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Invalid token for path:', pathname)
      console.log('[Middleware] Token preview:', token.substring(0, 30) + '...')
    }
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Token verified! Path:', pathname, 'Role:', payload.role)
  }

  // Allow /dashboard to pass through - it will handle its own redirect
  if (pathname === '/dashboard') {
    return NextResponse.next()
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
    // Redirect to appropriate dashboard based on role
    if (payload.role === 'TEACHER') {
      return NextResponse.redirect(new URL('/teacher/dashboard', request.url))
    } else if (payload.role === 'STUDENT') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname.startsWith('/teacher') && payload.role !== 'TEACHER' && payload.role !== 'ADMIN') {
    if (payload.role === 'STUDENT') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname.startsWith('/student') && payload.role !== 'STUDENT') {
    if (payload.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else if (payload.role === 'TEACHER') {
      return NextResponse.redirect(new URL('/teacher/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/teacher/:path*',
    '/student/:path*',
    '/api/protected/:path*',
  ],
}

