import { Button } from '@/components/ui/button';
import { LandingHero } from '@/components/landing/hero';
import { LandingFeatures } from '@/components/landing/features';
import { LandingFooter } from '@/components/landing/footer';
import { SignedOut } from '@/components/auth/signed-out';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">NoteMind</span>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <Button variant="ghost" className="sm:flex" asChild>
                <a href="/login">Login</a>
              </Button>
              <Button className="sm:flex" asChild>
                <a href="/signup">Sign Up</a>
              </Button>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}