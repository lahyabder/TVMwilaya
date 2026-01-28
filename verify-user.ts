import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@tvm.mr'
    const password = 'password123'

    const user = await prisma.user.findUnique({
        where: { email },
    })

    console.log('User found:', user)

    if (user) {
        const valid = await bcrypt.compare(password, user.password)
        console.log('Password valid:', valid)
    }
}

main()
