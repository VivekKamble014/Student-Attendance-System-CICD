require('dotenv').config({ path: '.env' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'mrvivek@gmail.com'
    const password = 'Vivek@142003'
    const fullName = 'Vivek Admin'

    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Update existing user to admin
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          status: 'APPROVED',
          fullName: fullName
        }
      })
      console.log('✅ Admin user updated successfully!')
      console.log('Email:', email)
      console.log('Password:', password)
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: fullName,
          role: 'ADMIN',
          status: 'APPROVED',
          department: 'Administration'
        }
      })
      console.log('✅ Admin user created successfully!')
      console.log('Email:', email)
      console.log('Password:', password)
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

