import { Outlet } from '@tanstack/react-router';
import { Toaster } from '@mesmo/ui-kit';

import { Footer } from '@/components/layout/footer';
import { TopBar } from '@/components/layout/top-bar';

/**
 * The chrome that wraps every module: top bar, the active module's view
 * (rendered through the router's <Outlet />), and the footer.
 */
export function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
