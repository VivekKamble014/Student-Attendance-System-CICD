import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { email, password, fullName, role, department, mobile, rollNo, class: className } = body

    // Comprehensive validation
    const errors: string[] = []

    if (!email || typeof email !== 'string' || !email.trim()) {
      errors.push('Email is required and must be a valid string')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email format is invalid')
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password is required')
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    }

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      errors.push('Full name is required')
    } else if (fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long')
    }

    if (!role || typeof role !== 'string') {
      errors.push('Role is required')
    } else if (!['STUDENT', 'TEACHER'].includes(role.toUpperCase())) {
      errors.push('Role must be either STUDENT or TEACHER')
    }

    if (!department || typeof department !== 'string' || !department.trim()) {
      errors.push('Department is required')
    }

    // Student-specific validation
    if (role.toUpperCase() === 'STUDENT') {
      if (!rollNo || typeof rollNo !== 'string' || !rollNo.trim()) {
        errors.push('Roll number is required for students')
      }
      if (!className || typeof className !== 'string' || !className.trim()) {
        errors.push('Class is required for students')
      }
    }

    // Mobile validation (optional but if provided, should be valid)
    if (mobile && typeof mobile === 'string' && mobile.trim()) {
      const mobileRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
      if (!mobileRegex.test(mobile.trim())) {
        errors.push('Mobile number format is invalid')
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Normalize data
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedRole = role.toUpperCase()
    const normalizedFullName = fullName.trim()
    const normalizedDepartment = department.trim()
    const normalizedMobile = mobile ? mobile.trim() : null

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (dbError: any) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: 'Please check your database configuration and ensure the database is running. Make sure DATABASE_URL is set correctly in your .env file.'
        },
        { status: 503 }
      )
    }

    // Check if user already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists with this email address' },
          { status: 409 }
        )
      }
    } catch (dbError: any) {
      console.error('Database query error:', dbError)
      return NextResponse.json(
        { 
          error: 'Database query failed', 
          details: dbError.message || 'Unable to check existing user'
        },
        { status: 500 }
      )
    }

    // Check if roll number already exists (for students)
    if (normalizedRole === 'STUDENT' && rollNo) {
      try {
        const existingStudent = await prisma.student.findUnique({
          where: { rollNo: rollNo.trim() }
        })

        if (existingStudent) {
          return NextResponse.json(
            { error: 'Roll number already exists' },
            { status: 409 }
          )
        }
      } catch (dbError: any) {
        console.error('Database query error:', dbError)
        // Continue if this check fails, but log it
      }
    }

    // Hash password
    let hashedPassword: string
    try {
      hashedPassword = await hashPassword(password)
    } catch (hashError: any) {
      console.error('Password hashing error:', hashError)
      return NextResponse.json(
        { error: 'Password encryption failed', details: 'Unable to process password' },
        { status: 500 }
      )
    }

    // Use transaction to ensure data consistency
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: normalizedEmail,
            password: hashedPassword,
            fullName: normalizedFullName,
            role: normalizedRole as 'STUDENT' | 'TEACHER' | 'ADMIN',
            department: normalizedDepartment,
            mobile: normalizedMobile,
            status: 'PENDING'
          }
        })

        // Create role-specific record
        if (normalizedRole === 'STUDENT') {
          await tx.student.create({
            data: {
              userId: user.id,
              rollNo: rollNo.trim(),
              class: className.trim(),
              department: normalizedDepartment,
              status: 'Active'
            }
          })
        } else if (normalizedRole === 'TEACHER') {
          await tx.teacher.create({
            data: {
              userId: user.id,
              department: normalizedDepartment
            }
          })
        }

        return user
      })

      // Return success response (don't include password)
      return NextResponse.json(
        {
          message: 'Registration successful. Your account is pending admin approval.',
          user: {
            id: result.id,
            email: result.email,
            fullName: result.fullName,
            role: result.role,
            status: result.status
          }
        },
        { status: 201 }
      )
    } catch (transactionError: any) {
      console.error('Transaction error:', transactionError)

      // Handle specific Prisma errors
      if (transactionError.code === 'P2002') {
        // Unique constraint violation
        const field = transactionError.meta?.target?.[0] || 'field'
        return NextResponse.json(
          { error: `${field} already exists` },
          { status: 409 }
        )
      }

      if (transactionError.code === 'P2003') {
        // Foreign key constraint violation
        return NextResponse.json(
          { error: 'Invalid reference data' },
          { status: 400 }
        )
      }

      // Generic transaction error
      return NextResponse.json(
        {
          error: 'Registration failed',
          details: transactionError.message || 'Unable to create user account'
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle unexpected errors
    return NextResponse.json(
      {
        error: 'Registration failed',
        details: error.message || 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    )
  }
}
