import { searchLiveStreams } from '@/server/search';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  const results = await searchLiveStreams(query);
  return NextResponse.json(results);
}
