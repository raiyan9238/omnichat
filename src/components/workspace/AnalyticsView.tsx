import { useState } from 'react';
import {
  ArrowUpRight,
  Download,
  TrendingUp,
} from 'lucide-react';
import { ToastType } from '../../types/omnibook';
import { WorkspaceTenant } from '../../types/workspace';
import {
  DualBarTrendChart,
  ProgressBreakdown,
  SparkAreaTrendChart,
} from './Charts';

type PeriodKey = 'weekly' | 'monthly' | 'yearly';

interface AnalyticsViewProps {
  workspace: WorkspaceTenant;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function AnalyticsView({ workspace, onShowToast }: AnalyticsViewProps) {
  const [period, setPeriod] = useState<PeriodKey>('monthly');
  const [channelScope, setChannelScope] = useState('All Channels');

  const factor = period === 'weekly' ? 1 : period === 'monthly' ? 4.2 : 48;
  const totalBaseCalls = workspace.agents.reduce((s, a) => s + a.callsHandled, 0);
  const callsMetric = Math.round((totalBaseCalls / 3) * factor);
  const bookingsMetric = Math.round(callsMetric * 0.34);
  const revenueMetric = bookingsMetric * 145;
  const resolutionRate =
    workspace.agents.length > 0
      ? (
          workspace.agents.reduce((s, a) => s + a.aiResolutionRate, 0) /
          workspace.agents.length
        ).toFixed(1)
      : '91.0';

  const commSeries =
    period === 'weekly'
      ? [
          { label: 'Mon', primary: 68, secondary: 5 },
          { label: 'Tue', primary: 84, secondary: 4 },
          { label: 'Wed', primary: 92, secondary: 6 },
          { label: 'Thu', primary: 88, secondary: 5 },
          { label: 'Fri', primary: 95, secondary: 7 },
          { label: 'Sat', primary: 64, secondary: 4 },
          { label: 'Sun', primary: 51, secondary: 3 },
        ]
      : period === 'monthly'
      ? [
          { label: 'Wk 1', primary: 420, secondary: 28 },
          { label: 'Wk 2', primary: 465, secondary: 24 },
          { label: 'Wk 3', primary: 510, secondary: 22 },
          { label: 'Wk 4', primary: 548, secondary: 19 },
        ]
      : [
          { label: 'Q1', primary: 4120, secondary: 310 },
          { label: 'Q2', primary: 4890, secondary: 280 },
          { label: 'Q3', primary: 5640, secondary: 245 },
          { label: 'Q4', primary: 6320, secondary: 210 },
        ];

  const growthSeries =
    period === 'weekly'
      ? [
          { label: 'Mon', value: 21 },
          { label: 'Tue', value: 29 },
          { label: 'Wed', value: 33 },
          { label: 'Thu', value: 31 },
          { label: 'Fri', value: 36 },
          { label: 'Sat', value: 24 },
          { label: 'Sun', value: 19 },
        ]
      : period === 'monthly'
      ? [
          { label: 'Wk 1', value: 142 },
          { label: 'Wk 2', value: 168 },
          { label: 'Wk 3', value: 194 },
          { label: 'Wk 4', value: 218 },
        ]
      : [
          { label: 'Q1', value: 1410 },
          { label: 'Q2', value: 1790 },
          { label: 'Q3', value: 2140 },
          { label: 'Q4', value: 2560 },
        ];

  function handleExportReport() {
    onShowToast(
      `Exported ${period} communication & business analytics report (CSV mock) for ${workspace.name}.`,
      'success'
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight text-balance">
            Communication &amp; Business Analytics
          </h1>
          <p className="text-xs text-text-muted mt-1 text-pretty">
            Deep performance breakdown across AI receptionist handling, channel conversion, and business growth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-surface-border bg-surface-card p-0.5" role="group" aria-label="Analytics period">
            {(['weekly', 'monthly', 'yearly'] as PeriodKey[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize cursor-pointer ${
                  period === p
                    ? 'bg-secondary text-white'
                    : 'text-text-muted hover:text-on-surface'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <select
            aria-label="Filter analytics by channel"
            value={channelScope}
            onChange={(e) => setChannelScope(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-card px-3 py-1.5 text-xs font-semibold text-on-surface"
          >
            <option>All Channels</option>
            <option>Voice Telephony</option>
            <option>WhatsApp</option>
            <option>Instagram &amp; Meta</option>
          </select>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-on-surface hover:bg-surface-container-low whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-secondary" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <span className="text-xs text-text-muted">Inbound Calls ({channelScope})</span>
          <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
            {callsMetric.toLocaleString()}
          </div>
          <div className="inline-flex items-center gap-1 font-mono text-[11px] text-status-success">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8% vs previous {period}</span>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <span className="text-xs text-text-muted">AI Resolution Rate</span>
          <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
            {resolutionRate}%
          </div>
          <div className="inline-flex items-center gap-1 font-mono text-[11px] text-status-success">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+3.1 pts automation gain</span>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <span className="text-xs text-text-muted">Booked Consultations</span>
          <div className="font-display text-2xl font-bold text-secondary tabular-nums">
            {bookingsMetric.toLocaleString()}
          </div>
          <div className="inline-flex items-center gap-1 font-mono text-[11px] text-status-success">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+19.2% lead conversion</span>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <span className="text-xs text-text-muted">Est. Revenue Captured</span>
          <div className="font-display text-2xl font-bold text-status-success tabular-nums">
            ${revenueMetric.toLocaleString()}
          </div>
          <div className="font-mono text-[11px] text-text-muted">
            WhatsApp &amp; Email reminders active
          </div>
        </div>
      </div>

      {/* Communication & Business Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-6 bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
          <div>
            <h2 className="font-display text-sm font-bold text-on-surface">
              Communication Analytics — Answered vs. Missed
            </h2>
            <p className="text-xs text-text-muted">
              Call handling reliability across {period} intervals
            </p>
          </div>
          <DualBarTrendChart
            data={commSeries}
            primaryLabel="AI Answered"
            secondaryLabel="Missed / Dropped"
          />
        </div>

        <div className="xl:col-span-6 bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
          <div>
            <h2 className="font-display text-sm font-bold text-on-surface">
              Business Analytics — Customer Growth &amp; Bookings
            </h2>
            <p className="text-xs text-text-muted">
              Confirmed appointments generated from inbound inquiries
            </p>
          </div>
          <SparkAreaTrendChart data={growthSeries} valueSuffix=" bookings" />
        </div>
      </div>

      {/* Breakdown + Agent Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <h2 className="font-display text-sm font-bold text-on-surface">
            Booking Source Attribution
          </h2>
          <ProgressBreakdown
            items={[
              { label: 'Voice Receptionist', value: 44, total: 100, colorClass: 'bg-secondary' },
              { label: 'WhatsApp Messaging', value: 31, total: 100, colorClass: 'bg-status-success' },
              { label: 'Instagram DM', value: 16, total: 100, colorClass: 'bg-channel-instagram' },
              { label: 'Web Chat & Messenger', value: 9, total: 100, colorClass: 'bg-channel-web' },
            ]}
          />
        </div>

        <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <h2 className="font-display text-sm font-bold text-on-surface">
            Agent Performance Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border text-text-muted font-mono text-[11px] uppercase">
                  <th scope="col" className="py-2.5 pr-3">AI Agent</th>
                  <th scope="col" className="py-2.5 px-3">Calls</th>
                  <th scope="col" className="py-2.5 px-3">AI Resolution</th>
                  <th scope="col" className="py-2.5 px-3">Avg Handle</th>
                  <th scope="col" className="py-2.5 pl-3 text-right">CSAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {workspace.agents.map((ag) => (
                  <tr key={ag.id}>
                    <td className="py-2.5 pr-3 font-semibold text-on-surface">
                      {ag.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">
                      {ag.callsHandled.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-status-success tabular-nums">
                      {ag.aiResolutionRate}%
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-text-muted">
                      {ag.avgHandleTime}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-mono font-bold text-secondary tabular-nums">
                      {ag.csat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
