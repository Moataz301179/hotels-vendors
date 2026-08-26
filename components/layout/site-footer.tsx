import Link from 'next/link';

const FOOTER_COLUMNS = [
  { theme: 'platform', title: 'Platform', color: '#FF3D00', links: [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/solutions/hotels', label: 'For Hotels' },
    { href: '/solutions/suppliers', label: 'For Suppliers' },
    { href: '/solutions/shipping', label: 'For Logistics' },
    { href: '/solutions/factoring', label: 'For Funders' },
  ]},
  { theme: 'company', title: 'Company', color: '#F59E0B', links: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/press', label: 'Press Kit' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]},
  { theme: 'resources', title: 'Resources', color: '#06B6D4', links: [
    { href: '/help', label: 'Help Center' },
    { href: '/api/docs', label: 'API Docs' },
    { href: '/compliance/eta', label: 'ETA Compliance' },
    { href: '/security', label: 'Security' },
    { href: '/status', label: 'System Status' },
  ]},
  { theme: 'legal', title: 'Legal', color: '#8B5CF6', links: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/accessibility', label: 'Accessibility' },
    { href: '/legal/authority-matrix', label: 'Authority Matrix' },
  ]},
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/branding/hv-mark.png" alt="" width={36} height={36} />
            <span className="font-black tracking-[3.8px] text-white text-lg">HotelsVendors</span>
          </div>
          <p className="text-white/40 text-sm max-w-xs text-center md:text-right">
            Digital Procurement Hub for Egyptian Hospitality
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.theme} aria-labelledby={`${col.theme}-heading`}>
              <h3 id={`${col.theme}-heading`} className="font-bold uppercase tracking-[2.5px] text-[11px] mb-4" style={{ color: col.color }}>
                {col.title}
              </h3>
              <ul className="space-y-3" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/30 text-sm font-medium">© {new Date().getFullYear()} HotelsVendors. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com/company/hotelsvendors" target="_blank" rel="noopener" className="text-white/40 hover:text-white transition-colors" aria-label="LinkedIn"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            <a href="https://twitter.com/hotelsvendors" target="_blank" rel="noopener" className="text-white/40 hover:text-white transition-colors" aria-label="Twitter"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg></a>
            <a href="https://github.com/hotelsvendors" target="_blank" rel="noopener" className="text-white/40 hover:text-white transition-colors" aria-label="GitHub"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
