export type WorkspaceRole = 'Owner' | 'Admin' | 'Manager' | 'Member';

export type WorkspaceSection =
  | 'dashboard'
  | 'agents'
  | 'numbers'
  | 'call-logs'
  | 'conversations'
  | 'crm'
  | 'feedback'
  | 'analytics'
  | 'team'
  | 'marketing'
  | 'api-keys'
  | 'billing'
  | 'settings';

export type AgentStatus = 'Active' | 'Paused' | 'Inactive';

export type CallStatus = 'Answered' | 'Missed' | 'Escalated';

export type CallOutcome =
  | 'Appointment Booked'
  | 'Rescheduled'
  | 'Info Provided'
  | 'Transferred'
  | 'Voicemail';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export interface AIAgent {
  id: string;
  name: string;
  roleTitle: string;
  status: AgentStatus;
  assignedNumber: string;
  channels: ('Voice' | 'WhatsApp' | 'Instagram' | 'Messenger' | 'Web')[];
  callsHandled: number;
  aiResolutionRate: number;
  avgHandleTime: string;
  csat: number;
  voiceModel: string;
  language: string;
  greetingScript: string;
  workingHours: string;
  escalationThreshold: string;
  autoWhatsAppReminder: boolean;
  autoEmailReminder: boolean;
  activityHistory: {
    id: string;
    timestamp: string;
    action: string;
    detail: string;
  }[];
}

export interface PhoneNumberRecord {
  id: string;
  number: string;
  country: string;
  region: string;
  status: 'Active' | 'Paused';
  assignedAgentId: string | null;
  assignedAgentName: string;
  type: 'Local' | 'Toll-Free';
  monthlyVolume: number;
  provisionedAt: string;
  isPrimary?: boolean;
}

export interface NumberAssignmentEvent {
  id: string;
  number: string;
  event: string;
  agentName: string;
  timestamp: string;
}

export interface TranscriptLine {
  id: string;
  speaker: 'Caller' | 'AI Agent';
  time: string;
  text: string;
}

export interface CallLogRecord {
  id: string;
  callerName: string;
  phoneNumber: string;
  customerId: string;
  dateTime: string;
  timestampMs: number;
  durationSec: number;
  durationLabel: string;
  status: CallStatus;
  agentId: string;
  agentName: string;
  outcome: CallOutcome;
  sentiment: Sentiment;
  summary: string;
  transcript: TranscriptLine[];
  timeline: { time: string; label: string }[];
}

export interface OmnichannelThread {
  id: string;
  customerName: string;
  customerId: string;
  channel: 'WhatsApp' | 'Instagram' | 'Messenger' | 'Web';
  handle: string;
  agentName: string;
  status: 'AI Handling' | 'Booked' | 'Needs Human';
  lastUpdated: string;
  unread: boolean;
  messages: {
    id: string;
    sender: 'Customer' | 'AI Agent' | 'Team';
    time: string;
    text: string;
  }[];
}

export interface CrmCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyOrSegment: string;
  status: 'Active' | 'VIP' | 'Lead' | 'Inactive';
  tags: string[];
  lastInteraction: string;
  totalInteractions: number;
  notes: { id: string; date: string; author: string; text: string }[];
  activities: { id: string; date: string; type: string; summary: string }[];
}

export interface FeedbackRecord {
  id: string;
  customerName: string;
  customerId: string;
  callId: string;
  agentName: string;
  channel: 'Voice' | 'WhatsApp' | 'Instagram' | 'Web';
  sentiment: Sentiment;
  rating: number;
  qualityScore: number;
  date: string;
  comment: string;
  aiCallSummary: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  status: 'Active' | 'Pending';
  lastActive: string;
  department: string;
}

export interface ApiKeyItem {
  id: string;
  label: string;
  maskedKey: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
  requests30d: number;
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: 'Paid' | 'Pending';
}

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  platforms: ('Instagram' | 'Facebook' | 'LinkedIn' | 'X')[];
  status: 'Scheduled' | 'Draft' | 'Published';
  scheduledFor: string;
  campaign: string;
  estimatedReach: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template: string;
  segment: string;
  recipientCount: number;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
  scheduledDate: string;
  openRate: number;
  clickRate: number;
  bookedReplies: number;
}

export interface WorkspaceTenant {
  id: string;
  name: string;
  industry: string;
  planName: string;
  planPrice: string;
  subscriptionStatus: 'Active' | 'Trial';
  country: string;
  timezone: string;
  businessEmail: string;
  contactPhone: string;
  companyBio: string;
  apiUsageCount: number;
  apiUsageLimit: number;
  voiceMinutesUsed: number;
  voiceMinutesLimit: number;
  agents: AIAgent[];
  phoneNumbers: PhoneNumberRecord[];
  numberHistory: NumberAssignmentEvent[];
  callLogs: CallLogRecord[];
  conversations: OmnichannelThread[];
  customers: CrmCustomer[];
  feedback: FeedbackRecord[];
  team: TeamMember[];
  teamActivity: { id: string; timestamp: string; actor: string; action: string }[];
  apiKeys: ApiKeyItem[];
  invoices: BillingInvoice[];
  activeSessions: { id: string; device: string; location: string; lastSeen: string; current?: boolean }[];
  socialPosts: SocialPost[];
  emailCampaigns: EmailCampaign[];
  marketingTimeline: { id: string; date: string; channel: string; event: string }[];
}
