import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// GET - List all students
async function getHandler(req: any) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''
    const classFilter = searchParams.get('class') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { user: { fullName: { contains: search } } },
        { rollNo: { contains: search } }
      ]
    }

    if (department) {
      where.department = department
    }

    if (classFilter) {
      where.class = classFilter
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            mobile: true
          }
        }
      },
      orderBy: { rollNo: 'asc' }
    })

    return NextResponse.json({ students })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new student
async function postHandler(req: any) {
  try {
    const body = await req.json()
    const { email, password, fullName, rollNo, class: className, department, mobile } = body

    if (!email || !password || !fullName || !rollNo || !className || !department) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if roll number exists
    const existingStudent = await prisma.student.findUnique({
      where: { rollNo }
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Roll number already exists' },
        { status: 400 }
      )
    }

    // Create user and student
    const { hashPassword } = await import('@/lib/auth')
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'STUDENT',
        department,
        mobile: mobile || null,
        status: 'APPROVED',
        student: {
          create: {
            rollNo,
            class: className,
            department,
            status: 'Active'
          }
        }
      },
      include: { student: true }
    })

    return NextResponse.json({ student: user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create student', details: error.message },
      { status: 500 }
    )
  }
}

// Allow admin and teacher
export const GET = requireAuth(getHandler)
export const POST = requireAuth(postHandler)

