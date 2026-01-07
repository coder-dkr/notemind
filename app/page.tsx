import { Button } from '@/components/ui/button';
import { LandingHero } from '@/components/landing/hero';
import { LandingFeatures } from '@/components/landing/features';
import { LandingFooter } from '@/components/landing/footer';
import { SignedOut } from '@/components/auth/signed-out';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="fixed top-0 w-full z-50 glass">
        <div className="container flex items-center justify-between h-20 px-4 md:px-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">N</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Notemind<span className="text-primary">.ai</span></span>
          </div>
          <div className="flex items-center gap-6">
            <SignedOut>
              <Button variant="ghost" className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/5 transition-all" asChild>
                <a href="/login">Login</a>
              </Button>
              <Button className="purple-gradient border-0 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/25" asChild>
                <a href="/signup">Get Started</a>
              </Button>
            </SignedOut>
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative z-10 pt-20">
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
