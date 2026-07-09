import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              VENTURE
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">
              The Journey of Growth
            </p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-color)] p-8">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-[var(--text-muted)]">
        Powered by MacDotCom
      </footer>
    </div>
  );
};

export default PublicLayout;