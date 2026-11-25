import { FormEvent, useState } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  Mail,
  Megaphone,
  Plus,
  Send,
  Share2,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { ToastType } from '../../types/omnibook';
import {
  EmailCampaign,
  SocialPost,
  WorkspaceTenant,
} from '../../types/workspace';
import { SparkAreaTrendChart } from './Charts';

type MarketingTab = 'social' | 'email' | 'analytics';

interface MarketingHubViewProps {
  workspace: WorkspaceTenant;
  onUpdateWorkspace: (updater: (prev: WorkspaceTenant) => WorkspaceTenant) => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function MarketingHubView({
  workspace,
  onUpdateWorkspace,
  onShowToast,
}: MarketingHubViewProps) {
  const [activeTab, setActiveTab] = useState<MarketingTab>('social');
  const [socialViewMode, setSocialViewMode] = useState<'list' | 'calendar'>('list');

  // Social Composer state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState(
    'Skip phone hold times—reply "BOOK" on WhatsApp or Instagram DM to lock in your consultation with instant calendar reminders.'
  );
  const [postCampaign, setPostCampaign] = useState('Q4 Retention');
  const [postSchedule, setPostSchedule] = useState('Nov 29, 2026 · 10:00 AM');
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    SocialPost['platforms']
  >(['Instagram', 'Facebook']);

  // Email Campaign Modal state
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campName, setCampName] = useState('');
  const [campSubject, setCampSubject] = useState('');
  const [campTemplate, setCampTemplate] = useState(
    'VIP Re-engagement + Direct WhatsApp Link'
  );
  const [campSegment, setCampSegment] = useState('VIP & Returning Members (90d)');
  const [campDate, setCampDate] = useState('Nov 30, 2026');

  function togglePlatform(platform: SocialPost['platforms'][number]) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.length > 1
          ? prev.filter((p) => p !== platform)
          : prev
        : [...prev, platform]
    );
  }

  function handleSavePost(status: 'Draft' | 'Scheduled') {
    if (!postTitle.trim() || !postContent.trim()) {
      onShowToast('Please enter a post title and caption.', 'warning');
      return;
    }

    const newPost: SocialPost = {
      id: `sp-${Date.now()}`,
      title: postTitle.trim(),
      content: postContent.trim(),
      platforms: selectedPlatforms,
      status,
      scheduledFor: postSchedule,
      campaign: postCampaign,
      estimatedReach: 3200 + selectedPlatforms.length * 950,
    };

    onUpdateWorkspace((prev) => ({
      ...prev,
      socialPosts: [newPost, ...prev.socialPosts],
      marketingTimeline: [
        {
          id: `mt-${Date.now()}`,
          date: 'Just now',
          channel: 'Social Media',
          event: `${status} "${newPost.title}" across ${newPost.platforms.join(', ')}`,
        },
        ...prev.marketingTimeline,
      ],
    }));

    setPostTitle('');
    onShowToast(
      status === 'Scheduled'
        ? `Post scheduled for ${postSchedule} (mock preview).`
        : 'Post saved to drafts.',
      'success'
    );
  }

  function handleCreateCampaign(e: FormEvent) {
    e.preventDefault();
    if (!campName.trim() || !campSubject.trim()) return;

    const newCamp: EmailCampaign = {
      id: `ec-${Date.now()}`,
      name: campName.trim(),
      subject: campSubject.trim(),
      template: campTemplate,
      segment: campSegment,
      recipientCount: 310,
      status: 'Scheduled',
      scheduledDate: campDate,
      openRate: 0,
      clickRate: 0,
      bookedReplies: 0,
    };

    onUpdateWorkspace((prev) => ({
      ...prev,
      emailCampaigns: [newCamp, ...prev.emailCampaigns],
      marketingTimeline: [
        {
          id: `mt-${Date.now()}`,
          date: 'Just now',
          channel: 'Email Campaign',
          event: `Scheduled "${newCamp.name}" to ${newCamp.recipientCount} recipients`,
        },
        ...prev.marketingTimeline,
      ],
    }));

    setCampaignModalOpen(false);
    setCampName('');
    setCampSubject('');
    onShowToast(`Cold email campaign "${newCamp.name}" scheduled.`, 'success');
  }

  function handleLaunchSimulatedEmail(campaignId: string) {
    onUpdateWorkspace((prev) => ({
      ...prev,
      emailCampaigns: prev.emailCampaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              status: 'Active',
              openRate: c.openRate || 48.6,
              clickRate: c.clickRate || 16.4,
              bookedReplies: c.bookedReplies || 24,
            }
          : c
      ),
    }));
    onShowToast('Simulated campaign send activated with live tracking metrics.', 'success');
  }

  const totalLeadsGenerated =
    workspace.emailCampaigns.reduce((sum, c) => sum + c.bookedReplies, 0) +
    workspace.socialPosts.length * 14;

  const leadTrend = [
    { label: 'W1', value: 28 },
    { label: 'W2', value: 42 },
    { label: 'W3', value: 56 },
    { label: 'W4', value: 74 },
    { label: 'W5', value: 89 },
    { label: 'W6', value: totalLeadsGenerated },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            Marketing Hub
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Social media scheduling, cold email outreach, and campaign lead attribution connected to your AI booking channels.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-surface-border bg-surface-card p-1">
          {(
            [
              { id: 'social', label: 'Social Media', icon: Share2 },
              { id: 'email', label: 'Cold Email Outreach', icon: Mail },
              { id: 'analytics', label: 'Marketing Analytics', icon: BarChart3 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-secondary text-white'
                    : 'text-text-muted hover:text-on-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SOCIAL MEDIA MANAGEMENT */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Post Composer */}
            <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <h2 className="font-display text-sm font-bold text-on-surface">
                  Social Post Composer
                </h2>
                <span className="font-mono text-[10px] text-text-muted">
                  Auto-links DM &amp; WhatsApp Booking
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Post Title / Internal Label
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g., December Consultation Slots Open"
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Target Platforms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['Instagram', 'Facebook', 'LinkedIn', 'X'] as const).map(
                      (plat) => {
                        const active = selectedPlatforms.includes(plat);
                        return (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => togglePlatform(plat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                              active
                                ? 'bg-secondary text-white border-secondary'
                                : 'bg-surface text-text-muted border-surface-border hover:text-on-surface'
                            }`}
                          >
                            {plat}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Post Caption &amp; Booking CTA
                  </label>
                  <textarea
                    rows={3}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">
                      Campaign Tag
                    </label>
                    <input
                      type="text"
                      value={postCampaign}
                      onChange={(e) => setPostCampaign(e.target.value)}
                      className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">
                      Schedule Slot
                    </label>
                    <input
                      type="text"
                      value={postSchedule}
                      onChange={(e) => setPostSchedule(e.target.value)}
                      className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleSavePost('Draft')}
                    className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePost('Scheduled')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Post</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Post Preview */}
            <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
              <h2 className="font-display text-sm font-bold text-on-surface border-b border-surface-border pb-3">
                Live Post Preview
              </h2>

              <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-display text-xs font-bold">
                      {workspace.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">
                        {workspace.name}
                      </div>
                      <div className="font-mono text-[10px] text-text-muted">
                        {selectedPlatforms.join(' · ')}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-secondary font-semibold">
                    {postCampaign}
                  </span>
                </div>

                <p className="text-xs text-on-surface leading-relaxed">
                  {postContent}
                </p>

                <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border flex items-center justify-between font-mono text-[10px]">
                  <span className="text-text-muted">
                    AI Booking Trigger: WhatsApp / DM Instant Slot
                  </span>
                  <span className="text-status-success font-semibold">Armed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Queue / Calendar */}
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-sm font-bold text-on-surface">
                Scheduled Posts, Drafts &amp; Content Calendar ({workspace.socialPosts.length})
              </h2>
              <div className="inline-flex rounded-lg border border-surface-border bg-surface p-0.5">
                <button
                  type="button"
                  onClick={() => setSocialViewMode('list')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    socialViewMode === 'list'
                      ? 'bg-surface-card text-on-surface shadow-2xs'
                      : 'text-text-muted'
                  }`}
                >
                  Campaign List
                </button>
                <button
                  type="button"
                  onClick={() => setSocialViewMode('calendar')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    socialViewMode === 'calendar'
                      ? 'bg-surface-card text-on-surface shadow-2xs'
                      : 'text-text-muted'
                  }`}
                >
                  Calendar Grid
                </button>
              </div>
            </div>

            {socialViewMode === 'list' ? (
              <div className="divide-y divide-surface-border">
                {workspace.socialPosts.map((post) => (
                  <div
                    key={post.id}
                    className="py-3 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-on-surface">{post.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                            post.status === 'Published'
                              ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                              : post.status === 'Scheduled'
                              ? 'bg-blue-50 text-secondary'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <p className="text-text-muted line-clamp-1">{post.content}</p>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-[11px] text-text-muted shrink-0">
                      <span>{post.platforms.join(', ')}</span>
                      <span>{post.scheduledFor}</span>
                      <span className="text-on-surface font-semibold tabular-nums">
                        ~{post.estimatedReach.toLocaleString()} reach
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {workspace.socialPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 rounded-xl bg-surface border border-surface-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
                      <span>{post.scheduledFor}</span>
                      <span className="font-semibold text-secondary">{post.status}</span>
                    </div>
                    <div className="font-semibold text-on-surface">{post.title}</div>
                    <div className="text-[11px] text-text-muted line-clamp-2">
                      {post.content}
                    </div>
                    <div className="font-mono text-[10px] text-on-surface">
                      {post.platforms.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COLD EMAIL OUTREACH */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-on-surface">
                Cold Email &amp; Reactivation Campaigns
              </h2>
              <p className="text-xs text-text-muted">
                Simulated outreach sequences driving consultation bookings straight into your workspace calendar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCampaignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Email Campaign</span>
            </button>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-surface text-text-muted font-mono text-[11px] uppercase">
                    <th className="py-3 px-4 font-semibold">Campaign</th>
                    <th className="py-3 px-4 font-semibold">Audience Segment</th>
                    <th className="py-3 px-4 font-semibold">Recipients</th>
                    <th className="py-3 px-4 font-semibold">Open Rate</th>
                    <th className="py-3 px-4 font-semibold">Click Rate</th>
                    <th className="py-3 px-4 font-semibold">Booked Replies</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {workspace.emailCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-surface/60">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-on-surface">{camp.name}</div>
                        <div className="text-[11px] text-text-muted truncate max-w-xs">
                          Subject: {camp.subject}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-main whitespace-nowrap">
                        {camp.segment}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        {camp.recipientCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-on-surface">
                        {camp.openRate}%
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-on-surface">
                        {camp.clickRate}%
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-status-success tabular-nums">
                        {camp.bookedReplies}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                            camp.status === 'Active' || camp.status === 'Completed'
                              ? 'bg-badge-whatsapp-bg text-badge-whatsapp-text'
                              : camp.status === 'Scheduled'
                              ? 'bg-blue-50 text-secondary'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {camp.status === 'Draft' || camp.status === 'Scheduled' ? (
                          <button
                            type="button"
                            onClick={() => handleLaunchSimulatedEmail(camp.id)}
                            className="inline-flex items-center gap-1 text-secondary font-semibold hover:underline cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Launch Demo</span>
                          </button>
                        ) : (
                          <span className="font-mono text-[11px] text-text-muted">
                            {camp.scheduledDate}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKETING ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Campaign Leads Generated</span>
                <Users className="w-4 h-4 text-secondary" />
              </div>
              <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
                {totalLeadsGenerated}
              </div>
              <div className="font-mono text-[11px] text-status-success">
                +22.4% booked via AI links
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Avg Email Open Rate</span>
                <Mail className="w-4 h-4 text-secondary" />
              </div>
              <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
                56.4%
              </div>
              <div className="font-mono text-[11px] text-text-muted">
                Benchmark: 31% industry avg
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Social DM Engagement</span>
                <Megaphone className="w-4 h-4 text-channel-instagram" />
              </div>
              <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
                14.2k reach
              </div>
              <div className="font-mono text-[11px] text-status-success">
                4.8% DM-to-booking CTR
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Active Sequences</span>
                <Sparkles className="w-4 h-4 text-status-success" />
              </div>
              <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
                {workspace.emailCampaigns.length + workspace.socialPosts.length}
              </div>
              <div className="font-mono text-[11px] text-text-muted">
                WhatsApp + Email follow-up armed
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-on-surface">
                Campaign Lead Generation Trend
              </h2>
              <SparkAreaTrendChart data={leadTrend} valueSuffix=" leads" />
            </div>

            <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <h2 className="font-display text-sm font-bold text-on-surface">
                  Marketing Activity Timeline
                </h2>
              </div>
              <div className="space-y-3">
                {workspace.marketingTimeline.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-lg bg-surface border border-surface-border text-xs space-y-1"
                  >
                    <div className="flex justify-between font-mono text-[10px] text-text-muted">
                      <span className="font-semibold text-secondary">{ev.channel}</span>
                      <span>{ev.date}</span>
                    </div>
                    <p className="text-on-surface">{ev.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Cold Email Campaign Modal */}
      {campaignModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCampaignModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-display text-base font-bold text-on-surface">
                Create Cold Email Outreach Campaign
              </h3>
              <button
                type="button"
                onClick={() => setCampaignModalOpen(false)}
                className="text-text-muted hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g., Q4 Executive Checkup Outreach"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={campSubject}
                  onChange={(e) => setCampSubject(e.target.value)}
                  placeholder="Reserve your priority consultation slot in 1 click"
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Template
                  </label>
                  <select
                    value={campTemplate}
                    onChange={(e) => setCampTemplate(e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  >
                    <option>VIP Re-engagement + Direct WhatsApp Link</option>
                    <option>B2B Partnership Cold Intro</option>
                    <option>Series Follow-Up Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Send Date
                  </label>
                  <input
                    type="text"
                    value={campDate}
                    onChange={(e) => setCampDate(e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Recipient Segment Preview
                </label>
                <select
                  value={campSegment}
                  onChange={(e) => setCampSegment(e.target.value)}
                  className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface"
                >
                  <option>VIP &amp; Returning Members (90d)</option>
                  <option>Unbooked Inbound Leads (30d)</option>
                  <option>Local Corporate HR Partners</option>
                </select>
                <div className="mt-1.5 font-mono text-[10px] text-text-muted">
                  Simulated recipient pool: 310 verified contacts · Auto-unsubscribe &amp; calendar link included
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCampaignModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer"
                >
                  Schedule Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
