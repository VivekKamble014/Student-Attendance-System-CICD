import { NextRequest, NextResponse } from 'next/server'
import { adminOnly } from '@/lib/middleware-api'
import { prisma } from '@/lib/db'

// GET - List all departments (public for registration)
async function getHandler(req: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ departments })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch departments', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create department
async function postHandler(req: NextRequest) {
  try {
    const { name, code } = await req.json()

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      )
    }

    const department = await prisma.department.create({
      data: { name, code }
    })

    return NextResponse.json({ department }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create department', details: error.message },
      { status: 500 }
    )
  }
}

// GET is public for registration, POST requires admin
export const GET = getHandler
export const POST = adminOnly(postHandler)

