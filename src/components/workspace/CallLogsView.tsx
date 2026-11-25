import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  Bot,
  Clock,
  FileText,
  PhoneCall,
  Search,
  Sparkles,
  User,
} from 'lucide-react';
import {
  CallLogRecord,
  CallOutcome,
  CallStatus,
  WorkspaceTenant,
} from '../../types/workspace';

interface CallLogsViewProps {
  workspace: WorkspaceTenant;
  selectedCallId: string | null;
  onSelectCall: (callId: string | null) => void;
  onOpenCustomer: (customerId: string) => void;
}

export function CallLogsView({
  workspace,
  selectedCallId,
  onSelectCall,
  onOpenCustomer,
}: CallLogsViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CallStatus>('All');
  const [outcomeFilter, setOutcomeFilter] = useState<'All' | CallOutcome>('All');
  const [agentFilter, setAgentFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7d'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const selectedCall: CallLogRecord | null =
    workspace.callLogs.find((c) => c.id === selectedCallId) ?? null;

  const filteredCalls = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workspace.callLogs
      .filter((call) => {
        if (statusFilter !== 'All' && call.status !== statusFilter) return false;
        if (outcomeFilter !== 'All' && call.outcome !== outcomeFilter) return false;
        if (agentFilter !== 'All' && call.agentId !== agentFilter) return false;
        if (dateFilter === 'today' && !call.dateTime.includes('2026-11-25')) {
          return false;
        }
        if (
          q &&
          !call.callerName.toLowerCase().includes(q) &&
          !call.phoneNumber.toLowerCase().includes(q) &&
          !call.summary.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const delta =
          sortBy === 'date'
            ? a.timestampMs - b.timestampMs
            : a.durationSec - b.durationSec;
        return sortDir === 'desc' ? -delta : delta;
      });
  }, [agentFilter, dateFilter, outcomeFilter, search, sortBy, sortDir, statusFilter, workspace.callLogs]);

  const totalPages = Math.max(1, Math.ceil(filteredCalls.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedCalls = filteredCalls.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  function toggleSort(column: 'date' | 'duration') {
    if (sortBy === column) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  }

  // Call Details View
  if (selectedCall) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectCall(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-on-surface cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Call Logs</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCustomer(selectedCall.customerId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-secondary hover:bg-surface-container-low cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>View CRM Profile</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-on-surface">
                {selectedCall.callerName}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                  selectedCall.status === 'Answered'
                    ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                    : selectedCall.status === 'Escalated'
                    ? 'bg-blue-50 text-secondary'
                    : 'bg-red-50 text-status-danger'
                }`}
              >
                {selectedCall.status}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                  selectedCall.sentiment === 'Positive'
                    ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                    : selectedCall.sentiment === 'Neutral'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-red-50 text-status-danger'
                }`}
              >
                {selectedCall.sentiment} Sentiment
              </span>
            </div>
            <div className="font-mono text-xs text-text-muted tabular-nums">
              {selectedCall.phoneNumber} · {selectedCall.dateTime} · Outcome:{' '}
              <span className="font-semibold text-on-surface">{selectedCall.outcome}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs tabular-nums">
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>{selectedCall.durationLabel}</span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-secondary" />
              <span>{selectedCall.agentName}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* AI Summary & Transcript */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Call Summary</span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                {selectedCall.summary}
              </p>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-border pb-3">
                <FileText className="w-4 h-4 text-secondary" />
                <h2 className="font-display text-sm font-bold text-on-surface">
                  Call Transcript
                </h2>
              </div>

              <div className="space-y-3">
                {selectedCall.transcript.map((line) => (
                  <div
                    key={line.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      line.speaker === 'AI Agent'
                        ? 'bg-surface border-surface-border'
                        : 'bg-surface-container-low/60 border-secondary/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span
                        className={`font-bold ${
                          line.speaker === 'AI Agent'
                            ? 'text-secondary'
                            : 'text-on-surface'
                        }`}
                      >
                        {line.speaker}
                      </span>
                      <span className="text-text-muted tabular-nums">{line.time}</span>
                    </div>
                    <p className="text-on-surface leading-relaxed">{line.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interaction Timeline */}
          <div className="lg:col-span-4 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4 h-fit">
            <h2 className="font-display text-sm font-bold text-on-surface border-b border-surface-border pb-3">
              Interaction Timeline
            </h2>
            <div className="space-y-3">
              {selectedCall.timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <div>
                    <div className="font-mono text-[10px] text-text-muted tabular-nums">
                      {step.time}
                    </div>
                    <div className="text-on-surface font-medium">{step.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
          Call Logs &amp; Transcripts
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Inspect inbound AI receptionist calls, outcomes, recordings, and full transcripts for {workspace.name}.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="relative lg:col-span-2">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search caller name, phone, or summary..."
            className="w-full rounded-lg border border-surface-border bg-surface pl-8 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'All' | CallStatus);
            setPage(1);
          }}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
        >
          <option value="All">All Statuses</option>
          <option value="Answered">Answered</option>
          <option value="Escalated">Escalated</option>
          <option value="Missed">Missed</option>
        </select>

        <select
          value={outcomeFilter}
          onChange={(e) => {
            setOutcomeFilter(e.target.value as 'All' | CallOutcome);
            setPage(1);
          }}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
        >
          <option value="All">All Outcomes</option>
          <option value="Appointment Booked">Appointment Booked</option>
          <option value="Rescheduled">Rescheduled</option>
          <option value="Info Provided">Info Provided</option>
          <option value="Transferred">Transferred</option>
          <option value="Voicemail">Voicemail</option>
        </select>

        <div className="flex items-center gap-2">
          <select
            value={agentFilter}
            onChange={(e) => {
              setAgentFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-surface-border bg-surface px-2.5 py-2 text-xs text-on-surface"
          >
            <option value="All">All Agents</option>
            {workspace.agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name.split('—')[0].trim()}
              </option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value as 'all' | 'today' | '7d');
              setPage(1);
            }}
            className="rounded-lg border border-surface-border bg-surface px-2.5 py-2 text-xs text-on-surface"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7d">Last 7d</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        {paginatedCalls.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <PhoneCall className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm font-semibold text-on-surface">
              No call logs match your filters
            </p>
            <p className="text-xs text-text-muted">
              Try clearing your search or switching status/outcome filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-surface text-text-muted font-mono text-[11px] uppercase">
                    <th className="py-3 px-4 font-semibold">Caller</th>
                    <th className="py-3 px-4 font-semibold">
                      <button
                        type="button"
                        onClick={() => toggleSort('date')}
                        className="inline-flex items-center gap-1 hover:text-on-surface cursor-pointer"
                      >
                        <span>Date &amp; Time</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-4 font-semibold">
                      <button
                        type="button"
                        onClick={() => toggleSort('duration')}
                        className="inline-flex items-center gap-1 hover:text-on-surface cursor-pointer"
                      >
                        <span>Duration</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">AI Agent</th>
                    <th className="py-3 px-4 font-semibold">Outcome</th>
                    <th className="py-3 px-4 font-semibold">Summary</th>
                    <th className="py-3 px-4 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {paginatedCalls.map((call) => (
                    <tr
                      key={call.id}
                      onClick={() => onSelectCall(call.id)}
                      className="hover:bg-surface-container-low/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-on-surface">{call.callerName}</div>
                        <div className="font-mono text-[11px] text-text-muted tabular-nums">
                          {call.phoneNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-text-main whitespace-nowrap tabular-nums">
                        {call.dateTime}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-on-surface whitespace-nowrap tabular-nums">
                        {call.durationLabel}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                            call.status === 'Answered'
                              ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                              : call.status === 'Escalated'
                              ? 'bg-blue-50 text-secondary'
                              : 'bg-red-50 text-status-danger'
                          }`}
                        >
                          {call.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-main whitespace-nowrap">
                        {call.agentName.split('—')[0].trim()}
                      </td>
                      <td className="py-3 px-4 font-medium text-on-surface whitespace-nowrap">
                        {call.outcome}
                      </td>
                      <td className="py-3 px-4 text-text-muted max-w-xs truncate">
                        {call.summary}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="font-semibold text-secondary">Inspect</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-surface-border flex items-center justify-between text-xs text-text-muted">
              <span className="font-mono tabular-nums">
                Showing {(safePage - 1) * pageSize + 1}–
                {Math.min(safePage * pageSize, filteredCalls.length)} of{' '}
                {filteredCalls.length} calls
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded border border-surface-border disabled:opacity-40 hover:bg-surface cursor-pointer"
                >
                  Prev
                </button>
                <span className="font-mono px-2 tabular-nums">
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded border border-surface-border disabled:opacity-40 hover:bg-surface cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
