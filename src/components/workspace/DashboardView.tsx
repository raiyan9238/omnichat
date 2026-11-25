import { useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Clock,
  KeyRound,
  Megaphone,
  MessageSquare,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  Plus,
  Smile,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ROLE_PERMISSIONS } from '../../data/workspaceData';
import {
  WorkspaceRole,
  WorkspaceSection,
  WorkspaceTenant,
} from '../../types/workspace';
import {
  DualBarTrendChart,
  HourlyDistributionChart,
  SparkAreaTrendChart,
} from './Charts';

type DateRangeKey = '7d' | '30d' | '90d';

interface DashboardViewProps {
  workspace: WorkspaceTenant;
  activeRole: WorkspaceRole;
  onNavigate: (section: WorkspaceSection) => void;
  onInspectCall: (callId: string) => void;
  onInspectCustomer: (customerId: string) => void;
}

const RANGE_MULTIPLIER: Record<DateRangeKey, number> = {
  '7d': 1,
  '30d': 4.1,
  '90d': 12.2,
};

export function DashboardView({
  workspace,
  activeRole,
  onNavigate,
  onInspectCall,
  onInspectCustomer,
}: DashboardViewProps) {
  const [dateRange, setDateRange] = useState<DateRangeKey>('30d');
  const [activityGranularity, setActivityGranularity] = useState<'daily' | 'weekly'>('daily');

  const allowed = ROLE_PERMISSIONS[activeRole];
  const mult = RANGE_MULTIPLIER[dateRange];

  const baseCalls = workspace.agents.reduce((sum, a) => sum + a.callsHandled, 0);
  const totalCalls = Math.round((baseCalls / 4) * mult);
  const missedCalls = Math.max(4, Math.round(totalCalls * 0.068));
  const answeredCalls = totalCalls - missedCalls;
  const totalConversations = Math.round(totalCalls * 1.42);
  const avgResolution =
    workspace.agents.length > 0
      ? (
          workspace.agents.reduce((sum, a) => sum + a.aiResolutionRate, 0) /
          workspace.agents.length
        ).toFixed(1)
      : '90.0';
  const avgCsat =
    workspace.agents.length > 0
      ? (
          workspace.agents.reduce((sum, a) => sum + a.csat, 0) /
          workspace.agents.length
        ).toFixed(1)
      : '4.8';
  const conversionRate = workspace.id === 'ws-vertex' ? '34.8%' : workspace.id === 'ws-solace' ? '29.4%' : '32.6%';
  const avgDuration = workspace.agents[0]?.avgHandleTime ?? '2m 18s';

  const kpis = [
    {
      label: 'Total Calls',
      value: totalCalls.toLocaleString(),
      delta: '+12.4%',
      icon: PhoneCall,
      tone: 'text-secondary',
    },
    {
      label: 'Answered Calls',
      value: answeredCalls.toLocaleString(),
      delta: `${Math.round((answeredCalls / Math.max(1, totalCalls)) * 100)}% answer rate`,
      icon: PhoneIncoming,
      tone: 'text-status-success',
    },
    {
      label: 'Missed Calls',
      value: missedCalls.toLocaleString(),
      delta: '-18.2% vs prior',
      icon: PhoneMissed,
      tone: 'text-status-warning',
    },
    {
      label: 'Total Conversations',
      value: totalConversations.toLocaleString(),
      delta: '+16.1%',
      icon: MessageSquare,
      tone: 'text-secondary',
    },
    {
      label: 'AI Handling Rate',
      value: `${avgResolution}%`,
      delta: 'Autonomous resolution',
      icon: Sparkles,
      tone: 'text-status-success',
    },
    {
      label: 'Avg Call Duration',
      value: avgDuration,
      delta: '-14s handle speed',
      icon: Clock,
      tone: 'text-on-surface',
    },
    {
      label: 'Customer Satisfaction',
      value: `${avgCsat} / 5`,
      delta: `${workspace.feedback.length} verified reviews`,
      icon: Smile,
      tone: 'text-status-success',
    },
    {
      label: 'Conversion Rate',
      value: conversionRate,
      delta: '+4.2 pts booked',
      icon: TrendingUp,
      tone: 'text-secondary',
    },
  ];

  const volumeData =
    activityGranularity === 'daily'
      ? [
          { label: 'Mon', primary: Math.round(totalCalls * 0.13), secondary: Math.round(missedCalls * 0.14) },
          { label: 'Tue', primary: Math.round(totalCalls * 0.16), secondary: Math.round(missedCalls * 0.12) },
          { label: 'Wed', primary: Math.round(totalCalls * 0.18), secondary: Math.round(missedCalls * 0.16) },
          { label: 'Thu', primary: Math.round(totalCalls * 0.17), secondary: Math.round(missedCalls * 0.15) },
          { label: 'Fri', primary: Math.round(totalCalls * 0.15), secondary: Math.round(missedCalls * 0.18) },
          { label: 'Sat', primary: Math.round(totalCalls * 0.11), secondary: Math.round(missedCalls * 0.13) },
          { label: 'Sun', primary: Math.round(totalCalls * 0.1), secondary: Math.round(missedCalls * 0.12) },
        ]
      : [
          { label: 'Wk 1', primary: Math.round(totalCalls * 0.21), secondary: Math.round(missedCalls * 0.28) },
          { label: 'Wk 2', primary: Math.round(totalCalls * 0.24), secondary: Math.round(missedCalls * 0.25) },
          { label: 'Wk 3', primary: Math.round(totalCalls * 0.26), secondary: Math.round(missedCalls * 0.24) },
          { label: 'Wk 4', primary: Math.round(totalCalls * 0.29), secondary: Math.round(missedCalls * 0.23) },
        ];

  const conversationTrend = [
    { label: 'Mon', value: Math.round(totalConversations * 0.12) },
    { label: 'Tue', value: Math.round(totalConversations * 0.15) },
    { label: 'Wed', value: Math.round(totalConversations * 0.17) },
    { label: 'Thu', value: Math.round(totalConversations * 0.16) },
    { label: 'Fri', value: Math.round(totalConversations * 0.18) },
    { label: 'Sat', value: Math.round(totalConversations * 0.11) },
    { label: 'Sun', value: Math.round(totalConversations * 0.11) },
  ];

  const peakHours = [
    { hour: '8a', calls: 18 },
    { hour: '9a', calls: 34 },
    { hour: '10a', calls: 52 },
    { hour: '11a', calls: 61 },
    { hour: '12p', calls: 44 },
    { hour: '1p', calls: 38 },
    { hour: '2p', calls: 56 },
    { hour: '3p', calls: 49 },
    { hour: '4p', calls: 42 },
    { hour: '5p', calls: 31 },
    { hour: '6p', calls: 24 },
    { hour: '7p', calls: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
              {workspace.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-badge-web-bg text-badge-web-text border border-channel-web/20">
              {workspace.phoneNumbers[0]?.number ?? 'Unassigned'}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            {workspace.industry} · {workspace.agents.filter((a) => a.status === 'Active').length} active AI receptionists handling Voice, WhatsApp &amp; social channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-surface-border bg-surface-card p-0.5">
            {(['7d', '30d', '90d'] as DateRangeKey[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  dateRange === range
                    ? 'bg-secondary text-white'
                    : 'text-text-muted hover:text-on-surface'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {allowed.includes('agents') && (
            <button
              type="button"
              onClick={() => onNavigate('agents')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>AI Agents</span>
            </button>
          )}
          {allowed.includes('numbers') && (
            <button
              type="button"
              onClick={() => onNavigate('numbers')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PhoneForwarded className="w-3.5 h-3.5 text-secondary" />
              <span>Numbers</span>
            </button>
          )}
          {allowed.includes('marketing') && (
            <button
              type="button"
              onClick={() => onNavigate('marketing')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5 text-secondary" />
              <span>Campaigns</span>
            </button>
          )}
          {allowed.includes('api-keys') && (
            <button
              type="button"
              onClick={() => onNavigate('api-keys')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-secondary" />
              <span>API Keys</span>
            </button>
          )}
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.tone}`} />
              </div>
              <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
                {kpi.value}
              </div>
              <div className="font-mono text-[11px] text-text-muted">{kpi.delta}</div>
            </div>
          );
        })}
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-sm font-bold text-on-surface">
                Call Volume &amp; Answered vs. Missed
              </h2>
              <p className="text-xs text-text-muted">
                {activityGranularity === 'daily' ? 'Daily activity breakdown' : 'Weekly activity rollup'} across provisioned numbers
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-surface-border bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setActivityGranularity('daily')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                  activityGranularity === 'daily'
                    ? 'bg-surface-card text-on-surface shadow-2xs'
                    : 'text-text-muted hover:text-on-surface'
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setActivityGranularity('weekly')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                  activityGranularity === 'weekly'
                    ? 'bg-surface-card text-on-surface shadow-2xs'
                    : 'text-text-muted hover:text-on-surface'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <DualBarTrendChart
            data={volumeData}
            primaryLabel="Answered Calls"
            secondaryLabel="Missed Calls"
          />
        </div>

        <div className="xl:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-bold text-on-surface">
                Omnichannel Conversation Trends
              </h2>
              <p className="text-xs text-text-muted">
                WhatsApp, Instagram, Messenger &amp; Web volume
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('conversations')}
              className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>Inbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <SparkAreaTrendChart data={conversationTrend} valueSuffix=" threads" />
        </div>
      </div>

      {/* Peak Calling Hours & Agent Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="font-display text-sm font-bold text-on-surface">
              Peak Calling Hours
            </h2>
            <p className="text-xs text-text-muted">
              Hourly inbound call distribution ({workspace.timezone})
            </p>
          </div>
          <HourlyDistributionChart data={peakHours} />
        </div>

        <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-bold text-on-surface">
                Active AI Receptionist Agents
              </h2>
              <p className="text-xs text-text-muted">
                Live resolution rate &amp; assigned phone lines
              </p>
            </div>
            {allowed.includes('agents') && (
              <button
                type="button"
                onClick={() => onNavigate('agents')}
                className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
              >
                Manage All
              </button>
            )}
          </div>

          <div className="divide-y divide-surface-border">
            {workspace.agents.map((agent) => (
              <div
                key={agent.id}
                className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-on-surface truncate">
                      {agent.name}
                    </div>
                    <div className="font-mono text-[11px] text-text-muted truncate">
                      {agent.assignedNumber} · {agent.channels.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] tabular-nums">
                  <span className="text-on-surface font-semibold">
                    {agent.aiResolutionRate}% AI
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      agent.status === 'Active'
                        ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                        : agent.status === 'Paused'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Recent Customer Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-on-surface">
              Recent Workspace Activity
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('call-logs')}
              className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
            >
              View Call Logs
            </button>
          </div>
          <div className="divide-y divide-surface-border">
            {workspace.callLogs.slice(0, 4).map((call) => (
              <button
                key={call.id}
                type="button"
                onClick={() => onInspectCall(call.id)}
                className="w-full text-left py-2.5 first:pt-0 last:pb-0 hover:bg-surface-container-low/50 rounded-lg px-2 -mx-2 transition-colors flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-on-surface truncate">
                    {call.callerName} · {call.outcome}
                  </div>
                  <div className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                    {call.summary}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-[10px] text-text-muted tabular-nums">
                    {call.durationLabel}
                  </div>
                  <div
                    className={`font-mono text-[10px] font-semibold ${
                      call.status === 'Answered'
                        ? 'text-status-success'
                        : call.status === 'Escalated'
                        ? 'text-secondary'
                        : 'text-status-danger'
                    }`}
                  >
                    {call.status}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-on-surface">
              Recent Customer Interactions
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('crm')}
              className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
            >
              Open CRM
            </button>
          </div>
          <div className="divide-y divide-surface-border">
            {workspace.customers.slice(0, 4).map((cust) => (
              <button
                key={cust.id}
                type="button"
                onClick={() => onInspectCustomer(cust.id)}
                className="w-full text-left py-2.5 first:pt-0 last:pb-0 hover:bg-surface-container-low/50 rounded-lg px-2 -mx-2 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface truncate">
                      {cust.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-surface-container-low text-secondary font-semibold">
                      {cust.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted truncate mt-0.5">
                    {cust.activities[0]?.summary ?? cust.companyOrSegment}
                  </div>
                </div>
                <div className="font-mono text-[10px] text-text-muted shrink-0 tabular-nums">
                  {cust.lastInteraction}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
