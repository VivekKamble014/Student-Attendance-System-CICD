import { NextRequest, NextResponse } from 'next/server'
import { adminOnly } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// GET - List all classes (public for registration)
async function getHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const department = searchParams.get('department')

    const where: any = {}
    if (department) {
      where.department = department
    }

    const classes = await prisma.class.findMany({
      where,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ classes })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch classes', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create class
async function postHandler(req: NextRequest) {
  try {
    const { name, department } = await req.json()

    if (!name || !department) {
      return NextResponse.json(
        { error: 'Name and department are required' },
        { status: 400 }
      )
    }

    const classRecord = await prisma.class.create({
      data: { name, department }
    })

    return NextResponse.json({ class: classRecord }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create class', details: error.message },
      { status: 500 }
    )
  }
}

// GET is public for registration, POST requires admin
export const GET = getHandler
export const POST = adminOnly(postHandler)

