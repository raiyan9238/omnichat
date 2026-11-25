import { FormEvent, useState } from 'react';
import {
  CheckCircle2,
  Globe,
  History,
  Loader2,
  PhoneForwarded,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { ToastType } from '../../types/omnibook';
import {
  PhoneNumberRecord,
  WorkspaceTenant,
} from '../../types/workspace';

interface PhoneNumbersViewProps {
  workspace: WorkspaceTenant;
  onUpdateWorkspace: (updater: (prev: WorkspaceTenant) => WorkspaceTenant) => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function PhoneNumbersView({
  workspace,
  onUpdateWorkspace,
  onShowToast,
}: PhoneNumbersViewProps) {
  const [requestOpen, setRequestOpen] = useState(false);
  const [country, setCountry] = useState('United States');
  const [region, setRegion] = useState('New York, NY (212)');
  const [numberType, setNumberType] = useState<'Local' | 'Toll-Free'>('Local');
  const [assignAgentId, setAssignAgentId] = useState(workspace.agents[0]?.id ?? '');
  const [provisioning, setProvisioning] = useState(false);
  const [provisionedNumber, setProvisionedNumber] = useState<string | null>(null);

  const primaryNumber =
    workspace.phoneNumbers.find((p) => p.isPrimary) ?? workspace.phoneNumbers[0];

  function handleReassignAgent(numberId: string, nextAgentId: string) {
    const agent = workspace.agents.find((a) => a.id === nextAgentId);
    const targetNumber = workspace.phoneNumbers.find((p) => p.id === numberId);
    if (!targetNumber) return;

    onUpdateWorkspace((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((p) =>
        p.id === numberId
          ? {
              ...p,
              assignedAgentId: agent ? agent.id : null,
              assignedAgentName: agent ? agent.name : 'Unassigned',
            }
          : p
      ),
      agents: prev.agents.map((a) =>
        a.id === nextAgentId ? { ...a, assignedNumber: targetNumber.number } : a
      ),
      numberHistory: [
        {
          id: `nh-${Date.now()}`,
          number: targetNumber.number,
          event: 'Routing Reassigned',
          agentName: agent ? agent.name : 'Unassigned',
          timestamp: 'Just now',
        },
        ...prev.numberHistory,
      ],
    }));

    onShowToast(
      `${targetNumber.number} now routes to ${agent ? agent.name : 'Unassigned'}.`,
      'success'
    );
  }

  function handleToggleStatus(numberId: string) {
    onUpdateWorkspace((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((p) =>
        p.id === numberId
          ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' }
          : p
      ),
    }));
    onShowToast('Phone line status updated.', 'info');
  }

  function handleRequestNumber(e: FormEvent) {
    e.preventDefault();
    setProvisioning(true);
    setProvisionedNumber(null);

    const randomLast4 = Math.floor(1000 + Math.random() * 9000);
    const areaCode =
      numberType === 'Toll-Free'
        ? '888'
        : country === 'United Kingdom'
        ? '20'
        : region.includes('415')
        ? '415'
        : '212';
    const formatted =
      country === 'United Kingdom'
        ? `+44 ${areaCode} 7946 ${randomLast4}`
        : `+1 (${areaCode}) 555-${randomLast4}`;

    const selectedAgent = workspace.agents.find((a) => a.id === assignAgentId);

    window.setTimeout(() => {
      const newRecord: PhoneNumberRecord = {
        id: `pn-${Date.now()}`,
        number: formatted,
        country,
        region,
        status: 'Active',
        assignedAgentId: selectedAgent ? selectedAgent.id : null,
        assignedAgentName: selectedAgent ? selectedAgent.name : 'Unassigned',
        type: numberType,
        monthlyVolume: 0,
        provisionedAt: 'Nov 25, 2026',
      };

      onUpdateWorkspace((prev) => ({
        ...prev,
        phoneNumbers: [...prev.phoneNumbers, newRecord],
        numberHistory: [
          {
            id: `nh-${Date.now()}`,
            number: formatted,
            event: `Provisioned Additional ${numberType} Line`,
            agentName: selectedAgent ? selectedAgent.name : 'Unassigned',
            timestamp: 'Just now',
          },
          ...prev.numberHistory,
        ],
      }));

      setProvisioning(false);
      setProvisionedNumber(formatted);
      onShowToast(`Provisioned ${formatted} in ${workspace.name}.`, 'success');
    }, 900);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            Phone Numbers &amp; Telephony
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Each workspace receives an automatically assigned AI receptionist line managed by Omnichat telephony infrastructure.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setProvisionedNumber(null);
            setProvisioning(false);
            setRequestOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request Additional Number</span>
        </button>
      </div>

      {/* Auto-assigned Primary Number Banner */}
      {primaryNumber && (
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-badge-web-bg text-badge-web-text flex items-center justify-center shrink-0">
              <PhoneForwarded className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Auto-Assigned Primary Business Line
                </span>
                <span className="px-2 py-0.5 rounded-full bg-badge-whatsapp-bg text-badge-whatsapp-text font-mono text-[10px] font-semibold">
                  {primaryNumber.status}
                </span>
              </div>
              <div className="font-mono text-xl font-bold text-on-surface mt-1 tabular-nums">
                {primaryNumber.number}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {primaryNumber.country} · {primaryNumber.region} · Routed to{' '}
                <span className="font-semibold text-on-surface">
                  {primaryNumber.assignedAgentName}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono tabular-nums text-xs">
            <div className="px-3.5 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">30d Volume</div>
              <div className="text-sm font-bold text-on-surface">
                {primaryNumber.monthlyVolume.toLocaleString()} calls
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Provisioned</div>
              <div className="text-sm font-bold text-on-surface">
                {primaryNumber.provisionedAt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Numbers Table */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-on-surface">
            Workspace Phone Lines ({workspace.phoneNumbers.length})
          </h2>
          <span className="font-mono text-[11px] text-text-muted">
            SIP + WhatsApp Voice Ready
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-surface text-text-muted font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Phone Number</th>
                <th className="py-3 px-4 font-semibold">Country / Region</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Assigned AI Agent</th>
                <th className="py-3 px-4 font-semibold">30d Calls</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {workspace.phoneNumbers.map((line) => (
                <tr key={line.id} className="hover:bg-surface/60">
                  <td className="py-3 px-4 font-mono font-semibold text-on-surface whitespace-nowrap tabular-nums">
                    {line.number}
                    {line.isPrimary && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-surface-container text-secondary text-[10px]">
                        Primary
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-text-main whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-text-muted" />
                      {line.country} · {line.region}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text-muted">
                    {line.type}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={line.assignedAgentId ?? ''}
                      onChange={(e) => handleReassignAgent(line.id, e.target.value)}
                      className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary"
                    >
                      <option value="">Unassigned</option>
                      {workspace.agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-on-surface">
                    {line.monthlyVolume.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                        line.status === 'Active'
                          ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {line.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(line.id)}
                      className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
                    >
                      {line.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment History */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-secondary" />
          <h2 className="font-display text-sm font-bold text-on-surface">
            Number Assignment &amp; Provisioning History
          </h2>
        </div>

        <div className="divide-y divide-surface-border">
          {workspace.numberHistory.map((item) => (
            <div
              key={item.id}
              className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-mono font-semibold text-on-surface">
                  {item.number}
                </span>{' '}
                <span className="text-text-muted">— {item.event}</span>{' '}
                <span className="font-semibold text-secondary">({item.agentName})</span>
              </div>
              <span className="font-mono text-[11px] text-text-muted">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Request Additional Number Modal */}
      {requestOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget && !provisioning) setRequestOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <h3 className="font-display text-base font-bold text-on-surface">
                  Request Additional Phone Number
                </h3>
              </div>
              <button
                type="button"
                disabled={provisioning}
                onClick={() => setRequestOpen(false)}
                className="text-text-muted hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {provisioning ? (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto" />
                <div className="text-sm font-semibold text-on-surface">
                  Provisioning dedicated telephony line...
                </div>
                <p className="text-xs text-text-muted">
                  Configuring SIP routing and linking to your AI receptionist workspace.
                </p>
              </div>
            ) : provisionedNumber ? (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-badge-whatsapp-bg text-status-success mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="font-display text-base font-bold text-on-surface">
                  Number Provisioned &amp; Active
                </div>
                <div className="font-mono text-lg font-bold text-secondary tabular-nums">
                  {provisionedNumber}
                </div>
                <p className="text-xs text-text-muted">
                  Ready to accept inbound voice calls and trigger WhatsApp &amp; email appointment reminders.
                </p>
                <button
                  type="button"
                  onClick={() => setRequestOpen(false)}
                  className="w-full py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestNumber} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      const next = e.target.value;
                      setCountry(next);
                      setRegion(
                        next === 'United Kingdom'
                          ? 'London (020)'
                          : 'New York, NY (212)'
                      );
                    }}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">
                      Preferred Area / Region
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">
                      Number Type
                    </label>
                    <select
                      value={numberType}
                      onChange={(e) =>
                        setNumberType(e.target.value as 'Local' | 'Toll-Free')
                      }
                      className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                    >
                      <option value="Local">Local</option>
                      <option value="Toll-Free">Toll-Free</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Route Inbound Calls To
                  </label>
                  <select
                    value={assignAgentId}
                    onChange={(e) => setAssignAgentId(e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  >
                    {workspace.agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestOpen(false)}
                    className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                  >
                    Provision Number
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
