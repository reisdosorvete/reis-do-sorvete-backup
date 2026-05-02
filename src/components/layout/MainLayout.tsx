import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <Sidebar />
      <main className="pl-64 relative z-10">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}