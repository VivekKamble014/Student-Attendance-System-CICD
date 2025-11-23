import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, adminOnly } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// GET - List all teachers
async function getHandler(req: any) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''

    const where: any = {}
    
    if (search) {
      where.user = {
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } }
        ]
      }
    }

    if (department) {
      where.department = department
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            mobile: true,
            status: true,
            department: true
          }
        }
      },
      orderBy: { id: 'desc' }
    })

    return NextResponse.json({ teachers })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch teachers', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new teacher
async function postHandler(req: any) {
  try {
    const body = await req.json()
    const { email, password, fullName, department, mobile } = body

    if (!email || !password || !fullName || !department) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user and teacher
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'TEACHER',
        department,
        mobile: mobile || null,
        status: 'APPROVED',
        teacher: {
          create: {
            department
          }
        }
      },
      include: { teacher: true }
    })

    return NextResponse.json({ teacher: user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create teacher', details: error.message },
      { status: 500 }
    )
  }
}

// Allow admin to access
export const GET = requireAuth(getHandler)
export const POST = adminOnly(postHandler)

