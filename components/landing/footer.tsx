import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">NoteMind</h3>
          <p className="text-sm text-muted-foreground">
            Take smarter notes with AI assistance.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Link href="#" className="text-sm hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NoteMind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}