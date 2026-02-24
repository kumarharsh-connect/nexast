import clsx from 'clsx';

interface ControlButtonProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ControlButton({
  active,
  children,
  onClick,
  className,
}: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out',
        'border',

        active
          ? [
              'bg-primary border-primary/50',
              'text-background',
              'shadow-(--glow-primary)',
              'hover:bg-primary-hover hover:scale-110 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]',
            ]
          : [
              'bg-white/5 border-white/5',
              'text-(--foreground-muted)',
              'hover:bg-white/10 hover:border-white/20 hover:text-foreground hover:scale-105',
            ],

        className,
      )}
    >
      <span className='relative z-10 active:scale-90 transition-transform duration-100'>
        {children}
      </span>
    </button>
  );
}
