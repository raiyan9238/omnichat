import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ChannelsSection } from './components/ChannelsSection';
import { CtaSection } from './components/CtaSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { HeroSimulator } from './components/HeroSimulator';
import { IntegrationsSection } from './components/IntegrationsSection';
import {
  BookingSummaryModal,
  ChannelModal,
  OnboardingModal,
  RoiReportModal,
  SignInModal,
} from './components/Modals';
import { BookAppointmentSection } from './components/BookAppointmentSection';
import { Navbar } from './components/Navbar';
import { RoiCalculator } from './components/RoiCalculator';
import { Toast } from './components/Toast';
import {
  CHANNEL_META,
  DEFAULT_BOOKING_DETAILS,
  INITIAL_EVENTS,
  INITIAL_MESSAGES,
} from './data/omnibookData';
import {
  BookingDetails,
  ChannelDetailInfo,
  ChannelKey,
  ChatMessage,
  EventLogEntry,
  ToastState,
  ToastType,
} from './types/omnibook';

function getCurrentTimeStamp(): string {
  return new Date().toTimeString().split(' ')[0];
}

export default function App() {
  const [currentChannel, setCurrentChannel] = useState<ChannelKey>('whatsapp');
  const [messagesByChannel, setMessagesByChannel] =
    useState<Record<ChannelKey, ChatMessage[]>>(INITIAL_MESSAGES);
  const [events, setEvents] = useState<EventLogEntry[]>(INITIAL_EVENTS);
  const [isSlotCommitted, setIsSlotCommitted] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<'2:30 PM' | '4:15 PM'>('2:30 PM');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(DEFAULT_BOOKING_DETAILS);
  const [simInput, setSimInput] = useState('');

  // ROI state
  const [calls, setCalls] = useState(500);
  const [ticket, setTicket] = useState(120);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingModalStep, setBookingModalStep] = useState<'review' | 'confirmed'>('review');
  const [signInOpen, setSignInOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingTitle, setOnboardingTitle] = useState('Start 14-Day Free Practice Trial');
  const [activeChannelModal, setActiveChannelModal] = useState<ChannelDetailInfo['key'] | null>(null);
  const [roiModalOpen, setRoiModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });
  const toastTimerRef = useRef<number | null>(null);
  const simInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ visible: true, message, type });
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3600);
  }, []);

  const appendEvent = useCallback(
    (code: string, status: string, tone: EventLogEntry['tone'] = 'secondary') => {
      setEvents((prev) => [
        {
          id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: getCurrentTimeStamp(),
          code,
          status,
          tone,
        },
        ...prev.slice(0, 14),
      ]);
    },
    []
  );

  // Global ESC key handler for closing modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBookingModalOpen(false);
        setSignInOpen(false);
        setOnboardingOpen(false);
        setActiveChannelModal(null);
        setRoiModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSwitchChannel = useCallback(
    (channel: ChannelKey) => {
      setCurrentChannel(channel);
      const meta = CHANNEL_META[channel];
      appendEvent(meta.eventCode, meta.eventStatus, 'secondary');
    },
    [appendEvent]
  );

  const handleConfirmInChatSlot = useCallback(() => {
    setIsSlotCommitted(true);
    appendEvent('ATOMIC_MUTEX_LOCK_COMMITTED', 'SLOT_LOCKED_#8841-B', 'success');
    if (bookingDetails.sendWhatsAppReminder) {
      appendEvent('WHATSAPP_REMINDER_DISPATCHED', bookingDetails.clientPhone, 'success');
    }
    if (bookingDetails.sendEmailReminder) {
      appendEvent('EMAIL_REMINDER_DISPATCHED', bookingDetails.clientEmail, 'secondary');
    }

    const activeReminders = [
      bookingDetails.sendWhatsAppReminder ? 'WhatsApp' : null,
      bookingDetails.sendEmailReminder ? 'Email' : null,
    ]
      .filter(Boolean)
      .join(' & ');

    showToast(
      activeReminders
        ? `Meeting booked! Reminders sent via ${activeReminders}.`
        : 'Appointment atomically locked into calendar!',
      'success'
    );
  }, [appendEvent, bookingDetails, showToast]);

  const handleSelectSlotTime = useCallback(
    (slot: '2:30 PM' | '4:15 PM') => {
      if (isSlotCommitted) return;
      setSelectedSlotTime(slot);
      appendEvent(
        `SLOT_RETARGETED_${slot.replace(/[: ]/g, '_')}`,
        'BUFFER_VERIFIED',
        'secondary'
      );
      showToast(`Consultation slot updated to Thursday ${slot}.`, 'info');
    },
    [appendEvent, isSlotCommitted, showToast]
  );

  const handleResetSlot = useCallback(() => {
    setIsSlotCommitted(false);
    setBookingModalStep('review');
    appendEvent('SANDBOX_SLOT_RESET', 'READY', 'muted');
    showToast('Demo slot unlocked for another test booking.', 'info');
  }, [appendEvent, showToast]);

  const handleSendMessage = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = simInput.trim();
      if (!trimmed) return;

      const activeChannel = currentChannel;
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'customer',
        text: trimmed,
        meta: 'Just now • Delivered',
      };

      setMessagesByChannel((prev) => ({
        ...prev,
        [activeChannel]: [...prev[activeChannel], userMsg],
      }));
      setSimInput('');
      appendEvent('INBOUND_USER_QUERY_PARSED', 'INTENT_EXTRACTED', 'muted');

      const lower = trimmed.toLowerCase();
      window.setTimeout(() => {
        let reply =
          "I've checked Sarah's live calendar! Once you confirm the slot, we'll automatically send your WhatsApp and email reminders. Would you like to lock it in?";
        let highlights: string[] = [];

        if (lower.includes('friday')) {
          reply =
            'Sarah has 10:00 AM and 1:30 PM open this Friday for a consultation. Shall I reserve 10:00 AM and queue your WhatsApp & email reminders?';
          highlights = ['10:00 AM', '1:30 PM'];
        } else if (lower.includes('cancel') || lower.includes('reschedule')) {
          reply =
            'Under our 24h flexible policy, you can reschedule or cancel at zero fee directly from your WhatsApp or email reminder link.';
        } else if (lower.includes('4:15')) {
          reply =
            'Switched your consultation hold to 4:15 PM this Thursday with Sarah Jenkins (Room #3, turnover buffer verified).';
          highlights = ['4:15 PM'];
          if (!isSlotCommitted) {
            setSelectedSlotTime('4:15 PM');
          }
        } else if (lower.includes('reminder') || lower.includes('whatsapp') || lower.includes('email')) {
          reply = `Every booked meeting sends an automated WhatsApp reminder to ${bookingDetails.clientPhone} and an email invite to ${bookingDetails.clientEmail}.`;
          highlights = [bookingDetails.clientPhone, bookingDetails.clientEmail];
        } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
          reply =
            'A 60-min Consultation & Session with Sarah Jenkins is $145.00, payable at check-in with no deposit required.';
          highlights = ['$145.00'];
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          highlights,
          meta: 'Instant AI Orchestration • WhatsApp + Email Ready',
        };

        setMessagesByChannel((prev) => ({
          ...prev,
          [activeChannel]: [...prev[activeChannel], aiMsg],
        }));
        appendEvent('SYNCHRONIZED_AI_DISPATCH_SENT', '200 OK', 'secondary');
      }, 450);
    },
    [appendEvent, bookingDetails.clientEmail, bookingDetails.clientPhone, currentChannel, isSlotCommitted, simInput]
  );

  const handleTriggerDemo = useCallback(() => {
    const el = document.getElementById('simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    handleSwitchChannel('whatsapp');
    showToast('Simulation initiated! Interactive WhatsApp & Calendar engine ready.', 'info');
    window.setTimeout(() => {
      setSimInput('Can I book a consultation with Sarah for Thursday at 2:30 PM?');
      simInputRef.current?.focus();
    }, 500);
  }, [handleSwitchChannel, showToast]);

  const handleAppointmentBooked = useCallback(
    (summary: {
      name: string;
      dateLabel: string;
      timeSlot: string;
      whatsapp: string;
      email: string;
    }) => {
      appendEvent(
        `CONSULTATION_BOOKED_${summary.dateLabel.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`,
        summary.timeSlot,
        'success'
      );
      appendEvent('WHATSAPP_REMINDER_DISPATCHED', summary.whatsapp, 'success');
      appendEvent('EMAIL_REMINDER_DISPATCHED', summary.email, 'secondary');
    },
    [appendEvent]
  );

  const handleTestIntegration = useCallback(
    (name: string, latencyMs: number) => {
      appendEvent(
        `INTEGRATION_PROBE_${name.toUpperCase().replace(/\s+/g, '_')}`,
        `HEALTHY (${latencyMs}ms)`,
        'success'
      );
      showToast(`${name} 2-Way Sync active: Latency verified at ${latencyMs}ms.`, 'success');
    },
    [appendEvent, showToast]
  );

  const handleOpenOnboarding = useCallback((title: string) => {
    setOnboardingTitle(title);
    setOnboardingOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Toast toast={toast} />

      <Navbar
        onShowToast={showToast}
        onOpenSignIn={() => setSignInOpen(true)}
        onOpenOnboarding={handleOpenOnboarding}
      />

      <main className="w-full pt-16 min-h-screen">
        <HeroSimulator
          currentChannel={currentChannel}
          messages={messagesByChannel[currentChannel]}
          events={events}
          isSlotCommitted={isSlotCommitted}
          selectedSlotTime={selectedSlotTime}
          bookingDetails={bookingDetails}
          simInput={simInput}
          onSimInputChange={setSimInput}
          onSwitchChannel={handleSwitchChannel}
          onSendMessage={handleSendMessage}
          onConfirmInChatSlot={handleConfirmInChatSlot}
          onSelectSlotTime={handleSelectSlotTime}
          onResetSlot={handleResetSlot}
          onOpenBookingModal={() => setBookingModalOpen(true)}
          onOpenOnboarding={handleOpenOnboarding}
          onTriggerDemo={handleTriggerDemo}
          simInputRef={simInputRef}
        />

        <ChannelsSection onSelectChannel={(key) => setActiveChannelModal(key)} />

        <FeaturesSection />

        <RoiCalculator
          calls={calls}
          ticket={ticket}
          onCallsChange={setCalls}
          onTicketChange={setTicket}
          onOpenReportModal={() => setRoiModalOpen(true)}
        />

        <IntegrationsSection onTestIntegration={handleTestIntegration} />

        <BookAppointmentSection
          onShowToast={showToast}
          onAppointmentBooked={handleAppointmentBooked}
        />

        <CtaSection
          onTriggerDemo={handleTriggerDemo}
          onOpenOnboarding={handleOpenOnboarding}
        />
      </main>

      <Footer
        onShowToast={showToast}
        onSelectChannel={(key) => setActiveChannelModal(key)}
        onOpenOnboarding={handleOpenOnboarding}
      />

      {/* Interactive Modals */}
      <BookingSummaryModal
        open={bookingModalOpen}
        step={bookingModalStep}
        selectedSlotTime={selectedSlotTime}
        bookingDetails={bookingDetails}
        onUpdateBookingDetails={(next) => {
          setBookingDetails(next);
          showToast('Booking and reminder preferences updated.', 'info');
        }}
        onClose={() => setBookingModalOpen(false)}
        onConfirm={() => {
          setBookingModalStep('confirmed');
          handleConfirmInChatSlot();
        }}
        onReset={() => setBookingModalStep('review')}
      />

      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onShowToast={showToast}
      />

      <OnboardingModal
        open={onboardingOpen}
        title={onboardingTitle}
        onClose={() => setOnboardingOpen(false)}
        onShowToast={showToast}
      />

      <ChannelModal
        channelKey={activeChannelModal}
        onClose={() => setActiveChannelModal(null)}
        onTestInSimulator={(simKey, title) => {
          setActiveChannelModal(null);
          handleSwitchChannel(simKey);
          document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast(`Switched Simulator to ${title}!`, 'info');
        }}
      />

      <RoiReportModal
        open={roiModalOpen}
        calls={calls}
        ticket={ticket}
        onClose={() => setRoiModalOpen(false)}
        onClaimPlan={() => {
          setRoiModalOpen(false);
          document.getElementById('book-appointment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
}
