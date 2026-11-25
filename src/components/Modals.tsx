import { FormEvent, useState } from 'react';
import {
  BadgeCheck,
  BellRing,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  CreditCard,
  Flower2,
  Globe,
  Info,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Pencil,
  PhoneCall,
  User,
  X,
  Zap,
} from 'lucide-react';
import { CHANNEL_DETAILS } from '../data/omnibookData';
import { BookingDetails, ChannelDetailInfo, ChannelKey, ToastType } from '../types/omnibook';

interface BookingModalProps {
  open: boolean;
  step: 'review' | 'confirmed';
  selectedSlotTime: '2:30 PM' | '4:15 PM';
  bookingDetails: BookingDetails;
  onUpdateBookingDetails: (next: BookingDetails) => void;
  onClose: () => void;
  onConfirm: () => void;
  onReset: () => void;
}

export function BookingSummaryModal({
  open,
  step,
  selectedSlotTime,
  bookingDetails,
  onUpdateBookingDetails,
  onClose,
  onConfirm,
  onReset,
}: BookingModalProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<BookingDetails>(bookingDetails);

  if (!open) return null;

  function startEditing() {
    setDraft(bookingDetails);
    setEditing(true);
  }

  function handleSaveDraft(e: FormEvent) {
    e.preventDefault();
    onUpdateBookingDetails(draft);
    setEditing(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setEditing(false);
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface-card rounded-2xl border border-surface-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-container-lowest">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-badge-web-bg text-badge-web-text flex items-center justify-center">
              <CheckCircle2 className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 id="booking-modal-title" className="font-display text-sm font-bold text-on-surface">
                Pre-Booking Summary Review
              </h3>
              <p className="font-mono text-[10px] text-text-muted">
                Specification Section 6.1 • Consultation &amp; Reminder Parity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              onClose();
            }}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'review' ? (
          editing ? (
            <form onSubmit={handleSaveDraft} className="p-6 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-[11px] text-secondary font-bold uppercase tracking-wider">
                  Modify Consultation &amp; Reminder Details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="edit-client-name" className="block font-semibold text-on-surface mb-1">
                    Client Name
                  </label>
                  <input
                    id="edit-client-name"
                    type="text"
                    required
                    value={draft.clientName}
                    onChange={(e) => setDraft({ ...draft, clientName: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label htmlFor="edit-service" className="block font-semibold text-on-surface mb-1">
                    Consultation / Meeting
                  </label>
                  <input
                    id="edit-service"
                    type="text"
                    required
                    value={draft.service}
                    onChange={(e) => setDraft({ ...draft, service: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="block font-semibold text-on-surface mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    id="edit-phone"
                    type="tel"
                    required
                    value={draft.clientPhone}
                    onChange={(e) => setDraft({ ...draft, clientPhone: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label htmlFor="edit-email" className="block font-semibold text-on-surface mb-1">
                    Email Address
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    required
                    value={draft.clientEmail}
                    onChange={(e) => setDraft({ ...draft, clientEmail: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-border space-y-2 text-xs">
                <div className="font-mono text-[10px] uppercase text-text-muted font-bold">
                  Automated Reminders on Confirmation
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.sendWhatsAppReminder}
                    onChange={(e) => setDraft({ ...draft, sendWhatsAppReminder: e.target.checked })}
                    className="rounded border-surface-border text-secondary focus:ring-0"
                  />
                  <span>Send WhatsApp confirmation &amp; meeting reminder</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.sendEmailReminder}
                    onChange={(e) => setDraft({ ...draft, sendEmailReminder: e.target.checked })}
                    className="rounded border-surface-border text-secondary focus:ring-0"
                  />
                  <span>Send Email confirmation &amp; calendar invite</span>
                </label>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-[11px] text-secondary font-bold uppercase tracking-wider">
                  Consultation &amp; Meeting Details
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-badge-web-bg text-badge-web-text font-bold">
                  READY TO COMMIT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-surface-container-low rounded-xl">
                  <div className="font-mono text-[9px] uppercase text-text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                  <div className="font-bold text-on-surface mt-0.5">{bookingDetails.location}</div>
                  <div className="font-mono text-[10px] text-text-muted">{bookingDetails.branch}</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-xl">
                  <div className="font-mono text-[9px] uppercase text-text-muted flex items-center gap-1">
                    <Flower2 className="w-3 h-3" /> Service
                  </div>
                  <div className="font-bold text-on-surface mt-0.5 truncate">{bookingDetails.service}</div>
                  <div className="font-mono text-[10px] text-text-muted">{bookingDetails.duration}</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-xl">
                  <div className="font-mono text-[9px] uppercase text-text-muted flex items-center gap-1">
                    <User className="w-3 h-3" /> Practitioner
                  </div>
                  <div className="font-bold text-on-surface mt-0.5">
                    {bookingDetails.practitioner}
                  </div>
                  <div className="font-mono text-[10px] text-status-success font-semibold">
                    {bookingDetails.practitionerNote}
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-xl">
                  <div className="font-mono text-[9px] uppercase text-text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date &amp; Time
                  </div>
                  <div className="font-bold text-on-surface mt-0.5">{bookingDetails.date}</div>
                  <div className="font-mono text-[10px] text-secondary font-bold tabular-nums">
                    {selectedSlotTime} EST
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-surface-container-low rounded-xl min-w-0">
                  <div className="font-mono text-[9px] uppercase text-text-muted flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Client &amp; WhatsApp
                  </div>
                  <div className="font-bold text-on-surface mt-0.5 truncate">{bookingDetails.clientName}</div>
                  <div className="font-mono text-[10px] text-text-muted tabular-nums truncate">
                    {bookingDetails.clientPhone}
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-xl min-w-0">
                  <div className="font-mono text-[9px] uppercase text-text-muted flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Fee &amp; Email
                  </div>
                  <div className="font-extrabold text-secondary text-sm mt-0.5 tabular-nums">
                    {bookingDetails.price}
                  </div>
                  <div className="font-mono text-[10px] text-text-muted truncate">
                    {bookingDetails.clientEmail}
                  </div>
                </div>
              </div>

              <div className="bg-badge-whatsapp-bg/60 text-badge-whatsapp-text border border-channel-whatsapp/30 rounded-xl p-2.5 text-xs flex items-start gap-2">
                <BellRing className="w-[17px] h-[17px] text-channel-whatsapp shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Instant Reminders Armed:</strong> Booking confirmation &amp; reminders will be sent to{' '}
                  <span className="font-mono font-semibold">{bookingDetails.clientPhone}</span> (WhatsApp) and{' '}
                  <span className="font-mono font-semibold">{bookingDetails.clientEmail}</span> (Email).
                </div>
              </div>

              <div className="bg-amber-50 text-amber-900 border border-status-warning/40 rounded-xl p-2.5 text-xs flex items-start gap-2">
                <Info className="w-[17px] h-[17px] text-status-warning shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">24h Cancellation Window:</strong> Free rescheduling or
                  cancel up to 24h prior without cancellation fee.
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Modify Details</span>
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Book Slot</span>
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="p-6 text-center space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-status-success/15 text-status-success mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display text-lg font-bold text-on-surface">
              Schedule Confirmed &amp; Reminders Sent!
            </h4>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Committed into Google Calendar &amp; Mindbody. Automated reminders have been dispatched via WhatsApp and Email.
            </p>
            <div className="bg-surface-container-low rounded-xl p-3 text-left font-mono text-[10px] space-y-1.5 border border-surface-border tabular-nums">
              <div className="flex justify-between">
                <span className="text-text-muted">Token:</span>
                <span className="font-bold text-on-surface">{bookingDetails.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Consultation:</span>
                <span className="font-bold text-on-surface">
                  {bookingDetails.service} ({bookingDetails.room})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Schedule:</span>
                <span className="font-bold text-secondary">
                  {bookingDetails.date} @ {selectedSlotTime} EST
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">WhatsApp Reminder:</span>
                <span className="font-bold text-status-success">
                  {bookingDetails.sendWhatsAppReminder
                    ? `Sent → ${bookingDetails.clientPhone}`
                    : 'Not enabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Email Reminder:</span>
                <span className="font-bold text-status-success">
                  {bookingDetails.sendEmailReminder
                    ? `Sent → ${bookingDetails.clientEmail}`
                    : 'Not enabled'}
                </span>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Review Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function SignInModal({ open, onClose, onShowToast }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setPassword('');
    onClose();
    onShowToast('Authenticated! Welcome back to OmniBook Practice Console.', 'success');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div className="relative w-full max-w-md bg-surface-card rounded-2xl border border-surface-border shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" />
            <h3 id="signin-modal-title" className="font-display text-base font-bold text-on-surface">
              Sign In to OmniBook
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="text-text-muted hover:text-on-surface cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="signin-email" className="block text-xs font-semibold text-on-surface mb-1">
              Clinic Work Email
            </label>
            <input
              id="signin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@apexmedspa.com"
              className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label htmlFor="signin-password" className="block text-xs font-semibold text-on-surface mb-1">
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-surface-border text-secondary focus:ring-0"
              />
              <span>Remember terminal</span>
            </label>
            <button
              type="button"
              onClick={() => onShowToast('Password reset link sent.', 'info')}
              className="text-secondary hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm cursor-pointer"
          >
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
}

interface OnboardingModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export function OnboardingModal({ open, title, onClose, onShowToast }: OnboardingModalProps) {
  const [fullName, setFullName] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [scheduler, setScheduler] = useState('Mindbody');
  const [phone, setPhone] = useState('');

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !practiceName.trim() || !workEmail.trim() || !phone.trim()) return;
    setFullName('');
    setPracticeName('');
    setWorkEmail('');
    setPhone('');
    onClose();
    onShowToast(
      `Sandbox provisioned for ${practiceName} (${scheduler})! WhatsApp & Email reminders ready.`,
      'success'
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface-card rounded-2xl border border-surface-border shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div>
            <h3 id="onboarding-modal-title" className="font-display text-base font-bold text-on-surface">
              {title}
            </h3>
            <p className="font-mono text-[10px] text-text-muted">
              WhatsApp, Instagram, Web &amp; Email Reminders • No credit card required
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close onboarding modal"
            className="text-text-muted hover:text-on-surface cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="onb-name" className="block text-xs font-semibold text-on-surface mb-1">
                Full Name
              </label>
              <input
                id="onb-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="onb-practice" className="block text-xs font-semibold text-on-surface mb-1">
                Practice / Business Name
              </label>
              <input
                id="onb-practice"
                type="text"
                required
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                placeholder="Rivera Aesthetics"
                className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="onb-email" className="block text-xs font-semibold text-on-surface mb-1">
                Work Email (For Email Reminders)
              </label>
              <input
                id="onb-email"
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="alex@riveraaesthetics.com"
                className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="onb-scheduler" className="block text-xs font-semibold text-on-surface mb-1">
                Primary Scheduler
              </label>
              <select
                id="onb-scheduler"
                value={scheduler}
                onChange={(e) => setScheduler(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                <option>Mindbody</option>
                <option>Google Calendar</option>
                <option>Outlook 365</option>
                <option>Jane App</option>
                <option>Acuity</option>
                <option>Epic EHR / Cerner</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="onb-phone" className="block text-xs font-semibold text-on-surface mb-1">
              WhatsApp / Phone Number
            </label>
            <input
              id="onb-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-surface-container-low text-xs text-text-muted flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary shrink-0" />
            <span>We will provision your WhatsApp, Instagram &amp; Email reminder workflow in under 60 seconds.</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm cursor-pointer"
          >
            Activate Agent Sandbox
          </button>
        </form>
      </div>
    </div>
  );
}

interface ChannelModalProps {
  channelKey: ChannelDetailInfo['key'] | null;
  onClose: () => void;
  onTestInSimulator: (simKey: ChannelKey, title: string) => void;
}

export function ChannelModal({ channelKey, onClose, onTestInSimulator }: ChannelModalProps) {
  if (!channelKey) return null;
  const info = CHANNEL_DETAILS.find((c) => c.key === channelKey) ?? CHANNEL_DETAILS[0];

  const Icon =
    info.key === 'whatsapp'
      ? MessageSquareText
      : info.key === 'voice'
      ? PhoneCall
      : info.key === 'messenger'
      ? MessageCircle
      : info.key === 'instagram'
      ? Camera
      : Globe;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="channel-modal-title"
    >
      <div className="relative w-full max-w-md bg-surface-card rounded-2xl border border-surface-border shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-bold">
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 id="channel-modal-title" className="font-display text-base font-bold text-on-surface">
                {info.title}
              </h3>
              <span className="font-mono text-[10px] text-secondary font-bold uppercase">
                {info.tag}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close channel modal"
            className="text-text-muted hover:text-on-surface cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-text-muted leading-relaxed">{info.desc}</p>
          <div className="bg-surface-container-low p-3 rounded-xl border border-surface-border text-xs space-y-2 tabular-nums">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-text-muted">Response Latency:</span>
              <span className="font-bold text-on-surface">{info.latency}</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-text-muted">Protocol:</span>
              <span className="font-bold text-on-surface">{info.protocol}</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-text-muted">Auto-Reminders:</span>
              <span className="font-bold text-status-success">WhatsApp + Email</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onTestInSimulator(info.simKey, info.title)}
            className="flex-1 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Test In Simulator
          </button>
        </div>
      </div>
    </div>
  );
}

interface RoiReportModalProps {
  open: boolean;
  calls: number;
  ticket: number;
  onClose: () => void;
  onClaimPlan: () => void;
}

export function RoiReportModal({
  open,
  calls,
  ticket,
  onClose,
  onClaimPlan,
}: RoiReportModalProps) {
  if (!open) return null;

  const rescued = Math.round(calls * 0.168);
  const revenue = rescued * ticket;
  const hoursSaved = Math.round((calls * 4.5) / 60);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="roi-modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface-card rounded-2xl border border-surface-border shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div>
            <h3 id="roi-modal-title" className="font-display text-base font-bold text-on-surface">
              Custom Practice ROI Executive Brief
            </h3>
            <p className="font-mono text-[10px] text-text-muted">
              Generated via OmniBook Algorithmic Recovery Model
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ROI brief"
            className="text-text-muted hover:text-on-surface cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <div className="font-mono text-[9px] uppercase text-text-muted">Bookings Rescued</div>
              <div className="font-display text-xl font-extrabold text-secondary mt-1">
                +{rescued} / mo
              </div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <div className="font-mono text-[9px] uppercase text-text-muted">Revenue Lift</div>
              <div className="font-display text-xl font-extrabold text-status-success mt-1">
                +${revenue.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <div className="font-mono text-[9px] uppercase text-text-muted">Desk Hours Saved</div>
              <div className="font-display text-xl font-extrabold text-on-surface mt-1">
                {hoursSaved} hrs / wk
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <strong>Executive Takeaway:</strong> With OmniBook active 24/7 across WhatsApp, Instagram, Phone &amp; Web, your practice recaptures an average of 16.8% in missed consultation revenue and sends automated WhatsApp &amp; email reminders for every booking.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={onClaimPlan}
            className="flex-1 py-2.5 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm cursor-pointer"
          >
            Book Custom Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
