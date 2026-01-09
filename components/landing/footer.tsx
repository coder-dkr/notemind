import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-background overflow-hidden">
      <div className="container flex flex-col gap-12 py-16 md:py-24 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-xl">K</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">KeraMind<span className="text-primary">.ai</span></span>
            </div>
            <p className="text-white/40 text-lg font-medium max-w-sm leading-relaxed">
              A cognitive intelligence platform that helps you understand, structure, and improve your thinking over time.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors font-medium">Features</Link></li>
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors font-medium">Pricing</Link></li>
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors font-medium">AI Tools</Link></li>
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors font-medium">Integrations</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors font-medium">Terms of Service</Link></li>
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors font-medium">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/20 text-sm font-medium">
            © {new Date().getFullYear()} KeraMind.ai. All rights reserved. Clarity over features.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-white/20 hover:text-white transition-colors"><span className="sr-only">Twitter</span><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></Link>
            <Link href="#" className="text-white/20 hover:text-white transition-colors"><span className="sr-only">GitHub</span><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
