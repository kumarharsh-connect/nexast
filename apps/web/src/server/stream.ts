'use server';
import { ensureUser } from './user';
import { prisma } from '@/lib/prisma';

export async function markStreamLive(title: string, category: string) {
  const dbUser = await ensureUser();
  if (!dbUser) return;

  await prisma.stream.upsert({
    where: {
      userId: dbUser.id,
    },
    update: { isLive: true, title, category },
    create: {
      userId: dbUser.id,
      title,
      category,
      isLive: true,
    },
  });
}

export async function markStreamOffline() {
  const dbUser = await ensureUser();
  if (!dbUser) return;

  await prisma.stream.updateMany({
    where: { userId: dbUser.id },
    data: { isLive: false },
  });
}

export async function getStreamByUsername(username: string) {
  return prisma.stream.findFirst({
    where: {
      user: {
        username,
      },
    },
    include: {
      user: true,
    },
  });
}

export async function getLiveStreams() {
  return prisma.stream.findMany({
    where: { isLive: true },
    include: {
      user: true,
    },
  });
}
