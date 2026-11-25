import { FormEvent, useState } from 'react';
import {
  Check,
  Clock,
  MailPlus,
  Shield,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { ROLE_PERMISSIONS } from '../../data/workspaceData';
import { ToastType } from '../../types/omnibook';
import {
  TeamMember,
  WorkspaceRole,
  WorkspaceTenant,
} from '../../types/workspace';

interface TeamViewProps {
  workspace: WorkspaceTenant;
  activeRole: WorkspaceRole;
  onSelectRole: (role: WorkspaceRole) => void;
  onUpdateWorkspace: (updater: (prev: WorkspaceTenant) => WorkspaceTenant) => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

const ROLE_DESCRIPTIONS: Record<WorkspaceRole, string> = {
  Owner: 'Full access across billing, API keys, telephony provisioning, team roles, and marketing.',
  Admin: 'Manage AI agents, numbers, team members, CRM, analytics, and marketing campaigns.',
  Manager: 'Oversee AI agents, call logs, omnichannel inbox, CRM, feedback, and analytics.',
  Member: 'Handle customer conversations, inspect call logs, update CRM notes, and review feedback.',
};

export function TeamView({
  workspace,
  activeRole,
  onSelectRole,
  onUpdateWorkspace,
  onShowToast,
}: TeamViewProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('Member');
  const [inviteDept, setInviteDept] = useState('Operations');

  const activeMembers = workspace.team.filter((m) => m.status === 'Active');
  const pendingInvites = workspace.team.filter((m) => m.status === 'Pending');

  function handleInvite(e: FormEvent) {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const member: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Pending',
      lastActive: 'Invited just now',
      department: inviteDept.trim() || 'Operations',
    };

    onUpdateWorkspace((prev) => ({
      ...prev,
      team: [...prev.team, member],
      teamActivity: [
        {
          id: `ta-${Date.now()}`,
          timestamp: 'Just now',
          actor: `Operator (${activeRole})`,
          action: `Invited ${member.email} as ${member.role}`,
        },
        ...prev.teamActivity,
      ],
    }));

    setInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    onShowToast(`Invitation queued for ${member.email} (${member.role}).`, 'success');
  }

  function handleRoleChange(memberId: string, nextRole: WorkspaceRole) {
    const target = workspace.team.find((m) => m.id === memberId);
    if (!target) return;

    onUpdateWorkspace((prev) => ({
      ...prev,
      team: prev.team.map((m) =>
        m.id === memberId ? { ...m, role: nextRole } : m
      ),
      teamActivity: [
        {
          id: `ta-${Date.now()}`,
          timestamp: 'Just now',
          actor: `Operator (${activeRole})`,
          action: `Changed ${target.name} role from ${target.role} to ${nextRole}`,
        },
        ...prev.teamActivity,
      ],
    }));

    onShowToast(`Updated ${target.name} to ${nextRole}.`, 'info');
  }

  function handleRemoveMember(memberId: string) {
    const target = workspace.team.find((m) => m.id === memberId);
    if (!target) return;
    onUpdateWorkspace((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== memberId),
      teamActivity: [
        {
          id: `ta-${Date.now()}`,
          timestamp: 'Just now',
          actor: `Operator (${activeRole})`,
          action: `Removed ${target.name} (${target.role}) from workspace`,
        },
        ...prev.teamActivity,
      ],
    }));
    onShowToast(`Removed ${target.name} from workspace.`, 'info');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            Team Management &amp; Access Roles
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Invite team operators, assign role-based permissions, and preview workspace access levels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover whitespace-nowrap shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Interactive Role Permission Matrix / Simulator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {(['Owner', 'Admin', 'Manager', 'Member'] as WorkspaceRole[]).map((role) => {
          const isCurrent = activeRole === role;
          return (
            <div
              key={role}
              className={`rounded-xl border p-4 space-y-2 transition-colors ${
                isCurrent
                  ? 'bg-surface-container-low border-secondary'
                  : 'bg-surface-card border-surface-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-on-surface">
                  <Shield className="w-3.5 h-3.5 text-secondary" />
                  {role}
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {ROLE_PERMISSIONS[role].length} modules
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {ROLE_DESCRIPTIONS[role]}
              </p>
              <button
                type="button"
                onClick={() => {
                  onSelectRole(role);
                  onShowToast(`Switched simulated view to ${role} role.`, 'info');
                }}
                className={`text-[11px] font-semibold cursor-pointer ${
                  isCurrent ? 'text-secondary' : 'text-text-main hover:text-secondary'
                }`}
              >
                {isCurrent ? '✓ Currently Previewing' : `Preview as ${role} →`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Members & Pending Invites */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold text-on-surface">
            Workspace Members ({activeMembers.length} Active · {pendingInvites.length} Pending)
          </h2>
          <span className="font-mono text-[11px] text-text-muted">
            Tenant Isolation: {workspace.id}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-surface text-text-muted font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Member</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {workspace.team.map((member) => (
                <tr key={member.id} className="hover:bg-surface/60">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-on-surface">{member.name}</div>
                    <div className="font-mono text-[11px] text-text-muted">
                      {member.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-main whitespace-nowrap">
                    {member.department}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={member.role}
                      disabled={member.role === 'Owner' && activeMembers.filter((m) => m.role === 'Owner').length <= 1}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value as WorkspaceRole)
                      }
                      className="rounded-lg border border-surface-border bg-surface px-2.5 py-1 text-xs font-semibold text-on-surface disabled:opacity-60"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Member">Member</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                        member.status === 'Active'
                          ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text-muted whitespace-nowrap">
                    {member.lastActive}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled={member.role === 'Owner'}
                      onClick={() => handleRemoveMember(member.id)}
                      title={
                        member.role === 'Owner'
                          ? 'Primary workspace owner cannot be removed'
                          : 'Remove member'
                      }
                      className="inline-flex items-center gap-1 text-text-muted hover:text-status-danger disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Activity History */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          <h2 className="font-display text-sm font-bold text-on-surface">
            Team Activity History
          </h2>
        </div>

        <div className="divide-y divide-surface-border">
          {workspace.teamActivity.map((item) => (
            <div
              key={item.id}
              className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-semibold text-on-surface">{item.actor}</span>{' '}
                <span className="text-text-muted">{item.action}</span>
              </div>
              <span className="font-mono text-[11px] text-text-muted">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInviteOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <MailPlus className="w-4 h-4 text-secondary" />
                <h3 className="font-display text-base font-bold text-on-surface">
                  Invite Team Member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="text-text-muted hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="alex@clinic.demo"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Access Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
