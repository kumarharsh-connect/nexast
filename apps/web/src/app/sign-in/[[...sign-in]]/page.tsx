import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='glass-panel p-8 rounded-2xl shadow-(--shadow-card)'>
        <SignIn
          appearance={{
            elements: {
              card: 'bg-card border border-border-glass',
              formButtonPrimary:
                'bg-primary hover:bg-(--primary-hover) text-background',
            },
          }}
        />
      </div>
    </div>
  );
}
