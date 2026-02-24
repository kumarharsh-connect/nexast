import StreamPlayer from '@/components/stream/StreamPlayer';
import { getStreamByUsername } from '@/server/stream';

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const stream = await getStreamByUsername(username);

  return <StreamPlayer username={username} stream={stream} />;
}
