import { FormEvent, useState } from 'react';
import {
  Check,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Monitor,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ToastType } from '../../types/omnibook';
import { ApiKeyItem, WorkspaceTenant } from '../../types/workspace';

interface AccountViewProps {
  workspace: WorkspaceTenant;
  onUpdateWorkspace: (updater: (prev: WorkspaceTenant) => WorkspaceTenant) => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function ApiKeysView({
  workspace,
  onUpdateWorkspace,
  onShowToast,
}: AccountViewProps) {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [keyLabel, setKeyLabel] = useState('');
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyItem | null>(null);

  const usagePct = Math.min(
    100,
    Math.round((workspace.apiUsageCount / Math.max(1, workspace.apiUsageLimit)) * 100)
  );

  function toggleReveal(id: string) {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleCopy(keyItem: ApiKeyItem) {
    const demoValue = `${keyItem.prefix}_demo_sample_token_only`;
    navigator.clipboard?.writeText(demoValue).catch(() => {});
    onShowToast(`Copied demo key (${keyItem.label}) to clipboard.`, 'success');
  }

  function handleGenerateKey(e: FormEvent) {
    e.preventDefault();
    if (!keyLabel.trim()) return;
    const suffix = Math.random().toString(36).slice(2, 6);
    const prefix = `omni_demo_${suffix}`;
    const newItem: ApiKeyItem = {
      id: `key-${Date.now()}`,
      label: `${keyLabel.trim()} (Demo)`,
      maskedKey: `${prefix}_••••••••••••${suffix}`,
      prefix,
      createdAt: 'Nov 25, 2026',
      lastUsed: 'Never',
      status: 'Active',
      requests30d: 0,
    };

    onUpdateWorkspace((prev) => ({
      ...prev,
      apiKeys: [newItem, ...prev.apiKeys],
    }));

    setCreateOpen(false);
    setKeyLabel('');
    onShowToast(`Demo API key "${newItem.label}" generated.`, 'success');
  }

  function handleConfirmRevoke() {
    if (!revokeTarget) return;
    onUpdateWorkspace((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((k) =>
        k.id === revokeTarget.id ? { ...k, status: 'Revoked' } : k
      ),
    }));
    onShowToast(`Revoked demo key "${revokeTarget.label}".`, 'info');
    setRevokeTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            API Keys &amp; Infrastructure Access
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Connect {workspace.name} to Omnichat’s hosted AI receptionist and telephony endpoints using workspace-scoped demo tokens.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Key</span>
        </button>
      </div>

      {/* API Status & Usage Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-2">
          <div className="text-xs text-text-muted">API Gateway Status</div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-status-success">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
            <span>Operational (99.98%)</span>
          </div>
          <div className="font-mono text-[11px] text-text-muted">
            Endpoint: api.omnichat.demo/v2
          </div>
        </div>

        <div className="md:col-span-2 bg-surface-card border border-surface-border rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-text-muted">
              Monthly API Request Quota ({workspace.planName})
            </span>
            <span className="font-mono font-bold text-on-surface tabular-nums">
              {workspace.apiUsageCount.toLocaleString()} /{' '}
              {workspace.apiUsageLimit.toLocaleString()} ({usagePct}%)
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-surface-container-low overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary"
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-text-muted">
            Demo keys only — no external production credentials are stored or transmitted.
          </div>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-on-surface">
            Workspace API Keys ({workspace.apiKeys.length})
          </h2>
          <span className="font-mono text-[11px] text-text-muted">
            Prefix: omni_demo_*
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-surface text-text-muted font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Label</th>
                <th className="py-3 px-4 font-semibold">Token (Demo)</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold">Last Used</th>
                <th className="py-3 px-4 font-semibold">30d Requests</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {workspace.apiKeys.map((k) => {
                const revealed = !!revealedIds[k.id];
                return (
                  <tr key={k.id} className="hover:bg-surface/60">
                    <td className="py-3 px-4 font-semibold text-on-surface whitespace-nowrap">
                      {k.label}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-on-surface whitespace-nowrap">
                      {revealed ? `${k.prefix}_sample_demo_token` : k.maskedKey}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-text-muted whitespace-nowrap">
                      {k.createdAt}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-text-muted whitespace-nowrap">
                      {k.lastUsed}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-on-surface">
                      {k.requests30d.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                          k.status === 'Active'
                            ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                            : 'bg-red-50 text-status-danger'
                        }`}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleReveal(k.id)}
                          title={revealed ? 'Hide key' : 'Show key'}
                          className="p-1.5 rounded border border-surface-border text-text-muted hover:text-on-surface cursor-pointer"
                        >
                          {revealed ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(k)}
                          title="Copy demo key"
                          className="p-1.5 rounded border border-surface-border text-text-muted hover:text-secondary cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {k.status === 'Active' && (
                          <button
                            type="button"
                            onClick={() => setRevokeTarget(k)}
                            title="Revoke key"
                            className="p-1.5 rounded border border-surface-border text-text-muted hover:text-status-danger cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Key Modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-secondary" />
                <h3 className="font-display text-base font-bold text-on-surface">
                  Generate Workspace Demo Key
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
            <form onSubmit={handleGenerateKey} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Key Label
                </label>
                <input
                  type="text"
                  required
                  value={keyLabel}
                  onChange={(e) => setKeyLabel(e.target.value)}
                  placeholder="e.g., Mindbody Calendar Bridge"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                />
              </div>
              <p className="text-[11px] text-text-muted">
                Generates a non-functional mock token prefixed with <span className="font-mono">omni_demo_</span> for prototype demonstration.
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {revokeTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setRevokeTarget(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-status-danger">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-display text-base font-bold text-on-surface">
                Revoke Demo API Key?
              </h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Revoking <span className="font-semibold text-on-surface">{revokeTarget.label}</span> immediately marks this token inactive in the workspace.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-4 py-2 rounded-lg bg-status-danger text-white text-xs font-semibold cursor-pointer"
              >
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BillingView({
  workspace,
  onUpdateWorkspace,
  onShowToast,
}: AccountViewProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const apiPct = Math.min(
    100,
    Math.round((workspace.apiUsageCount / Math.max(1, workspace.apiUsageLimit)) * 100)
  );
  const voicePct = Math.min(
    100,
    Math.round((workspace.voiceMinutesUsed / Math.max(1, workspace.voiceMinutesLimit)) * 100)
  );

  const PLANS = [
    {
      name: 'Starter API',
      price: '$149 / mo',
      apiLimit: 25000,
      voiceLimit: 1500,
      desc: '1 auto-assigned phone line, WhatsApp & Web AI concierge.',
    },
    {
      name: 'Growth API Platform',
      price: '$299 / mo',
      apiLimit: 100000,
      voiceLimit: 5000,
      desc: 'Multi-agent routing, CRM, team RBAC, and marketing automation.',
    },
    {
      name: 'Enterprise API Cluster',
      price: '$699 / mo',
      apiLimit: 250000,
      voiceLimit: 12000,
      desc: 'Dedicated telephony SLA, multi-location sync, and priority support.',
    },
  ];

  function handleSelectPlan(plan: (typeof PLANS)[number]) {
    onUpdateWorkspace((prev) => ({
      ...prev,
      planName: plan.name,
      planPrice: plan.price,
      subscriptionStatus: 'Active',
      apiUsageLimit: plan.apiLimit,
      voiceMinutesLimit: plan.voiceLimit,
      invoices: [
        {
          id: `INV-${Date.now().toString().slice(-4)}`,
          date: 'Nov 25, 2026',
          amount: plan.price.replace(' / mo', '.00'),
          plan: plan.name,
          status: 'Paid',
        },
        ...prev.invoices,
      ],
    }));
    setUpgradeOpen(false);
    onShowToast(`Workspace subscription switched to ${plan.name}.`, 'success');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            Subscription &amp; Billing
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage API subscription capacity, voice minute limits, and workspace invoices for {workspace.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUpgradeOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Change / Upgrade Plan</span>
        </button>
      </div>

      {/* Plan Summary & Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase text-secondary">
                Current Subscription Package
              </span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">
                {workspace.planName}
              </h2>
              <p className="font-mono text-xs text-text-muted mt-0.5">
                {workspace.planPrice} · Renews Dec 01, 2026
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-badge-whatsapp-bg text-badge-whatsapp-text font-mono text-[11px] font-semibold">
              {workspace.subscriptionStatus}
            </span>
          </div>

          <div className="space-y-3 pt-2 border-t border-surface-border">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-on-surface">API Request Usage</span>
                <span className="font-mono text-text-muted tabular-nums">
                  {workspace.apiUsageCount.toLocaleString()} /{' '}
                  {workspace.apiUsageLimit.toLocaleString()} ({apiPct}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${apiPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-on-surface">AI Voice Minutes</span>
                <span className="font-mono text-text-muted tabular-nums">
                  {workspace.voiceMinutesUsed.toLocaleString()} /{' '}
                  {workspace.voiceMinutesLimit.toLocaleString()} mins ({voicePct}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
                <div className="h-full bg-status-success rounded-full" style={{ width: `${voicePct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-secondary" />
              <h2 className="font-display text-sm font-bold text-on-surface">
                Payment Method (Placeholder)
              </h2>
            </div>
            <div className="p-3.5 rounded-lg bg-surface border border-surface-border flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-on-surface">
                  Corporate Visa •••• 4242
                </div>
                <div className="font-mono text-[11px] text-text-muted">
                  Expires 09/2028 · Billing Email: {workspace.businessEmail}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-mono text-[10px] font-semibold">
                Default
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onShowToast('Demo billing portal: no real card processing enabled.', 'info')
            }
            className="w-full py-2 rounded-lg border border-surface-border text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
          >
            Update Billing Details
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <h2 className="font-display text-sm font-bold text-on-surface">
            Billing History &amp; Invoices
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-surface text-text-muted font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Invoice</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Plan</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {workspace.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface/60">
                  <td className="py-3 px-4 font-mono font-semibold text-on-surface">
                    {inv.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-text-muted">{inv.date}</td>
                  <td className="py-3 px-4 text-on-surface">{inv.plan}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-on-surface tabular-nums">
                    {inv.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-badge-whatsapp-bg text-badge-whatsapp-text font-mono text-[10px] font-semibold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(`Downloaded simulated receipt ${inv.id}.pdf`, 'info')
                      }
                      className="inline-flex items-center gap-1 text-secondary font-semibold hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      {upgradeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setUpgradeOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-display text-base font-bold text-on-surface">
                Select Workspace API Subscription
              </h3>
              <button
                type="button"
                onClick={() => setUpgradeOpen(false)}
                className="text-text-muted hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PLANS.map((plan) => {
                const isCurrent = workspace.planName === plan.name;
                return (
                  <div
                    key={plan.name}
                    className={`rounded-xl border p-4 flex flex-col justify-between gap-4 ${
                      isCurrent
                        ? 'border-secondary bg-surface-container-low/50'
                        : 'border-surface-border bg-surface'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="font-display text-sm font-bold text-on-surface">
                        {plan.name}
                      </div>
                      <div className="font-mono text-lg font-bold text-secondary">
                        {plan.price}
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        {plan.desc}
                      </p>
                      <div className="pt-2 font-mono text-[10px] text-on-surface space-y-1">
                        <div>• {plan.apiLimit.toLocaleString()} API req/mo</div>
                        <div>• {plan.voiceLimit.toLocaleString()} voice mins</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                        isCurrent
                          ? 'bg-surface-container text-secondary cursor-default'
                          : 'bg-secondary text-white hover:bg-accent-hover'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SettingsView({
  workspace,
  onUpdateWorkspace,
  onShowToast,
}: AccountViewProps) {
  const [name, setName] = useState(workspace.name);
  const [industry, setIndustry] = useState(workspace.industry);
  const [email, setEmail] = useState(workspace.businessEmail);
  const [phone, setPhone] = useState(workspace.contactPhone);
  const [timezone, setTimezone] = useState(workspace.timezone);
  const [bio, setBio] = useState(workspace.companyBio);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    onUpdateWorkspace((prev) => ({
      ...prev,
      name: name.trim() || prev.name,
      industry: industry.trim() || prev.industry,
      businessEmail: email.trim() || prev.businessEmail,
      contactPhone: phone.trim() || prev.contactPhone,
      timezone,
      companyBio: bio,
    }));
    onShowToast('Business workspace profile saved.', 'success');
  }

  function handlePasswordUpdate(e: FormEvent) {
    e.preventDefault();
    if (!currentPw || !newPw) return;
    setCurrentPw('');
    setNewPw('');
    onShowToast('Password updated for demo operator session.', 'success');
  }

  function handleRevokeSession(sessionId: string) {
    onUpdateWorkspace((prev) => ({
      ...prev,
      activeSessions: prev.activeSessions.filter((s) => s.id !== sessionId),
    }));
    onShowToast('Device session terminated.', 'info');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
          Workspace &amp; Account Settings
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Configure business details, timezone, security credentials, and active browser sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Business Profile Form */}
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4"
        >
          <h2 className="font-display text-sm font-bold text-on-surface border-b border-surface-border pb-3">
            Business Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">
                Business / Practice Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">
                Operations Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">
                Primary Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-on-surface mb-1">
              Workspace Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
            >
              <option>America/New_York (EST)</option>
              <option>America/Los_Angeles (PST)</option>
              <option>America/Chicago (CST)</option>
              <option>Europe/London (GMT)</option>
            </select>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-on-surface mb-1">
              Business Receptionist Context
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>

        {/* Security & Sessions */}
        <div className="lg:col-span-5 space-y-5">
          <form
            onSubmit={handlePasswordUpdate}
            className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3 text-xs"
          >
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Lock className="w-4 h-4 text-secondary" />
              <h2 className="font-display text-sm font-bold text-on-surface">
                Account Security
              </h2>
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Minimum 10 characters"
                className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Update Password
            </button>
          </form>

          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Monitor className="w-4 h-4 text-secondary" />
              <h2 className="font-display text-sm font-bold text-on-surface">
                Active Sessions
              </h2>
            </div>
            <div className="space-y-2.5">
              {workspace.activeSessions.map((ses) => (
                <div
                  key={ses.id}
                  className="p-3 rounded-lg bg-surface border border-surface-border flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-semibold text-on-surface">{ses.device}</div>
                    <div className="font-mono text-[10px] text-text-muted">
                      {ses.location} · {ses.lastSeen}
                    </div>
                  </div>
                  {ses.current ? (
                    <span className="px-2 py-0.5 rounded bg-badge-whatsapp-bg text-badge-whatsapp-text font-mono text-[10px] font-semibold">
                      Current
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(ses.id)}
                      className="text-xs font-semibold text-status-danger hover:underline cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
