import type { FC, ReactNode } from 'react';

export const NavLink: FC<{
  href: string;
  children: ReactNode;
}> = ({ href, children }) => (
  <a 
    href={href} 
    className="relative py-1 text-black font-medium transition-colors duration-300 hover:text-brand group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
  </a>
);