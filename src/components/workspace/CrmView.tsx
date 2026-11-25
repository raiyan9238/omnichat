import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Mail,
  MessageSquareHeart,
  Phone,
  Plus,
  Search,
  StickyNote,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { ToastType } from '../../types/omnibook';
import { CrmCustomer, WorkspaceTenant } from '../../types/workspace';

interface CrmViewProps {
  workspace: WorkspaceTenant;
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string | null) => void;
  onInspectCall: (callId: string) => void;
  onUpdateWorkspace: (updater: (prev: WorkspaceTenant) => WorkspaceTenant) => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function CrmView({
  workspace,
  selectedCustomerId,
  onSelectCustomer,
  onInspectCall,
  onUpdateWorkspace,
  onShowToast,
}: CrmViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CrmCustomer['status']>('All');
  const [addOpen, setAddOpen] = useState(false);

  // Add contact state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newStatus, setNewStatus] = useState<CrmCustomer['status']>('Lead');
  const [newTag, setNewTag] = useState('');

  // Detail editors
  const [noteInput, setNoteInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workspace.customers.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.email.toLowerCase().includes(q) &&
        !c.phone.toLowerCase().includes(q) &&
        !c.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [search, statusFilter, workspace.customers]);

  const selectedCustomer =
    workspace.customers.find((c) => c.id === selectedCustomerId) ?? null;

  function handleAddCustomer(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newEmail.trim()) return;
    const customer: CrmCustomer = {
      id: `cust-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      companyOrSegment: newSegment.trim() || 'Direct Inbound Client',
      status: newStatus,
      tags: newTag
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      lastInteraction: 'Nov 25, 2026',
      totalInteractions: 1,
      notes: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          date: 'Nov 25, 2026',
          type: 'Created',
          summary: 'Added to workspace CRM directory',
        },
      ],
    };

    onUpdateWorkspace((prev) => ({
      ...prev,
      customers: [customer, ...prev.customers],
    }));

    setAddOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewSegment('');
    setNewTag('');
    onShowToast(`${customer.name} added to CRM.`, 'success');
  }

  function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!selectedCustomer || !noteInput.trim()) return;
    const text = noteInput.trim();
    setNoteInput('');

    onUpdateWorkspace((prev) => ({
      ...prev,
      customers: prev.customers.map((c) =>
        c.id === selectedCustomer.id
          ? {
              ...c,
              notes: [
                {
                  id: `n-${Date.now()}`,
                  date: 'Just now',
                  author: 'Workspace Operator',
                  text,
                },
                ...c.notes,
              ],
              activities: [
                {
                  id: `act-${Date.now()}`,
                  date: 'Just now',
                  type: 'Note',
                  summary: `Added internal note: "${text.slice(0, 60)}"`,
                },
                ...c.activities,
              ],
            }
          : c
      ),
    }));
    onShowToast('Customer note saved.', 'success');
  }

  function handleAddTag(e: FormEvent) {
    e.preventDefault();
    if (!selectedCustomer || !tagInput.trim()) return;
    const tag = tagInput.trim();
    setTagInput('');
    if (selectedCustomer.tags.includes(tag)) return;

    onUpdateWorkspace((prev) => ({
      ...prev,
      customers: prev.customers.map((c) =>
        c.id === selectedCustomer.id ? { ...c, tags: [...c.tags, tag] } : c
      ),
    }));
    onShowToast(`Tag "${tag}" added.`, 'info');
  }

  function handleRemoveTag(tagToRemove: string) {
    if (!selectedCustomer) return;
    onUpdateWorkspace((prev) => ({
      ...prev,
      customers: prev.customers.map((c) =>
        c.id === selectedCustomer.id
          ? { ...c, tags: c.tags.filter((t) => t !== tagToRemove) }
          : c
      ),
    }));
  }

  // Customer Detail View
  if (selectedCustomer) {
    const customerCalls = workspace.callLogs.filter(
      (call) => call.customerId === selectedCustomer.id
    );
    const customerFeedback = workspace.feedback.filter(
      (fb) => fb.customerId === selectedCustomer.id
    );
    const customerThreads = workspace.conversations.filter(
      (t) => t.customerId === selectedCustomer.id
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectCustomer(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-on-surface cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Customer Directory</span>
          </button>

          <select
            value={selectedCustomer.status}
            onChange={(e) => {
              const status = e.target.value as CrmCustomer['status'];
              onUpdateWorkspace((prev) => ({
                ...prev,
                customers: prev.customers.map((c) =>
                  c.id === selectedCustomer.id ? { ...c, status } : c
                ),
              }));
              onShowToast(`Contact status updated to ${status}.`, 'info');
            }}
            className="rounded-lg border border-surface-border bg-surface-card px-3 py-1.5 text-xs font-semibold text-on-surface"
          >
            <option value="VIP">VIP</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Profile Summary */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-xl font-bold text-on-surface">
                {selectedCustomer.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-surface-container text-secondary">
                {selectedCustomer.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                <Phone className="w-3.5 h-3.5 text-secondary" />
                {selectedCustomer.phone}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-secondary" />
                {selectedCustomer.email}
              </span>
              <span>Segment: {selectedCustomer.companyOrSegment}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Interactions</div>
              <div className="text-sm font-bold text-on-surface">
                {selectedCustomer.totalInteractions}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-surface border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Last Touch</div>
              <div className="text-sm font-bold text-on-surface">
                {selectedCustomer.lastInteraction}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Previous Calls, Omnichannel History & Feedback */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-on-surface border-b border-surface-border pb-2.5">
                Previous Calls &amp; AI Summaries ({customerCalls.length})
              </h2>
              {customerCalls.length === 0 ? (
                <p className="text-xs text-text-muted py-4">
                  No voice call logs recorded for this customer yet.
                </p>
              ) : (
                <div className="divide-y divide-surface-border">
                  {customerCalls.map((call) => (
                    <div
                      key={call.id}
                      className="py-3 first:pt-0 last:pb-0 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-on-surface">
                          {call.outcome} · {call.agentName.split('—')[0].trim()}
                        </span>
                        <span className="font-mono text-[11px] text-text-muted tabular-nums">
                          {call.dateTime} ({call.durationLabel})
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {call.summary}
                      </p>
                      <button
                        type="button"
                        onClick={() => onInspectCall(call.id)}
                        className="text-[11px] font-semibold text-secondary hover:underline cursor-pointer"
                      >
                        Open Call Transcript &amp; Timeline →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-on-surface border-b border-surface-border pb-2.5">
                Omnichannel Messaging History ({customerThreads.length})
              </h2>
              {customerThreads.length === 0 ? (
                <p className="text-xs text-text-muted py-2">
                  No messaging threads linked.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {customerThreads.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-lg bg-surface border border-surface-border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-on-surface">
                          {t.channel} ({t.handle})
                        </span>
                        <span className="font-mono text-[10px] text-secondary">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-text-muted">
                        {t.messages[t.messages.length - 1]?.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-surface-border pb-2.5">
                <MessageSquareHeart className="w-4 h-4 text-secondary" />
                <h2 className="font-display text-sm font-bold text-on-surface">
                  Customer Feedback ({customerFeedback.length})
                </h2>
              </div>
              {customerFeedback.length === 0 ? (
                <p className="text-xs text-text-muted py-2">
                  No survey feedback submitted yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {customerFeedback.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-3 rounded-lg bg-surface border border-surface-border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-on-surface">
                          Rating: {fb.rating}/5 · {fb.sentiment}
                        </span>
                        <span className="font-mono text-[10px] text-text-muted">
                          {fb.date}
                        </span>
                      </div>
                      <p className="text-text-main">"{fb.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Tags, Notes, Activity */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary" />
                <h2 className="font-display text-sm font-bold text-on-surface">
                  Tags &amp; Segments
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCustomer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface text-xs font-medium"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove ${tag}`}
                      className="text-text-muted hover:text-status-danger cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag..."
                  className="flex-1 rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-secondary" />
                <h2 className="font-display text-sm font-bold text-on-surface">
                  Team &amp; AI Notes
                </h2>
              </div>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add internal note about preferences or follow-up..."
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  Save Note
                </button>
              </form>

              <div className="space-y-2 pt-1">
                {selectedCustomer.notes.length === 0 ? (
                  <p className="text-xs text-text-muted">No notes yet.</p>
                ) : (
                  selectedCustomer.notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-surface border border-surface-border text-xs space-y-1"
                    >
                      <div className="flex justify-between font-mono text-[10px] text-text-muted">
                        <span className="font-semibold text-on-surface">{n.author}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-text-main">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-on-surface">
                Activity Log
              </h2>
              <div className="space-y-2.5">
                {selectedCustomer.activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    <div>
                      <div className="font-mono text-[10px] text-text-muted">
                        {act.date} · {act.type}
                      </div>
                      <div className="text-on-surface">{act.summary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            Customer Directory (CRM)
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Isolated customer profiles, communication summaries, tags, and interaction timelines for {workspace.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, or tag..."
            className="w-full rounded-lg border border-surface-border bg-surface pl-8 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['All', 'VIP', 'Active', 'Lead', 'Inactive'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                statusFilter === st
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-surface text-text-muted border-surface-border hover:text-on-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Users className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm font-semibold text-on-surface">
              No matching contacts
            </p>
            <p className="text-xs text-text-muted">
              Adjust your search filters or add a new contact.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-surface text-text-muted font-mono text-[11px] uppercase">
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Tags</th>
                  <th className="py-3 px-4 font-semibold">Interactions</th>
                  <th className="py-3 px-4 font-semibold">Last Touch</th>
                  <th className="py-3 px-4 font-semibold text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCustomer(c.id)}
                    className="hover:bg-surface-container-low/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-on-surface">{c.name}</div>
                      <div className="text-[11px] text-text-muted">
                        {c.companyOrSegment}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-[11px] text-on-surface tabular-nums">
                        {c.phone}
                      </div>
                      <div className="font-mono text-[11px] text-text-muted">
                        {c.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                          c.status === 'VIP'
                            ? 'bg-badge-voice-bg text-badge-voice-text'
                            : c.status === 'Active'
                            ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                            : c.status === 'Lead'
                            ? 'bg-blue-50 text-secondary'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {c.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface font-mono text-[10px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-on-surface">
                      {c.totalInteractions}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-text-muted whitespace-nowrap tabular-nums">
                      {c.lastInteraction}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="font-semibold text-secondary">Open →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-display text-base font-bold text-on-surface">
                Add Customer Contact
              </h3>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="text-text-muted hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Jordan Taylor"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 301-2244"
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Segment / Service
                  </label>
                  <input
                    type="text"
                    value={newSegment}
                    onChange={(e) => setNewSegment(e.target.value)}
                    placeholder="Consultation Lead"
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as CrmCustomer['status'])
                    }
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Active">Active</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="WhatsApp Opt-In, Morning Slot"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
