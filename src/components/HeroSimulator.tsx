import { FormEvent, useEffect, useRef } from 'react';
import {
  ArrowLeftRight,
  BellRing,
  Bot,
  Calendar,
  Camera,
  CheckCircle2,
  Globe,
  Mail,
  MessageCircle,
  MessageSquareText,
  PhoneCall,
  Send,
  Sparkles,
} from 'lucide-react';
import { CHANNEL_META } from '../data/omnibookData';
import { BookingDetails, ChannelKey, ChatMessage, EventLogEntry } from '../types/omnibook';

interface HeroSimulatorProps {
  currentChannel: ChannelKey;
  messages: ChatMessage[];
  events: EventLogEntry[];
  isSlotCommitted: boolean;
  selectedSlotTime: '2:30 PM' | '4:15 PM';
  bookingDetails: BookingDetails;
  simInput: string;
  onSimInputChange: (val: string) => void;
  onSwitchChannel: (channel: ChannelKey) => void;
  onSendMessage: (e: FormEvent) => void;
  onConfirmInChatSlot: () => void;
  onSelectSlotTime: (slot: '2:30 PM' | '4:15 PM') => void;
  onResetSlot: () => void;
  onOpenBookingModal: () => void;
  onOpenOnboarding: (title: string) => void;
  onTriggerDemo: () => void;
  simInputRef: React.RefObject<HTMLInputElement | null>;
}

function renderChannelIcon(channel: ChannelKey, className = 'w-[18px] h-[18px]') {
  switch (channel) {
    case 'whatsapp':
      return <MessageSquareText className={className} />;
    case 'ig':
      return <Camera className={className} />;
    case 'messenger':
      return <MessageCircle className={className} />;
    case 'web':
      return <Globe className={className} />;
    case 'voice':
      return <PhoneCall className={className} />;
  }
}

function renderHighlightedText(text: string, highlights?: string[]) {
  if (!highlights || highlights.length === 0) return text;
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');
  const parts = text.split(regex);
  return parts.map((part, idx) =>
    highlights.includes(part) ? (
      <strong key={idx} className="text-secondary font-bold">
        {part}
      </strong>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function HeroSimulator({
  currentChannel,
  messages,
  events,
  isSlotCommitted,
  selectedSlotTime,
  bookingDetails,
  simInput,
  onSimInputChange,
  onSwitchChannel,
  onSendMessage,
  onConfirmInChatSlot,
  onSelectSlotTime,
  onResetSlot,
  onOpenBookingModal,
  onOpenOnboarding,
  onTriggerDemo,
  simInputRef,
}: HeroSimulatorProps) {
  const channelMeta = CHANNEL_META[currentChannel];
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, currentChannel]);

  const channelTabs: ChannelKey[] = ['whatsapp', 'ig', 'messenger', 'web', 'voice'];

  return (
    <section className="relative w-full overflow-hidden bg-surface py-12 lg:py-16 border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-badge-web-bg border border-channel-web/25 shadow-xs mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-channel-web opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-channel-web" />
          </span>
          <span className="font-mono text-xs uppercase text-badge-web-text font-bold tracking-wider">
            AI-POWERED CONSULTATION &amp; MEETING BOOKING
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-on-surface max-w-4xl tracking-tight leading-tight">
          Zero Missed Calls. Zero Lost Bookings.
          <br />
          <span className="text-secondary">24/7 AI Receptionist</span> across WhatsApp, Instagram, Messenger &amp; Web.
        </h1>

        {/* Subhead */}
        <p className="mt-5 text-base sm:text-lg text-text-muted text-center max-w-3xl leading-relaxed">
          Book consultations and scheduled meetings effortlessly via WhatsApp message, Instagram, Messenger, Phone, or Web Chat. Every confirmed schedule automatically sends an instant WhatsApp and email reminder.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onTriggerDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-accent-hover transition-all shadow-md shadow-secondary/25 cursor-pointer whitespace-nowrap"
          >
            <Bot className="w-5 h-5" />
            <span>Try Live Interactive Demo Agent</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenOnboarding('Schedule Practice Architecture Call')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-card border border-surface-border text-on-surface font-semibold hover:bg-surface-container-low transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-5 h-5 text-text-muted" />
            <span>Book Setup Call</span>
          </button>
        </div>

        {/* Social Proof Line */}
        <div className="mt-4 flex items-center gap-2 text-text-muted text-xs sm:text-sm text-center">
          <CheckCircle2 className="w-[18px] h-[18px] text-status-success shrink-0" />
          <span>
            Trusted by 1,200+ clinics, consultants &amp; practices •{' '}
            <strong className="text-on-surface font-semibold tabular-nums">
              Instant WhatsApp &amp; Email Reminders
            </strong>
          </span>
        </div>

        {/* Dual-Viewport Interactive Engine */}
        <div
          id="simulator"
          className="scroll-mt-20 mt-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* LEFT VIEWPORT: Multi-Channel Conversation Simulator */}
          <div className="lg:col-span-7 bg-surface-card rounded-2xl border border-surface-border shadow-xl p-5 sm:p-6 flex flex-col min-h-[580px]">
            {/* Channel Selector Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border flex-wrap gap-2">
              <span className="font-mono text-xs text-text-muted uppercase tracking-wider font-semibold">
                Live Agent Channel:
              </span>
              <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-lg flex-wrap">
                {channelTabs.map((key) => {
                  const meta = CHANNEL_META[key];
                  const isActive = currentChannel === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSwitchChannel(key)}
                      className={`px-2.5 py-1.5 rounded-md font-mono text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isActive ? meta.activeTabClass : 'text-text-muted hover:text-on-surface'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${meta.dotColorClass}`} />
                      {meta.tabLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Header */}
            <div className="flex items-center justify-between py-3 border-b border-surface-border/50 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full ${channelMeta.avatarClass} flex items-center justify-center shrink-0`}
                >
                  {renderChannelIcon(currentChannel)}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-sm font-bold text-on-surface truncate">
                    {channelMeta.headerTitle}
                  </div>
                  <div className="font-mono text-[11px] text-status-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="truncate">Active AI Orchestrator • Instant Sync</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-surface-container text-on-surface font-semibold whitespace-nowrap shrink-0 tabular-nums">
                {channelMeta.latencyLabel}
              </span>
            </div>

            {/* Message Stream */}
            <div ref={chatScrollRef} className="flex-1 space-y-3 py-4 overflow-y-auto max-h-[390px] pr-1">
              {messages.map((msg) => {
                if (msg.sender === 'customer') {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5 justify-end">
                      <div className="bg-secondary text-white rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[85%] shadow-xs">
                        <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                        <div className="text-[10px] text-blue-200 font-mono text-right mt-1">{msg.meta}</div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface shrink-0">
                        JD
                      </div>
                    </div>
                  );
                }

                if (msg.sender === 'ai') {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-surface-container-low text-on-surface rounded-2xl rounded-tl-xs px-4 py-2.5 max-w-[85%] border border-surface-border">
                        <p className="text-xs sm:text-sm leading-relaxed">
                          {renderHighlightedText(msg.text ?? '', msg.highlights)}
                        </p>
                        <div className="text-[10px] text-text-muted font-mono mt-1">{msg.meta}</div>
                      </div>
                    </div>
                  );
                }

                if (msg.sender === 'card' && msg.card) {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="bg-surface-card rounded-xl border border-surface-border shadow-md p-3.5 w-full max-w-[90%]">
                        <div className="flex items-center justify-between pb-2 border-b border-surface-border gap-2">
                          <span className="font-display text-xs font-bold text-on-surface flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-status-success" />
                            <span>{msg.meta}</span>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase whitespace-nowrap ${
                              isSlotCommitted
                                ? 'bg-status-success/15 text-status-success'
                                : 'bg-badge-web-bg text-badge-web-text'
                            }`}
                          >
                            {isSlotCommitted ? 'BOOKED + REMINDERS SENT' : 'Ready to Commit'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                          <div className="p-2 bg-surface-container-low rounded-lg">
                            <div className="font-mono text-[9px] uppercase text-text-muted">Consultation</div>
                            <div className="font-bold text-on-surface truncate">{bookingDetails.service}</div>
                          </div>
                          <div className="p-2 bg-surface-container-low rounded-lg">
                            <div className="font-mono text-[9px] uppercase text-text-muted">Specialist</div>
                            <div className="font-bold text-on-surface">{bookingDetails.practitioner}</div>
                          </div>
                          <div className="p-2 bg-surface-container-low rounded-lg">
                            <div className="font-mono text-[9px] uppercase text-text-muted">Meeting Slot</div>
                            <div className="font-bold text-on-surface tabular-nums">Thu • {selectedSlotTime}</div>
                          </div>
                          <div className="p-2 bg-surface-container-low rounded-lg">
                            <div className="font-mono text-[9px] uppercase text-text-muted">Auto-Reminders</div>
                            <div className="font-bold text-status-success truncate">WhatsApp + Email</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={onOpenBookingModal}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Review Details
                          </button>
                          <button
                            type="button"
                            onClick={onConfirmInChatSlot}
                            disabled={isSlotCommitted}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-white text-xs font-semibold transition-colors ${
                              isSlotCommitted
                                ? 'bg-status-success cursor-default'
                                : 'bg-secondary hover:bg-accent-hover cursor-pointer'
                            }`}
                          >
                            {isSlotCommitted ? 'Booked & Reminded ✓' : 'Confirm & Book Slot'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Simulator Quick Input Field */}
            <form
              onSubmit={onSendMessage}
              className="mt-auto pt-3 border-t border-surface-border flex items-center gap-2"
            >
              <input
                ref={simInputRef}
                type="text"
                value={simInput}
                onChange={(e) => onSimInputChange(e.target.value)}
                placeholder="Type custom reply (e.g., 'Book Friday consultation', 'Can I reschedule?')..."
                className="flex-1 bg-surface-container-low rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface border border-surface-border focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                aria-label="Send simulated message"
                className="w-9 h-9 rounded-lg bg-secondary text-white flex items-center justify-center shrink-0 hover:bg-accent-hover transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* RIGHT VIEWPORT: Scheduler Sync Engine & Reminder Dispatch */}
          <div className="lg:col-span-5 bg-surface-card rounded-2xl border border-surface-border shadow-xl p-5 sm:p-6 flex flex-col min-h-[580px]">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-channel-web" />
                <span className="font-display text-sm font-bold text-on-surface">
                  Scheduler Sync Live Engine
                </span>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-badge-web-bg text-badge-web-text font-bold flex items-center gap-1 tabular-nums">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> 24ms
              </span>
            </div>

            {/* Provider Connection Metadata */}
            <div className="bg-surface-container-low rounded-xl p-3 my-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded bg-white flex items-center justify-center font-bold text-xs text-primary shadow-xs shrink-0">
                  MB
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-on-surface truncate">Mindbody / Google Cal API</div>
                  <div className="font-mono text-[10px] text-text-muted truncate">
                    Bi-directional zero shadow lock
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-status-success/15 text-status-success whitespace-nowrap shrink-0">
                {isSlotCommitted ? 'ZERO SHADOW LOCK (24ms)' : 'SYNC READY'}
              </span>
            </div>

            {/* Visual Timeline */}
            <div className="flex items-center justify-between font-mono text-[11px] text-text-muted uppercase mb-2">
              <span>Thursday, Oct 24</span>
              <div className="flex items-center gap-2">
                <span>Room #3 (Consult)</span>
                {isSlotCommitted && (
                  <button
                    type="button"
                    onClick={onResetSlot}
                    className="text-[10px] text-secondary hover:underline lowercase font-semibold cursor-pointer"
                  >
                    reset
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs flex-1">
              {/* Slot 1 */}
              <div className="flex items-center gap-2">
                <span className="w-14 font-mono text-[11px] text-text-muted tabular-nums shrink-0">1:00 PM</span>
                <div className="flex-1 bg-surface-container rounded-lg p-2 text-text-muted flex items-center justify-between">
                  <span>Sarah J. • Consultation</span>
                  <span className="font-mono text-[10px]">Completed</span>
                </div>
              </div>

              {/* Sanitization Buffer */}
              <div className="flex items-center gap-2 pl-16">
                <div className="w-full py-1 px-2.5 rounded bg-amber-50 border border-dashed border-status-warning/40 text-[10px] font-mono text-amber-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-status-warning shrink-0" />
                  <span>Auto-Buffer: 15-min Turnover</span>
                </div>
              </div>

              {/* Slot 2 (2:30 PM) */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-14 font-mono text-[11px] tabular-nums shrink-0 ${
                    selectedSlotTime === '2:30 PM' ? 'font-bold text-secondary' : 'text-text-muted'
                  }`}
                >
                  2:30 PM
                </span>
                {selectedSlotTime === '2:30 PM' ? (
                  <div className="flex-1 bg-badge-web-bg border-2 border-channel-web rounded-lg p-2.5 shadow-xs relative overflow-hidden transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-badge-web-text text-xs truncate">
                        {bookingDetails.service}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white whitespace-nowrap ${
                          isSlotCommitted ? 'bg-status-success' : 'bg-channel-web'
                        }`}
                      >
                        {isSlotCommitted ? 'CALENDAR COMMITTED' : 'AI LOCKED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5 truncate">
                      <span>Client: {bookingDetails.clientName}</span>
                      <span>•</span>
                      <span>{channelMeta.sourceLabel}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectSlotTime('2:30 PM')}
                    className="flex-1 text-left border border-dashed border-surface-border hover:border-secondary rounded-lg p-2 text-text-muted flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Available Open Slot</span>
                    <span className="font-mono text-[10px] text-secondary">Switch to 2:30 PM</span>
                  </button>
                )}
              </div>

              {/* Sanitization Buffer */}
              <div className="flex items-center gap-2 pl-16">
                <div className="w-full py-1 px-2.5 rounded bg-amber-50 border border-dashed border-status-warning/40 text-[10px] font-mono text-amber-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-status-warning shrink-0" />
                  <span>Auto-Buffer: 15-min Turnover</span>
                </div>
              </div>

              {/* Slot 3 (4:15 PM) */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-14 font-mono text-[11px] tabular-nums shrink-0 ${
                    selectedSlotTime === '4:15 PM' ? 'font-bold text-secondary' : 'text-text-muted'
                  }`}
                >
                  4:15 PM
                </span>
                {selectedSlotTime === '4:15 PM' ? (
                  <div className="flex-1 bg-badge-web-bg border-2 border-channel-web rounded-lg p-2.5 shadow-xs relative overflow-hidden transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-badge-web-text text-xs truncate">
                        {bookingDetails.service}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white whitespace-nowrap ${
                          isSlotCommitted ? 'bg-status-success' : 'bg-channel-web'
                        }`}
                      >
                        {isSlotCommitted ? 'CALENDAR COMMITTED' : 'AI LOCKED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5 truncate">
                      <span>Client: {bookingDetails.clientName}</span>
                      <span>•</span>
                      <span>{channelMeta.sourceLabel}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectSlotTime('4:15 PM')}
                    disabled={isSlotCommitted}
                    className={`flex-1 text-left border border-dashed border-surface-border rounded-lg p-2 text-text-muted flex items-center justify-between transition-colors ${
                      isSlotCommitted ? 'opacity-60 cursor-default' : 'hover:border-secondary cursor-pointer'
                    }`}
                  >
                    <span>Available Open Slot</span>
                    <span className="font-mono text-[10px] text-secondary">Suggested by AI</span>
                  </button>
                )}
              </div>

              {/* Automated WhatsApp & Email Reminder Dispatch Card */}
              <div
                className={`mt-2 rounded-xl border p-2.5 transition-colors ${
                  isSlotCommitted
                    ? 'bg-badge-whatsapp-bg/60 border-channel-whatsapp/30'
                    : 'bg-surface-container-low border-surface-border'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold mb-1.5">
                  <span className="flex items-center gap-1 text-on-surface">
                    <BellRing className="w-3.5 h-3.5 text-secondary" />
                    Automated Reminder Dispatch
                  </span>
                  <span className={isSlotCommitted ? 'text-status-success' : 'text-text-muted'}>
                    {isSlotCommitted ? 'DELIVERED ✓' : 'ARMED ON BOOKING'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-2 py-1.5 border border-surface-border/60 min-w-0">
                    <MessageSquareText className="w-3.5 h-3.5 text-channel-whatsapp shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-on-surface leading-none">WhatsApp</div>
                      <div className="font-mono text-[9px] text-text-muted truncate mt-0.5">
                        {bookingDetails.sendWhatsAppReminder
                          ? isSlotCommitted
                            ? `Sent to ${bookingDetails.clientPhone}`
                            : bookingDetails.clientPhone
                          : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-2 py-1.5 border border-surface-border/60 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-on-surface leading-none">Email</div>
                      <div className="font-mono text-[9px] text-text-muted truncate mt-0.5">
                        {bookingDetails.sendEmailReminder
                          ? isSlotCommitted
                            ? `Sent to ${bookingDetails.clientEmail}`
                            : bookingDetails.clientEmail
                          : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Realtime Event Stream */}
            <div className="mt-4 pt-3 border-t border-surface-border">
              <div className="font-mono text-[10px] uppercase text-text-muted tracking-wider mb-1.5 flex items-center justify-between">
                <span>Realtime Event Stream</span>
                <span className="text-status-success font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-ping" /> Live
                </span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2.5 font-mono text-[10px] space-y-1 text-on-surface max-h-[85px] overflow-y-auto tabular-nums">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`flex items-center justify-between gap-2 ${
                      ev.tone === 'success'
                        ? 'text-status-success font-medium'
                        : ev.tone === 'secondary'
                        ? 'text-secondary font-medium'
                        : 'text-text-muted'
                    }`}
                  >
                    <span className="truncate">
                      [{ev.timestamp}] {ev.code}
                    </span>
                    <span className="shrink-0">{ev.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
