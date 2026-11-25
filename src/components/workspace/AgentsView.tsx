import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  BellRing,
  Bot,
  Check,
  Clock,
  Pause,
  Play,
  Plus,
  PowerOff,
  Save,
  Sparkles,
  X,
} from 'lucide-react';
import { ToastType } from '../../types/omnibook';
import {
  AgentStatus,
  AIAgent,
  WorkspaceTenant,
} from '../../types/workspace';

interface AgentsViewProps {
  workspace: WorkspaceTenant;
  onUpdateWorkspace: (updater: (prev: WorkspaceTenant) => WorkspaceTenant) => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function AgentsView({
  workspace,
  onUpdateWorkspace,
  onShowToast,
}: AgentsViewProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | AgentStatus>('All');
  const [createOpen, setCreateOpen] = useState(false);

  // Create form state
  const [newName, setNewName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('Booking & Inquiry Concierge');
  const [newLanguage, setNewLanguage] = useState('English (US)');
  const [newVoiceModel, setNewVoiceModel] = useState('Neural Clarity v3 (Warm)');
  const [newGreeting, setNewGreeting] = useState(
    'Hello! Thank you for reaching us. I can help check availability, book a consultation, or send a reminder.'
  );

  // Selected agent profile editing state
  const selectedAgent =
    workspace.agents.find((a) => a.id === selectedAgentId) ?? null;

  const [editDraft, setEditDraft] = useState<AIAgent | null>(null);

  function openAgentProfile(agent: AIAgent) {
    setSelectedAgentId(agent.id);
    setEditDraft({ ...agent });
  }

  function handleStatusChange(agentId: string, nextStatus: AgentStatus) {
    onUpdateWorkspace((prev) => ({
      ...prev,
      agents: prev.agents.map((a) =>
        a.id === agentId
          ? {
              ...a,
              status: nextStatus,
              activityHistory: [
                {
                  id: `ah-${Date.now()}`,
                  timestamp: 'Just now',
                  action: `Status → ${nextStatus}`,
                  detail: `Agent status updated to ${nextStatus} by workspace operator.`,
                },
                ...a.activityHistory,
              ],
            }
          : a
      ),
    }));
    if (editDraft && editDraft.id === agentId) {
      setEditDraft({ ...editDraft, status: nextStatus });
    }
    onShowToast(`Agent status updated to ${nextStatus}.`, 'info');
  }

  function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!editDraft) return;
    onUpdateWorkspace((prev) => ({
      ...prev,
      agents: prev.agents.map((a) =>
        a.id === editDraft.id
          ? {
              ...editDraft,
              activityHistory: [
                {
                  id: `ah-${Date.now()}`,
                  timestamp: 'Just now',
                  action: 'Profile Saved',
                  detail: `Updated greeting script, working hours (${editDraft.workingHours}), and escalation rules.`,
                },
                ...a.activityHistory,
              ],
            }
          : a
      ),
    }));
    onShowToast(`Saved configuration for ${editDraft.name}.`, 'success');
  }

  function handleCreateAgent(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const primaryNumber = workspace.phoneNumbers[0]?.number ?? 'Unassigned';
    const created: AIAgent = {
      id: `ag-${Date.now()}`,
      name: newName.trim(),
      roleTitle: newRoleTitle.trim() || 'AI Receptionist',
      status: 'Active',
      assignedNumber: primaryNumber,
      channels: ['Voice', 'WhatsApp', 'Web'],
      callsHandled: 0,
      aiResolutionRate: 92.0,
      avgHandleTime: '0m 00s',
      csat: 5.0,
      voiceModel: newVoiceModel,
      language: newLanguage,
      greetingScript: newGreeting.trim(),
      workingHours: '24/7 Autonomous Coverage',
      escalationThreshold: 'Confidence < 80% or VIP Request',
      autoWhatsAppReminder: true,
      autoEmailReminder: true,
      activityHistory: [
        {
          id: `ah-${Date.now()}`,
          timestamp: 'Just now',
          action: 'Agent Provisioned',
          detail: `Created in ${workspace.name} and linked to ${primaryNumber}.`,
        },
      ],
    };

    onUpdateWorkspace((prev) => ({
      ...prev,
      agents: [created, ...prev.agents],
    }));
    setCreateOpen(false);
    setNewName('');
    onShowToast(`${created.name} created and activated.`, 'success');
  }

  // Detailed Agent Profile Page
  if (selectedAgent && editDraft) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedAgentId(null);
              setEditDraft(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-on-surface cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AI Agents</span>
          </button>

          <div className="flex items-center gap-2">
            {(['Active', 'Paused', 'Inactive'] as AgentStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(selectedAgent.id, st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedAgent.status === st
                    ? st === 'Active'
                      ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text border-channel-whatsapp/30'
                      : st === 'Paused'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                    : 'bg-surface-card text-text-muted border-surface-border hover:bg-surface-container-low'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Summary Metrics */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-on-surface">
                {selectedAgent.name}
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                {selectedAgent.roleTitle} · Assigned Line:{' '}
                <span className="font-mono font-semibold text-on-surface">
                  {selectedAgent.assignedNumber}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Calls Handled</div>
              <div className="text-sm font-bold text-on-surface">
                {selectedAgent.callsHandled.toLocaleString()}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">AI Resolution</div>
              <div className="text-sm font-bold text-status-success">
                {selectedAgent.aiResolutionRate}%
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Avg Duration</div>
              <div className="text-sm font-bold text-on-surface">
                {selectedAgent.avgHandleTime}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">CSAT Score</div>
              <div className="text-sm font-bold text-secondary">
                {selectedAgent.csat} / 5.0
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Editable Agent Settings */}
          <form
            onSubmit={handleSaveProfile}
            className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="font-display text-sm font-bold text-on-surface">
                Agent Configuration &amp; Behavior
              </h2>
              <span className="font-mono text-[10px] text-text-muted">
                Tenant: {workspace.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Agent Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  required
                  value={editDraft.roleTitle}
                  onChange={(e) => setEditDraft({ ...editDraft, roleTitle: e.target.value })}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Voice Profile
                </label>
                <select
                  value={editDraft.voiceModel}
                  onChange={(e) => setEditDraft({ ...editDraft, voiceModel: e.target.value })}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                >
                  <option>Neural Clarity v3 (Warm)</option>
                  <option>Neural Studio (Calm)</option>
                  <option>Conversational Crisp</option>
                  <option>Neural British Studio</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Primary Language
                </label>
                <input
                  type="text"
                  value={editDraft.language}
                  onChange={(e) => setEditDraft({ ...editDraft, language: e.target.value })}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Operating Schedule
                </label>
                <input
                  type="text"
                  value={editDraft.workingHours}
                  onChange={(e) => setEditDraft({ ...editDraft, workingHours: e.target.value })}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Escalation Rule
                </label>
                <input
                  type="text"
                  value={editDraft.escalationThreshold}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, escalationThreshold: e.target.value })
                  }
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-on-surface mb-1">
                Receptionist Greeting Script
              </label>
              <textarea
                rows={3}
                value={editDraft.greetingScript}
                onChange={(e) =>
                  setEditDraft({ ...editDraft, greetingScript: e.target.value })
                }
                className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                <BellRing className="w-3.5 h-3.5 text-channel-whatsapp" />
                <span>Automated Booking Reminders</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editDraft.autoWhatsAppReminder}
                    onChange={(e) =>
                      setEditDraft({
                        ...editDraft,
                        autoWhatsAppReminder: e.target.checked,
                      })
                    }
                    className="rounded border-surface-border text-secondary"
                  />
                  <span>Dispatch WhatsApp reminder upon booking</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editDraft.autoEmailReminder}
                    onChange={(e) =>
                      setEditDraft({
                        ...editDraft,
                        autoEmailReminder: e.target.checked,
                      })
                    }
                    className="rounded border-surface-border text-secondary"
                  />
                  <span>Dispatch Email calendar invite</span>
                </label>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Agent Profile</span>
              </button>
            </div>
          </form>

          {/* Activity History */}
          <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <h2 className="font-display text-sm font-bold text-on-surface border-b border-surface-border pb-3">
              Agent Activity History
            </h2>

            {selectedAgent.activityHistory.length === 0 ? (
              <p className="text-xs text-text-muted py-6 text-center">
                No recent configuration or call events logged yet.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedAgent.activityHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-surface border border-surface-border space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-on-surface">
                        {item.action}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredAgents = workspace.agents.filter(
    (a) => statusFilter === 'All' || a.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            AI Receptionist Agents
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Configure autonomous voice and omnichannel booking agents for {workspace.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Agent</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(['All', 'Active', 'Paused', 'Inactive'] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              statusFilter === status
                ? 'bg-secondary text-white border-secondary'
                : 'bg-surface-card text-text-muted border-surface-border hover:text-on-surface'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Agent Cards Grid */}
      {filteredAgents.length === 0 ? (
        <div className="bg-surface-card border border-surface-border rounded-xl p-10 text-center space-y-2">
          <Bot className="w-8 h-8 text-text-muted mx-auto" />
          <p className="text-sm font-semibold text-on-surface">No agents match this filter</p>
          <p className="text-xs text-text-muted">
            Switch status filters or create a new AI receptionist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display text-sm font-bold text-on-surface truncate">
                        {agent.name}
                      </h2>
                      <p className="text-[11px] text-text-muted truncate">
                        {agent.roleTitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold shrink-0 ${
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

                <div className="p-2.5 rounded-lg bg-surface border border-surface-border flex items-center justify-between text-xs">
                  <span className="text-text-muted">Assigned Number</span>
                  <span className="font-mono font-semibold text-on-surface tabular-nums">
                    {agent.assignedNumber}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono tabular-nums">
                  <div className="p-2 rounded-lg bg-surface border border-surface-border">
                    <div className="text-[10px] text-text-muted">Calls</div>
                    <div className="text-xs font-bold text-on-surface">
                      {agent.callsHandled.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface border border-surface-border">
                    <div className="text-[10px] text-text-muted">AI Rate</div>
                    <div className="text-xs font-bold text-status-success">
                      {agent.aiResolutionRate}%
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface border border-surface-border">
                    <div className="text-[10px] text-text-muted">CSAT</div>
                    <div className="text-xs font-bold text-secondary">
                      {agent.csat}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {agent.channels.map((ch) => (
                    <span
                      key={ch}
                      className="px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface font-mono text-[10px]"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {agent.status !== 'Active' ? (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(agent.id, 'Active')}
                      title="Activate agent"
                      className="p-1.5 rounded-lg border border-surface-border text-status-success hover:bg-badge-whatsapp-bg cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(agent.id, 'Paused')}
                      title="Pause agent"
                      className="p-1.5 rounded-lg border border-surface-border text-status-warning hover:bg-amber-50 cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {agent.status !== 'Inactive' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(agent.id, 'Inactive')}
                      title="Deactivate agent"
                      className="p-1.5 rounded-lg border border-surface-border text-text-muted hover:bg-slate-100 cursor-pointer"
                    >
                      <PowerOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openAgentProfile(agent)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-surface-container-high text-xs font-semibold transition-colors cursor-pointer"
                >
                  Open Profile &amp; Settings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create AI Agent Modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <h3 className="font-display text-base font-bold text-on-surface">
                  Create AI Receptionist Agent
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="text-text-muted hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Chloe — Insurance & Intake Desk"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Voice Model
                </label>
                <select
                  value={newVoiceModel}
                  onChange={(e) => setNewVoiceModel(e.target.value)}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                >
                  <option>Neural Clarity v3 (Warm)</option>
                  <option>Neural Studio (Calm)</option>
                  <option>Conversational Crisp</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Initial Greeting Script
                </label>
                <textarea
                  rows={3}
                  value={newGreeting}
                  onChange={(e) => setNewGreeting(e.target.value)}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Provision Agent</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
