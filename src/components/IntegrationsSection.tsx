import {
  Calendar,
  Clock,
  Flower2,
  Gauge,
  HeartPulse,
  Lock,
  Mail,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Zap,
} from 'lucide-react';
import { INTEGRATIONS } from '../data/omnibookData';

interface IntegrationsSectionProps {
  onTestIntegration: (name: string, latencyMs: number) => void;
}

function getIntegrationIcon(id: string) {
  switch (id) {
    case 'whatsapp-api':
      return MessageSquareText;
    case 'google-cal':
      return Calendar;
    case 'outlook':
    case 'sendgrid':
      return Mail;
    case 'mindbody':
      return Flower2;
    case 'jane':
      return Stethoscope;
    case 'acuity':
      return Clock;
    case 'epic':
      return HeartPulse;
    case 'twilio':
      return PhoneCall;
    case 'zapier':
    default:
      return Zap;
  }
}

const SECURITY_BADGES = [
  {
    icon: HeartPulse,
    iconBg: 'bg-status-success/15 text-status-success',
    title: 'HIPAA Compliant',
    subtitle: 'BAA for Clinical Entities',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-secondary/15 text-secondary',
    title: 'SOC2 Type II',
    subtitle: 'Rigorous Annual Audits',
  },
  {
    icon: Lock,
    iconBg: 'bg-channel-web/15 text-channel-web',
    title: 'End-to-End Encrypted',
    subtitle: 'TLS 1.3 & AES-256',
  },
  {
    icon: Gauge,
    iconBg: 'bg-primary/15 text-primary',
    title: '99.99% Uptime SLA',
    subtitle: 'High Availability Cluster',
  },
];

export function IntegrationsSection({ onTestIntegration }: IntegrationsSectionProps) {
  return (
    <section id="integrations" className="scroll-mt-16 w-full py-16 bg-surface border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
            Connects Natively to Your Calendar &amp; Practice Software
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Zero migrations. OmniBook operates as an autonomous conversational layer over your tools.
          </p>
        </div>

        {/* 8 Clickable Integration Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          {INTEGRATIONS.map((item) => {
            const Icon = getIntegrationIcon(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTestIntegration(item.name, item.latencyMs)}
                className="bg-surface-card border border-surface-border hover:border-secondary rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-xs transition-all group cursor-pointer"
              >
                <Icon className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-bold text-on-surface">{item.shortName}</span>
                <span className="font-mono text-[9px] text-status-success">{item.subLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Security Credential Ribbon */}
        <div className="bg-surface-container-low rounded-2xl border border-surface-border p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${badge.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">{badge.title}</div>
                  <div className="font-mono text-[10px] text-text-muted">{badge.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
