import {
  BellRing,
  Building2,
  CloudCog,
  Headset,
  LockKeyhole,
  MailCheck,
  PhoneForwarded,
  SlidersHorizontal,
} from 'lucide-react';

const PILLARS = [
  {
    icon: CloudCog,
    iconBoxClass: 'bg-blue-50 text-secondary',
    title: 'Source-of-Truth Sync',
    desc: 'Direct 2-way read/write with Google Calendar, Mindbody, Jane, and Acuity. Book consultations via WhatsApp, Instagram, or Web without shadow calendars.',
    FooterIcon: LockKeyhole,
    footerText: 'Sub-second atomic lock',
    footerClass: 'text-channel-web',
  },
  {
    icon: BellRing,
    iconBoxClass: 'bg-emerald-50 text-status-success',
    title: 'WhatsApp & Email Reminders',
    desc: 'Every confirmed meeting automatically sends a WhatsApp message reminder and an email confirmation with calendar invite and reschedule links.',
    FooterIcon: MailCheck,
    footerText: 'Dual-channel auto-reminders',
    footerClass: 'text-status-success',
  },
  {
    icon: PhoneForwarded,
    iconBoxClass: 'bg-red-50 text-status-danger',
    title: 'Frictionless Handoff',
    desc: 'Instant warm transfer to front desk staff with complete chat transcript, WhatsApp/phone number, and booking intent when edge cases arise.',
    FooterIcon: Headset,
    footerText: 'Zero-loss escalation',
    footerClass: 'text-status-danger',
  },
  {
    icon: Building2,
    iconBoxClass: 'bg-purple-50 text-channel-voice',
    title: 'Multi-Location & Buffers',
    desc: 'Configure consultation types, automated turnover buffers, provider availability, intake questions, and cancellation rules per branch.',
    FooterIcon: SlidersHorizontal,
    footerText: 'Branch-specific logic',
    footerClass: 'text-channel-voice',
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-16 w-full py-16 lg:py-20 bg-surface border-b border-surface-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="font-mono text-xs uppercase text-secondary font-bold tracking-wider mb-2">
              Consultation &amp; Reminder Engine
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
              Built for Real Practice Workflows
            </h2>
          </div>
          <p className="text-sm text-text-muted max-w-md">
            From first WhatsApp or Instagram inquiry to confirmed calendar meeting and automated WhatsApp + email reminders, every step runs autonomously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const FooterIcon = pillar.FooterIcon;
            return (
              <div
                key={pillar.title}
                className="bg-surface-card rounded-2xl border border-surface-border p-5 flex flex-col shadow-xs"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${pillar.iconBoxClass} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-bold text-on-surface mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-4 flex-1 leading-relaxed">
                  {pillar.desc}
                </p>
                <div className={`font-mono text-[11px] font-bold flex items-center gap-1.5 ${pillar.footerClass}`}>
                  <FooterIcon className="w-3.5 h-3.5" />
                  <span>{pillar.footerText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
