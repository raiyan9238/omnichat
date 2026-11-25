export type ChannelKey = 'whatsapp' | 'ig' | 'messenger' | 'web' | 'voice';

export type ToastType = 'success' | 'info' | 'warning';

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export interface ChatBookingCard {
  service: string;
  specialist: string;
  slot: string;
  total: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'card';
  text?: string;
  highlights?: string[];
  meta: string;
  card?: ChatBookingCard;
}

export interface ChannelMeta {
  key: ChannelKey;
  tabLabel: string;
  headerTitle: string;
  latencyLabel: string;
  sourceLabel: string;
  dotColorClass: string;
  activeTabClass: string;
  avatarClass: string;
  eventCode: string;
  eventStatus: string;
}

export interface EventLogEntry {
  id: string;
  timestamp: string;
  code: string;
  status: string;
  tone: 'success' | 'secondary' | 'muted';
}

export interface ChannelDetailInfo {
  key: 'whatsapp' | 'instagram' | 'messenger' | 'web' | 'voice';
  simKey: ChannelKey;
  title: string;
  tag: string;
  desc: string;
  footerLeft: string;
  footerAction: string;
  latency: string;
  protocol: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  shortName: string;
  subLabel: string;
  latencyMs: number;
}

export interface BookingDetails {
  location: string;
  branch: string;
  service: string;
  duration: string;
  practitioner: string;
  practitionerNote: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  price: string;
  paymentNote: string;
  token: string;
  room: string;
  sendWhatsAppReminder: boolean;
  sendEmailReminder: boolean;
}
