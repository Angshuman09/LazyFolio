// lib/getOrCreateUser.ts

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function getOrCreateUser() {
  const { userId } = await auth()

  if (!userId) return null

  let user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: "", // optional (you can fetch from Clerk)
        onboarded: false
      }
    })
  }

  return user
}