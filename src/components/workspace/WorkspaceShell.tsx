import { ReactNode, useState } from 'react';
import {
  BarChart3,
  Bot,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ExternalLink,
  KeyRound,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  MessageSquareHeart,
  PhoneCall,
  PhoneForwarded,
  Settings,
  Shield,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { ROLE_PERMISSIONS } from '../../data/workspaceData';
import {
  WorkspaceRole,
  WorkspaceSection,
  WorkspaceTenant,
} from '../../types/workspace';

interface NavGroup {
  label: string;
  items: {
    id: WorkspaceSection;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Communication',
    items: [
      { id: 'agents', label: 'AI Agents', icon: Bot },
      { id: 'numbers', label: 'Phone Numbers', icon: PhoneForwarded },
      { id: 'call-logs', label: 'Call Logs', icon: PhoneCall },
      { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    ],
  },
  {
    label: 'Customer Management',
    items: [
      { id: 'crm', label: 'CRM', icon: Users },
      { id: 'feedback', label: 'Feedback', icon: MessageSquareHeart },
    ],
  },
  {
    label: 'Insights',
    items: [{ id: 'analytics', label: 'Analytics', icon: BarChart3 }],
  },
  {
    label: 'Workspace',
    items: [
      { id: 'team', label: 'Team Management', icon: UsersRound },
      { id: 'marketing', label: 'Marketing Hub', icon: Megaphone },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'api-keys', label: 'API Keys', icon: KeyRound },
      { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

const SECTION_TITLES: Record<WorkspaceSection, string> = {
  dashboard: 'Workspace Overview',
  agents: 'AI Receptionist Agents',
  numbers: 'Phone Numbers & Routing',
  'call-logs': 'Call Logs & Transcripts',
  conversations: 'Omnichannel Conversations',
  crm: 'Customer Directory (CRM)',
  feedback: 'Customer Feedback & Sentiment',
  analytics: 'Communication & Business Analytics',
  team: 'Team Management & Roles',
  marketing: 'Marketing Hub',
  'api-keys': 'API Keys & Webhooks',
  billing: 'Subscription & Billing',
  settings: 'Workspace Settings',
};

interface WorkspaceShellProps {
  workspaces: WorkspaceTenant[];
  activeWorkspace: WorkspaceTenant;
  activeSection: WorkspaceSection;
  activeRole: WorkspaceRole;
  onSelectWorkspace: (workspaceId: string) => void;
  onSelectSection: (section: WorkspaceSection) => void;
  onSelectRole: (role: WorkspaceRole) => void;
  onExitToLanding: () => void;
  children: ReactNode;
}

export function WorkspaceShell({
  workspaces,
  activeWorkspace,
  activeSection,
  activeRole,
  onSelectWorkspace,
  onSelectSection,
  onSelectRole,
  onExitToLanding,
  children,
}: WorkspaceShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);

  const allowedSections = ROLE_PERMISSIONS[activeRole];
  const isSectionAllowed = allowedSections.includes(activeSection);
  const unreadConversations = activeWorkspace.conversations.filter((c) => c.unread).length;

  function handleNavClick(section: WorkspaceSection) {
    onSelectSection(section);
    setMobileOpen(false);
  }

  function renderSidebarContent(isMobile = false) {
    const compact = collapsed && !isMobile;

    return (
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-surface-border shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            {!compact && (
              <div className="min-w-0">
                <div className="font-display text-sm font-bold text-on-surface truncate">
                  Omnichat <span className="text-secondary">OS</span>
                </div>
                <div className="font-mono text-[10px] text-text-muted truncate">
                  OmniBook SaaS Console
                </div>
              </div>
            )}
          </button>

          {!isMobile ? (
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:inline-flex w-7 h-7 rounded-md items-center justify-center text-text-muted hover:text-on-surface hover:bg-surface-container-low cursor-pointer"
            >
              {compact ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-on-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Workspace navigation">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter((item) =>
              allowedSections.includes(item.id)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="space-y-1">
                {!compact && (
                  <div className="px-2.5 pb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    {group.label}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const showUnread = item.id === 'conversations' && unreadConversations > 0;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      title={compact ? item.label : undefined}
                      className={`w-full flex items-center ${
                        compact ? 'justify-center px-2' : 'justify-between px-2.5'
                      } py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-surface-container text-secondary font-semibold'
                          : 'text-text-main hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        {!compact && <span className="truncate">{item.label}</span>}
                      </span>
                      {!compact && showUnread && (
                        <span className="px-1.5 py-0.5 rounded-full bg-secondary text-white font-mono text-[10px] font-bold tabular-nums">
                          {unreadConversations}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-surface-border space-y-2 shrink-0">
          {!compact && (
            <div className="px-2.5 py-2 rounded-lg bg-surface-container-low border border-surface-border">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold text-text-muted uppercase">
                  Active Plan
                </span>
                <span className="font-mono text-[10px] font-bold text-status-success">
                  {activeWorkspace.subscriptionStatus}
                </span>
              </div>
              <div className="text-xs font-semibold text-on-surface mt-0.5 truncate">
                {activeWorkspace.planName}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onExitToLanding}
            title="Return to Public Site"
            className={`w-full flex items-center ${
              compact ? 'justify-center' : 'justify-between px-2.5'
            } py-2 rounded-lg text-xs font-medium text-text-muted hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer`}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 shrink-0" />
              {!compact && <span>Public Landing Page</span>}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex">
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-surface-card border-r border-surface-border shrink-0 transition-all duration-200 sticky top-0 h-screen ${
          collapsed ? 'w-[68px]' : 'w-[244px]'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex bg-primary/40 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <aside className="w-72 max-w-[85vw] bg-surface-card border-r border-surface-border h-full shadow-xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Control Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-card/95 backdrop-blur-md border-b border-surface-border px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open workspace menu"
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-border text-on-surface hover:bg-surface-container-low cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Tenant Workspace Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWsDropdownOpen((o) => !o)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-container-low text-xs font-semibold text-on-surface transition-colors cursor-pointer max-w-[210px] sm:max-w-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="truncate">{activeWorkspace.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted shrink-0" />
              </button>

              {wsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setWsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-72 rounded-xl bg-surface-card border border-surface-border shadow-lg p-1.5 z-40">
                    <div className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                      Isolated Tenant Workspaces
                    </div>
                    {workspaces.map((ws) => {
                      const active = ws.id === activeWorkspace.id;
                      return (
                        <button
                          key={ws.id}
                          type="button"
                          onClick={() => {
                            onSelectWorkspace(ws.id);
                            setWsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                            active
                              ? 'bg-surface-container text-secondary font-semibold'
                              : 'text-on-surface hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{ws.name}</div>
                            <div className="text-[11px] text-text-muted truncate">
                              {ws.industry} · {ws.planName}
                            </div>
                          </div>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border shrink-0">
                            {ws.agents.length} AI
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-text-muted truncate">
              <span>/</span>
              <span className="font-semibold text-on-surface truncate">
                {SECTION_TITLES[activeSection]}
              </span>
            </div>
          </div>

          {/* Right Controls: Simulated Role Switcher & Public Site Exit */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-surface-border bg-surface">
              <Shield className="w-3.5 h-3.5 text-secondary shrink-0" />
              <label htmlFor="role-switcher" className="hidden sm:inline text-[11px] text-text-muted whitespace-nowrap">
                Role View:
              </label>
              <select
                id="role-switcher"
                value={activeRole}
                onChange={(e) => onSelectRole(e.target.value as WorkspaceRole)}
                className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Member">Member</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onExitToLanding}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border text-xs font-medium text-text-main hover:bg-surface-container-low transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {!isSectionAllowed ? (
            <div className="bg-surface-card border border-surface-border rounded-xl p-8 text-center max-w-lg mx-auto mt-8 space-y-3">
              <div className="w-11 h-11 rounded-full bg-surface-container text-secondary mx-auto flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="font-display text-lg font-bold text-on-surface">
                Restricted under {activeRole} Role
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Your simulated <span className="font-semibold text-on-surface">{activeRole}</span> permission profile does not include access to{' '}
                <span className="font-semibold text-on-surface">{SECTION_TITLES[activeSection]}</span>. Switch back to Dashboard or elevate the simulated role in the top bar.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectSection('dashboard')}
                  className="px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => onSelectRole('Owner')}
                  className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
                >
                  Preview as Owner
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
