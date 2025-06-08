import { DashboardNav } from '@/components/dashboard/nav';
import { DashboardHeader } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}