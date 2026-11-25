import { CalendarCheck2, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';

interface RoiCalculatorProps {
  calls: number;
  ticket: number;
  onCallsChange: (val: number) => void;
  onTicketChange: (val: number) => void;
  onOpenReportModal: () => void;
}

export function RoiCalculator({
  calls,
  ticket,
  onCallsChange,
  onTicketChange,
  onOpenReportModal,
}: RoiCalculatorProps) {
  const rescuedBookings = Math.round(calls * 0.168);
  const monthlyRevenue = rescuedBookings * ticket;
  const hoursSaved = Math.round((calls * 4.5) / 60);

  return (
    <section
      id="roi-calculator"
      className="scroll-mt-16 w-full py-16 lg:py-20 bg-surface-container-lowest border-b border-surface-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-10">
          <div className="font-mono text-xs uppercase text-secondary font-bold tracking-wider mb-2">
            Financial Impact Estimator
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Calculate Your Missed Call Recovery
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            Practices miss up to 28% of incoming booking requests during peak rushes and after-hours. Adjust the sliders below to see your reclaimed revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Sliders */}
          <div className="lg:col-span-6 bg-surface-card rounded-2xl border border-surface-border p-6 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 gap-2">
                <label htmlFor="calls-slider" className="text-xs sm:text-sm font-semibold text-on-surface">
                  Estimated Inbound Calls &amp; Inquiries / Month
                </label>
                <span className="font-mono font-bold text-secondary text-sm bg-surface-container-low px-2.5 py-1 rounded tabular-nums shrink-0">
                  {calls.toLocaleString()} calls
                </span>
              </div>
              <input
                id="calls-slider"
                type="range"
                min={100}
                max={3000}
                step={50}
                value={calls}
                onChange={(e) => onCallsChange(Number(e.target.value))}
                className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between font-mono text-[10px] text-text-muted mt-1.5 tabular-nums">
                <span>100</span>
                <span>1,500</span>
                <span>3,000+</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 gap-2">
                <label htmlFor="ticket-slider" className="text-xs sm:text-sm font-semibold text-on-surface">
                  Average Booking / Ticket Value ($)
                </label>
                <span className="font-mono font-bold text-secondary text-sm bg-surface-container-low px-2.5 py-1 rounded tabular-nums shrink-0">
                  ${ticket.toLocaleString()}
                </span>
              </div>
              <input
                id="ticket-slider"
                type="range"
                min={30}
                max={1000}
                step={10}
                value={ticket}
                onChange={(e) => onTicketChange(Number(e.target.value))}
                className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between font-mono text-[10px] text-text-muted mt-1.5 tabular-nums">
                <span>$30</span>
                <span>$500</span>
                <span>$1,000</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-surface-container-low text-text-muted text-xs flex items-center gap-2">
              <CheckCircle2 className="w-[18px] h-[18px] text-secondary shrink-0" />
              <span>
                Based on verified 16.8% after-hours recovery rate benchmarked across 1,200 practices.
              </span>
            </div>
          </div>

          {/* Dynamic Output Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs uppercase text-text-muted font-semibold">
                  Rescued Bookings
                </span>
                <CalendarCheck2 className="w-5 h-5 text-channel-web" />
              </div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight tabular-nums">
                +{rescuedBookings}
              </div>
              <div className="mt-2 font-mono text-xs text-status-success font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +16.8% volume lift
              </div>
            </div>

            <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs uppercase text-text-muted font-semibold">
                  Monthly Revenue Lift
                </span>
                <DollarSign className="w-5 h-5 text-status-success" />
              </div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-status-success tracking-tight tabular-nums">
                +${monthlyRevenue.toLocaleString()}
              </div>
              <div className="mt-2 font-mono text-xs text-text-muted">recaptured bookings / mo</div>
            </div>

            <div className="sm:col-span-2 bg-primary text-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
                  Staff Capacity Reclaimed
                </span>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tabular-nums">
                  {hoursSaved} Front-Desk Hours / Week
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Zero staff overtime to field simple availability checks.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenReportModal}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent-hover transition-colors text-xs sm:text-sm shrink-0 whitespace-nowrap cursor-pointer"
              >
                Claim Your ROI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
