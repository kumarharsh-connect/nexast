'use server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function ensureUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const username =
    clerkUser.username ??
    clerkUser.emailAddresses[0].emailAddress.split('@')[0];

  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {},
    create: {
      clerkId: clerkUser.id,
      username,
    },
  });

  return user;
}

export async function getCurrentUsername() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  return user?.username ?? null;
}
