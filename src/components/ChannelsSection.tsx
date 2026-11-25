import { Camera, Globe, MessageCircle, MessageSquareText, PhoneCall } from 'lucide-react';
import { CHANNEL_DETAILS } from '../data/omnibookData';
import { ChannelDetailInfo } from '../types/omnibook';

interface ChannelsSectionProps {
  onSelectChannel: (key: ChannelDetailInfo['key']) => void;
}

const CHANNEL_STYLE_MAP: Record<
  ChannelDetailInfo['key'],
  { iconBg: string; badgeBg: string; badgeText: string; spanClass: string; Icon: typeof PhoneCall }
> = {
  whatsapp: {
    iconBg: 'bg-badge-whatsapp-bg text-channel-whatsapp',
    badgeBg: 'bg-badge-whatsapp-bg',
    badgeText: 'text-badge-whatsapp-text',
    spanClass: 'lg:col-span-3',
    Icon: MessageSquareText,
  },
  instagram: {
    iconBg: 'bg-badge-instagram-bg text-channel-instagram',
    badgeBg: 'bg-badge-instagram-bg',
    badgeText: 'text-badge-instagram-text',
    spanClass: 'lg:col-span-3',
    Icon: Camera,
  },
  messenger: {
    iconBg: 'bg-badge-messenger-bg text-channel-messenger',
    badgeBg: 'bg-badge-messenger-bg',
    badgeText: 'text-badge-messenger-text',
    spanClass: 'lg:col-span-2',
    Icon: MessageCircle,
  },
  web: {
    iconBg: 'bg-badge-web-bg text-channel-web',
    badgeBg: 'bg-badge-web-bg',
    badgeText: 'text-badge-web-text',
    spanClass: 'lg:col-span-2',
    Icon: Globe,
  },
  voice: {
    iconBg: 'bg-badge-voice-bg text-channel-voice',
    badgeBg: 'bg-badge-voice-bg',
    badgeText: 'text-badge-voice-text',
    spanClass: 'lg:col-span-2',
    Icon: PhoneCall,
  },
};

export function ChannelsSection({ onSelectChannel }: ChannelsSectionProps) {
  return (
    <section
      id="channels"
      className="scroll-mt-16 w-full py-16 lg:py-20 bg-surface-container-lowest border-b border-surface-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="font-mono text-xs uppercase text-secondary font-bold tracking-wider mb-2">
            Omni-Channel Parity
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Every Channel. One Autonomous Brain.
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            Book consultations and meetings via WhatsApp, Instagram, Messenger, Web Chat, or Phone—each synced to a single real-time calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {CHANNEL_DETAILS.map((channel) => {
            const style = CHANNEL_STYLE_MAP[channel.key];
            const IconComponent = style.Icon;
            return (
              <button
                key={channel.key}
                type="button"
                onClick={() => onSelectChannel(channel.key)}
                className={`text-left bg-surface-card rounded-2xl border border-surface-border p-6 shadow-xs hover:shadow-md hover:border-secondary/40 transition-all cursor-pointer group flex flex-col justify-between ${style.spanClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center font-bold shrink-0`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span
                      className={`font-mono text-xs px-2.5 py-1 rounded ${style.badgeBg} ${style.badgeText} font-bold whitespace-nowrap`}
                    >
                      {channel.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">{channel.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs font-mono text-text-muted w-full">
                  <span>{channel.footerLeft}</span>
                  <span className="text-status-success font-semibold flex items-center gap-1">
                    {channel.footerAction}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
