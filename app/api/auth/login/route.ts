import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { generateTokenEdge } from '@/lib/auth-edge'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        teacher: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is approved (Admin users are always approved)
    if (user.status !== 'APPROVED' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Your account is pending approval. Please wait for admin approval.' },
        { status: 403 }
      )
    }

    // Ensure admin users are always approved
    if (user.role === 'ADMIN' && user.status !== 'APPROVED') {
      // Auto-approve admin users
      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'APPROVED' }
      })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate token using Edge-compatible library
    const token = await generateTokenEdge({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Create JSON response (not redirect) so client can handle it
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department
      },
      token
    })

    // Set cookie on JSON response - ensure it's set correctly
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    }
    
    response.cookies.set('token', token, cookieOptions)
    
    // Also set a response header to confirm cookie was set
    response.headers.set('X-Cookie-Set', 'true')
    
    console.log('[Login] Cookie set for:', user.email, 'Role:', user.role)
    console.log('[Login] Cookie options:', cookieOptions)

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    )
  }
}

