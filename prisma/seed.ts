import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main(){
  const hashed = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurant.local' },
    update: {},
    create: {
      email: 'admin@restaurant.local',
      name: 'Admin',
      password: hashed,
      role: 'ADMIN'
    }
  })
  console.log('upserted admin:', admin.email)
}

main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>prisma.$disconnect())
