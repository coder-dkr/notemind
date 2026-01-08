import { DashboardNav } from '@/components/dashboard/nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 w-full z-50 glass border-b border-white/5">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg purple-gradient flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white">Notemind<span className="text-primary">.ai</span></span>
          </div>
          <div className="flex items-center gap-4">
            {/* User Profile or other header items could go here */}
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex relative z-10 overflow-hidden">
        <DashboardNav />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="container max-w-7xl mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
