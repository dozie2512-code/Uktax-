'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AppLayout({ title, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
