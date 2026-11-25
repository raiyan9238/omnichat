import { useState } from 'react';
import { Calendar, Menu, X } from 'lucide-react';
import { ToastType } from '../types/omnibook';

interface NavbarProps {
  onShowToast: (message: string, type?: ToastType) => void;
  onOpenSignIn: () => void;
  onOpenOnboarding: (title: string) => void;
}

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#channels', label: 'Channels' },
  { href: '#simulator', label: 'Simulator' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#roi-calculator', label: 'ROI Calculator' },
  { href: '#book-appointment', label: 'Book Appointment' },
];

export function Navbar({ onShowToast, onOpenSignIn, onOpenOnboarding }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface-card/90 backdrop-blur-xl border-b border-surface-border">
      <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand + Live Orchestration Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-on-surface">
              OmniBook<span className="text-secondary">.ai</span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => onShowToast('Cluster Health: 99.99% | All 5 Omni-Channel Pipes (incl. WhatsApp) Online', 'info')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-badge-web-bg text-badge-web-text font-mono text-[11px] font-semibold hover:bg-teal-100 transition-colors cursor-pointer border border-channel-web/20 whitespace-nowrap shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-channel-web animate-pulse" />
            <span>LIVE ORCHESTRATION</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-secondary transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSignIn}
            className="hidden md:inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-on-surface hover:bg-surface-container-low transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onOpenOnboarding('Book Practice Setup Call')}
            className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book Demo
          </button>
          <button
            type="button"
            onClick={() => onOpenOnboarding('14-Day Free Practice Trial')}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary text-white hover:bg-accent-hover text-sm font-semibold shadow-sm shadow-secondary/30 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start 14-Day Free Trial
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-surface-border text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-border bg-surface-card px-6 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-secondary hover:bg-surface-container-low transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-surface-border flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
              className="flex-1 py-2 px-3 rounded-lg border border-surface-border text-sm font-medium text-on-surface hover:bg-surface-container-low"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOnboarding('Book Practice Setup Call');
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-surface-container-high text-sm font-semibold text-on-surface"
            >
              Book Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
