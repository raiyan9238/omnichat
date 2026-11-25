import { Bot } from 'lucide-react';

interface CtaSectionProps {
  onTriggerDemo: () => void;
  onOpenOnboarding: (title: string) => void;
}

export function CtaSection({ onTriggerDemo, onOpenOnboarding }: CtaSectionProps) {
  return (
    <section className="w-full py-14 lg:py-16 bg-primary text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 font-mono text-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
            <span>5-MINUTE PLUG-AND-PLAY ONBOARDING</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold max-w-xl">
            Never Lose Another Appointment to a Busy Signal.
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-lg">
            Join 1,200+ practices capturing 24/7 high-value bookings across Voice, Meta, Instagram, and Web today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onTriggerDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-white font-semibold hover:bg-accent-hover transition-all shadow-lg shadow-secondary/30 whitespace-nowrap cursor-pointer"
          >
            <Bot className="w-[19px] h-[19px]" />
            <span>Deploy Demo In 60 Seconds</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenOnboarding('Technical Walkthrough Request')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-semibold text-sm whitespace-nowrap cursor-pointer"
          >
            Schedule Tech Walkthrough
          </button>
        </div>
      </div>
    </section>
  );
}
