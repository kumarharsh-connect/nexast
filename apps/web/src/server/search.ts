'use server';

import { prisma } from '@/lib/prisma';

export async function searchLiveStreams(query: string) {
  if (!query) return [];

  return prisma.stream.findMany({
    where: {
      isLive: true,
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },

        {
          user: {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: { user: true },
    take: 10,
  });
}
