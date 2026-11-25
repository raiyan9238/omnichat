import { FormEvent, useMemo, useState } from 'react';
import {
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquareText,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { ToastType } from '../types/omnibook';

interface BookAppointmentSectionProps {
  onShowToast: (message: string, type?: ToastType) => void;
  onAppointmentBooked: (summary: {
    name: string;
    dateLabel: string;
    timeSlot: string;
    whatsapp: string;
    email: string;
  }) => void;
}

const MEETING_TYPES = [
  { id: 'quote', label: '15m Discovery & Custom Quote', duration: '15 min' },
  { id: 'demo', label: '30m Live Practice Demo', duration: '30 min' },
  { id: 'arch', label: '45m Multi-Channel Setup', duration: '45 min' },
] as const;

const TIME_SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '4:45 PM', '6:00 PM'];

const CHANNEL_OPTIONS = ['WhatsApp', 'Instagram DM', 'Messenger', 'Web Chat', 'Voice Call'];

function getUpcomingDays(): { id: string; dayName: string; dateLabel: string }[] {
  const days: { id: string; dayName: string; dateLabel: string }[] = [];
  const cursor = new Date();
  while (days.length < 5) {
    cursor.setDate(cursor.getDate() + 1);
    const dayOfWeek = cursor.getDay();
    if (dayOfWeek !== 0) {
      const dayName = cursor.toLocaleDateString('en-US', { weekday: 'short' });
      const dateLabel = cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({
        id: cursor.toISOString().split('T')[0],
        dayName,
        dateLabel,
      });
    }
  }
  return days;
}

export function BookAppointmentSection({
  onShowToast,
  onAppointmentBooked,
}: BookAppointmentSectionProps) {
  const upcomingDays = useMemo(() => getUpcomingDays(), []);

  const [meetingType, setMeetingType] = useState<string>(MEETING_TYPES[0].id);
  const [selectedDayId, setSelectedDayId] = useState<string>(upcomingDays[0]?.id ?? 'day-1');
  const [selectedTime, setSelectedTime] = useState<string>('2:00 PM');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['WhatsApp', 'Instagram DM']);

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState<{
    token: string;
    meetingLabel: string;
    dateLabel: string;
    time: string;
    name: string;
    business: string;
    email: string;
    whatsapp: string;
  } | null>(null);

  const activeDay = upcomingDays.find((d) => d.id === selectedDayId) ?? upcomingDays[0];
  const activeMeeting = MEETING_TYPES.find((m) => m.id === meetingType) ?? MEETING_TYPES[0];

  function toggleChannel(channel: string) {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? (prev.length > 1 ? prev.filter((c) => c !== channel) : prev) : [...prev, channel]
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !businessName.trim() || !email.trim() || !whatsapp.trim()) return;

    const token = `OB-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateText = `${activeDay.dayName}, ${activeDay.dateLabel}`;

    setConfirmedBooking({
      token,
      meetingLabel: activeMeeting.label,
      dateLabel: dateText,
      time: selectedTime,
      name: fullName.trim(),
      business: businessName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
    });

    onAppointmentBooked({
      name: fullName.trim(),
      dateLabel: dateText,
      timeSlot: selectedTime,
      whatsapp: whatsapp.trim(),
      email: email.trim(),
    });

    onShowToast(
      `Appointment booked for ${dateText} at ${selectedTime}! WhatsApp & Email reminders sent.`,
      'success'
    );
  }

  function handleBookAnother() {
    setConfirmedBooking(null);
    setFullName('');
    setBusinessName('');
    setEmail('');
    setWhatsapp('');
    setNotes('');
  }

  return (
    <section
      id="book-appointment"
      className="scroll-mt-16 w-full py-16 lg:py-24 bg-surface-container-lowest border-b border-surface-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="font-mono text-xs uppercase text-secondary font-bold tracking-wider mb-2">
            Custom Tailored Pricing &amp; Setup
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Book an Appointment With Our Team
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            We tailor every deployment and pricing plan to your exact channels and volume. Schedule a 1-on-1 meeting below—your confirmation and reminders will be sent automatically via WhatsApp and email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Meeting Type, Date & Time Slot Selector */}
          <div className="lg:col-span-5 bg-surface-card rounded-2xl border border-surface-border p-6 shadow-sm space-y-5">
            <div>
              <div className="font-mono text-[11px] uppercase text-text-muted font-bold tracking-wider mb-2.5 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-secondary" />
                <span>1. Select Consultation Type</span>
              </div>
              <div className="space-y-2">
                {MEETING_TYPES.map((type) => {
                  const active = meetingType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setMeetingType(type.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? 'bg-surface-container-low border-secondary text-on-surface shadow-xs'
                          : 'bg-surface-card border-surface-border text-text-muted hover:border-secondary/40 hover:text-on-surface'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">{type.label}</span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-surface-border text-secondary font-bold tabular-nums">
                        {type.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="font-mono text-[11px] uppercase text-text-muted font-bold tracking-wider mb-2.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>2. Choose Date</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {upcomingDays.map((day) => {
                  const active = selectedDayId === day.id;
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setSelectedDayId(day.id)}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        active
                          ? 'bg-secondary border-secondary text-white shadow-sm'
                          : 'bg-surface-container-low border-surface-border text-on-surface hover:border-secondary/50'
                      }`}
                    >
                      <div className={`font-mono text-[10px] uppercase ${active ? 'text-blue-100' : 'text-text-muted'}`}>
                        {day.dayName}
                      </div>
                      <div className="text-xs font-bold mt-0.5 tabular-nums">{day.dateLabel}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="font-mono text-[11px] uppercase text-text-muted font-bold tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary" />
                <span>3. Pick Available Time (EST)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-2 rounded-lg border font-mono text-xs font-semibold transition-all cursor-pointer tabular-nums ${
                        active
                          ? 'bg-badge-web-bg border-channel-web text-badge-web-text shadow-xs'
                          : 'bg-surface-card border-surface-border text-text-main hover:border-secondary/50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-badge-whatsapp-bg/60 border border-channel-whatsapp/30 text-xs text-badge-whatsapp-text flex items-start gap-2">
              <BellRing className="w-4 h-4 text-channel-whatsapp shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Instant Reminder Guarantee:</strong> Once booked, you immediately receive a WhatsApp confirmation + calendar reminder by email.
              </div>
            </div>
          </div>

          {/* RIGHT: Booking Form or Confirmation View */}
          <div className="lg:col-span-7 bg-surface-card rounded-2xl border border-surface-border p-6 sm:p-8 shadow-md">
            {confirmedBooking ? (
              <div className="py-4 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-status-success/15 text-status-success mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase text-status-success font-bold tracking-wider">
                    Appointment Confirmed • {confirmedBooking.token}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-on-surface mt-1">
                    See You on {confirmedBooking.dateLabel} at {confirmedBooking.time}!
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-md mx-auto">
                    We have reserved <strong className="text-on-surface">{confirmedBooking.meetingLabel}</strong> for{' '}
                    <strong className="text-on-surface">{confirmedBooking.business}</strong> to prepare your custom pricing &amp; setup plan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                  <div className="p-3.5 rounded-xl bg-badge-whatsapp-bg/60 border border-channel-whatsapp/30 flex items-center gap-3">
                    <MessageSquareText className="w-5 h-5 text-channel-whatsapp shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-on-surface">WhatsApp Reminder Sent</div>
                      <div className="font-mono text-[10px] text-text-muted truncate tabular-nums">
                        {confirmedBooking.whatsapp}
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-border flex items-center gap-3">
                    <Mail className="w-5 h-5 text-secondary shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-on-surface">Email Reminder Sent</div>
                      <div className="font-mono text-[10px] text-text-muted truncate">
                        {confirmedBooking.email}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookAnother}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                >
                  Schedule Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-border">
                  <div>
                    <h3 className="font-display text-lg font-bold text-on-surface">
                      Your Details &amp; Custom Quote Preferences
                    </h3>
                    <p className="font-mono text-[11px] text-text-muted mt-0.5 tabular-nums">
                      Selected: <span className="text-secondary font-semibold">{activeMeeting.label}</span> •{' '}
                      <span className="text-on-surface font-semibold">
                        {activeDay.dayName}, {activeDay.dateLabel} @ {selectedTime}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appt-name" className="block text-xs font-semibold text-on-surface mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="appt-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label htmlFor="appt-business" className="block text-xs font-semibold text-on-surface mb-1">
                      Company / Practice Name
                    </label>
                    <input
                      id="appt-business"
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Rivera Wellness Clinic"
                      className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appt-whatsapp" className="block text-xs font-semibold text-on-surface mb-1">
                      WhatsApp Number (For Reminder)
                    </label>
                    <input
                      id="appt-whatsapp"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label htmlFor="appt-email" className="block text-xs font-semibold text-on-surface mb-1">
                      Email Address (For Reminder &amp; Quote)
                    </label>
                    <input
                      id="appt-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-on-surface mb-2">
                    Channels You Want to Automate
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CHANNEL_OPTIONS.map((ch) => {
                      const active = selectedChannels.includes(ch);
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => toggleChannel(ch)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            active
                              ? 'bg-secondary/10 border-secondary text-secondary'
                              : 'bg-surface-container-low border-surface-border text-text-muted hover:text-on-surface'
                          }`}
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="appt-notes" className="block text-xs font-semibold text-on-surface mb-1">
                    Workflow &amp; Custom Pricing Notes (Optional)
                  </label>
                  <textarea
                    id="appt-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share your monthly booking volume, number of locations, or calendar tool..."
                    className="w-full bg-surface-container-low border border-surface-border rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-secondary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-secondary hover:bg-accent-hover text-white font-semibold text-sm shadow-md shadow-secondary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book Appointment &amp; Get Custom Pricing</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
