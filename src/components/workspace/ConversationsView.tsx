import { FormEvent, useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  User,
} from 'lucide-react';
import { ToastType } from '../../types/omnibook';
import {
  OmnichannelThread,
  WorkspaceTenant,
} from '../../types/workspace';

interface ConversationsViewProps {
  workspace: WorkspaceTenant;
  onUpdateWorkspace: (updater: (prev: WorkspaceTenant) => WorkspaceTenant) => void;
  onOpenCustomer: (customerId: string) => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

const CHANNEL_BADGE: Record<OmnichannelThread['channel'], string> = {
  WhatsApp: 'bg-badge-whatsapp-bg text-badge-whatsapp-text',
  Instagram: 'bg-badge-instagram-bg text-badge-instagram-text',
  Messenger: 'bg-badge-messenger-bg text-badge-messenger-text',
  Web: 'bg-badge-web-bg text-badge-web-text',
};

export function ConversationsView({
  workspace,
  onUpdateWorkspace,
  onOpenCustomer,
  onShowToast,
}: ConversationsViewProps) {
  const [channelFilter, setChannelFilter] = useState<'All' | OmnichannelThread['channel']>('All');
  const [search, setSearch] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    workspace.conversations[0]?.id ?? ''
  );
  const [replyText, setReplyText] = useState('');

  const filteredThreads = workspace.conversations.filter((t) => {
    if (channelFilter !== 'All' && t.channel !== channelFilter) return false;
    const q = search.trim().toLowerCase();
    if (
      q &&
      !t.customerName.toLowerCase().includes(q) &&
      !t.handle.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  const activeThread =
    filteredThreads.find((t) => t.id === selectedThreadId) ??
    filteredThreads[0] ??
    null;

  function selectThread(id: string) {
    setSelectedThreadId(id);
    onUpdateWorkspace((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === id ? { ...c, unread: false } : c
      ),
    }));
  }

  function handleSendReply(e: FormEvent) {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    const msg = replyText.trim();
    setReplyText('');

    onUpdateWorkspace((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === activeThread.id
          ? {
              ...c,
              lastUpdated: 'Just now',
              unread: false,
              messages: [
                ...c.messages,
                {
                  id: `cm-${Date.now()}`,
                  sender: 'Team',
                  time: 'Just now',
                  text: msg,
                },
              ],
            }
          : c
      ),
    }));

    onShowToast(`Reply sent via ${activeThread.channel}.`, 'success');
  }

  function handleStatusChange(status: OmnichannelThread['status']) {
    if (!activeThread) return;
    onUpdateWorkspace((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === activeThread.id ? { ...c, status } : c
      ),
    }));
    onShowToast(`Thread marked as "${status}".`, 'info');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            Omnichannel Conversations
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Unified WhatsApp, Instagram DM, Messenger, and Web Chat threads managed by AI and front-desk staff.
          </p>
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Left Thread List */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-surface-border flex flex-col">
          <div className="p-3.5 border-b border-surface-border space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer or handle..."
                className="w-full rounded-lg border border-surface-border bg-surface pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {(['All', 'WhatsApp', 'Instagram', 'Messenger', 'Web'] as const).map(
                (ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannelFilter(ch)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                      channelFilter === ch
                        ? 'bg-secondary text-white'
                        : 'bg-surface text-text-muted hover:text-on-surface'
                    }`}
                  >
                    {ch}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="divide-y divide-surface-border overflow-y-auto flex-1">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">
                No conversations match this channel filter.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = activeThread?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => selectThread(thread.id)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-surface-container-low'
                        : 'hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-semibold text-on-surface truncate">
                          {thread.customerName}
                        </span>
                        {thread.unread && (
                          <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-text-muted shrink-0">
                        {thread.lastUpdated}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold ${CHANNEL_BADGE[thread.channel]}`}
                      >
                        {thread.channel}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted">
                        {thread.status}
                      </span>
                    </div>

                    {lastMsg && (
                      <p className="text-[11px] text-text-muted line-clamp-1">
                        {lastMsg.text}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Thread */}
        <div className="lg:col-span-8 flex flex-col">
          {!activeThread ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-text-muted" />
              <p className="text-sm font-semibold text-on-surface">
                Select a conversation thread
              </p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3.5 border-b border-surface-border flex flex-wrap items-center justify-between gap-3 bg-surface/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-sm font-bold text-on-surface">
                      {activeThread.customerName}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${CHANNEL_BADGE[activeThread.channel]}`}
                    >
                      {activeThread.channel}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-text-muted">
                    {activeThread.handle} · Assigned: {activeThread.agentName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeThread.status}
                    onChange={(e) =>
                      handleStatusChange(
                        e.target.value as OmnichannelThread['status']
                      )
                    }
                    className="rounded-lg border border-surface-border bg-surface-card px-2.5 py-1.5 text-xs font-semibold text-on-surface"
                  >
                    <option value="AI Handling">AI Handling</option>
                    <option value="Booked">Booked</option>
                    <option value="Needs Human">Needs Human</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onOpenCustomer(activeThread.customerId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-surface-border bg-surface-card text-xs font-semibold text-secondary hover:bg-surface-container-low cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>CRM</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-5 space-y-3 overflow-y-auto bg-surface/30">
                {activeThread.messages.map((msg) => {
                  const isCustomer = msg.sender === 'Customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isCustomer ? 'items-start' : 'items-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                          isCustomer
                            ? 'bg-surface-card border-surface-border text-on-surface rounded-tl-xs'
                            : msg.sender === 'Team'
                            ? 'bg-primary text-white border-primary rounded-tr-xs'
                            : 'bg-secondary text-white border-secondary rounded-tr-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="font-mono text-[10px] text-text-muted mt-1 px-1">
                        {msg.sender} · {msg.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={handleSendReply}
                className="p-3.5 border-t border-surface-border bg-surface-card flex items-center gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply as team via ${activeThread.channel} (simulated)...`}
                  className="flex-1 rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
