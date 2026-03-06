import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: 'success',
        message: 'Supabase database is awake',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Database ping failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to wake database',
      },
      { status: 500 },
    );
  }
}
