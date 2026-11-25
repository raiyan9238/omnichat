import { FormEvent, useState } from 'react';
import { Calendar } from 'lucide-react';
import { ChannelDetailInfo, ToastType } from '../types/omnibook';

interface FooterProps {
  onShowToast: (message: string, type?: ToastType) => void;
  onSelectChannel: (key: ChannelDetailInfo['key']) => void;
  onOpenOnboarding: (title: string) => void;
}

export function Footer({ onShowToast, onSelectChannel, onOpenOnboarding }: FooterProps) {
  const [email, setEmail] = useState('');

  function handleNewsletterSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail('');
    onShowToast('Subscribed! Confirmation email sent.', 'success');
  }

  return (
    <footer className="w-full bg-surface-container-lowest text-on-surface border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-8 border-b border-surface-border">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-display font-extrabold text-sm">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-display text-base font-bold text-on-surface">
                OmniBook<span className="text-secondary">.ai</span>
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm mb-4">
              Autonomous omni-channel conversational AI appointment orchestrator designed for clinics and high-velocity practices. Sub-second zero shadow lock.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10px] bg-surface-container-low px-2 py-1 rounded text-text-muted">
                HIPAA Compliant
              </span>
              <span className="font-mono text-[10px] bg-surface-container-low px-2 py-1 rounded text-text-muted">
                SOC2 Type II
              </span>
              <span className="font-mono text-[10px] bg-surface-container-low px-2 py-1 rounded text-text-muted">
                99.99% SLA
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-mono text-xs uppercase text-text-muted font-bold">Product</h4>
            <a href="#features" className="text-xs text-text-muted hover:text-secondary transition-colors">
              Core Scheduling
            </a>
            <a href="#channels" className="text-xs text-text-muted hover:text-secondary transition-colors">
              Omni-Channel Voice
            </a>
            <a href="#simulator" className="text-xs text-text-muted hover:text-secondary transition-colors">
              Live AI Simulator
            </a>
            <a href="#integrations" className="text-xs text-text-muted hover:text-secondary transition-colors">
              EMR &amp; Calendar Sync
            </a>
            <a href="#roi-calculator" className="text-xs text-text-muted hover:text-secondary transition-colors">
              ROI Calculator
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-mono text-xs uppercase text-text-muted font-bold">Channels</h4>
            <button
              type="button"
              onClick={() => onSelectChannel('whatsapp')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              WhatsApp Booking
            </button>
            <button
              type="button"
              onClick={() => onSelectChannel('instagram')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              Instagram DM
            </button>
            <button
              type="button"
              onClick={() => onSelectChannel('messenger')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              Messenger Agent
            </button>
            <button
              type="button"
              onClick={() => onSelectChannel('web')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              Live Web Concierge
            </button>
            <button
              type="button"
              onClick={() => onSelectChannel('voice')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              Telephony &amp; Voice
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-mono text-xs uppercase text-text-muted font-bold">Company</h4>
            <button
              type="button"
              onClick={() => onOpenOnboarding('About OmniBook Information')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              About Us
            </button>
            <a href="#book-appointment" className="text-xs text-text-muted hover:text-secondary transition-colors">
              Book Appointment
            </a>
            <button
              type="button"
              onClick={() => onShowToast('Security Whitepaper sent to admin cluster', 'info')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              Security Whitepaper
            </button>
            <button
              type="button"
              onClick={() => onShowToast('All 4 API clusters operating at 100% health', 'success')}
              className="text-xs text-left text-text-muted hover:text-secondary transition-colors cursor-pointer"
            >
              Network Status
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-mono text-xs uppercase text-text-muted font-bold">Stay Informed</h4>
            <p className="text-xs text-text-muted">
              Join 12,000+ practice managers receiving our bi-weekly agent latency report.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1 mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                aria-label="Work email"
                className="bg-surface-container-low text-xs text-on-surface px-2.5 py-1.5 rounded-lg border border-surface-border flex-1 min-w-0 focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="bg-primary text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p className="font-mono text-[11px]">
            © 2025 OmniBook.ai Inc. Precision appointment orchestration engines. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <button
              type="button"
              onClick={() =>
                onShowToast('Privacy Policy: Zero data sold, HIPAA compliant encryption.', 'info')
              }
              className="hover:text-on-surface cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() =>
                onShowToast(
                  'Terms of Service: Standard BAA & 99.99% uptime SLA apply.',
                  'info'
                )
              }
              className="hover:text-on-surface cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
