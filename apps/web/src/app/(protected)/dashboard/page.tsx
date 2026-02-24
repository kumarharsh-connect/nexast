import Cockpit from '@/components/cockpit/Cockpit';
import { ensureUser, getCurrentUsername } from '@/server/user';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  await ensureUser();

  const username = await getCurrentUsername();

  if (!username) redirect('/sign-in');

  return (
    <div className='min-h-screen flex items-center justify-center bg-zinc-950'>
      <Cockpit username={username} />
    </div>
  );
}
