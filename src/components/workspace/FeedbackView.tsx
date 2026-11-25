import { useState } from 'react';
import {
  Frown,
  Meh,
  MessageSquareHeart,
  Smile,
  Sparkles,
  Star,
} from 'lucide-react';
import { Sentiment, WorkspaceTenant } from '../../types/workspace';
import { ProgressBreakdown, SparkAreaTrendChart } from './Charts';

interface FeedbackViewProps {
  workspace: WorkspaceTenant;
  onInspectCall: (callId: string) => void;
  onInspectCustomer: (customerId: string) => void;
}

export function FeedbackView({
  workspace,
  onInspectCall,
  onInspectCustomer,
}: FeedbackViewProps) {
  const [sentimentFilter, setSentimentFilter] = useState<'All' | Sentiment>('All');

  const positiveCount = workspace.feedback.filter((f) => f.sentiment === 'Positive').length;
  const neutralCount = workspace.feedback.filter((f) => f.sentiment === 'Neutral').length;
  const negativeCount = workspace.feedback.filter((f) => f.sentiment === 'Negative').length;
  const totalCount = Math.max(1, workspace.feedback.length);

  const avgRating = (
    workspace.feedback.reduce((sum, f) => sum + f.rating, 0) / totalCount
  ).toFixed(1);
  const avgQuality = Math.round(
    workspace.feedback.reduce((sum, f) => sum + f.qualityScore, 0) / totalCount
  );

  const filtered = workspace.feedback.filter(
    (f) => sentimentFilter === 'All' || f.sentiment === sentimentFilter
  );

  const csatTrend = [
    { label: 'W1', value: 89 },
    { label: 'W2', value: 91 },
    { label: 'W3', value: 93 },
    { label: 'W4', value: 92 },
    { label: 'W5', value: 95 },
    { label: 'W6', value: avgQuality },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight">
          Customer Feedback &amp; Conversation Quality
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Sentiment monitoring, CSAT indicators, and AI-generated call quality reviews for {workspace.name}.
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>CSAT Score</span>
            <Star className="w-4 h-4 text-status-warning" />
          </div>
          <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
            {avgRating} / 5.0
          </div>
          <div className="font-mono text-[11px] text-status-success">
            {Math.round((positiveCount / totalCount) * 100)}% Positive responses
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Conversation Quality</span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
          <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
            {avgQuality} / 100
          </div>
          <div className="font-mono text-[11px] text-text-muted">
            Intent accuracy &amp; tone parity
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Positive Sentiment</span>
            <Smile className="w-4 h-4 text-status-success" />
          </div>
          <div className="font-display text-2xl font-bold text-status-success tabular-nums">
            {positiveCount}
          </div>
          <div className="font-mono text-[11px] text-text-muted">
            Out of {workspace.feedback.length} reviews
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Needs Attention</span>
            <Frown className="w-4 h-4 text-status-danger" />
          </div>
          <div className="font-display text-2xl font-bold text-on-surface tabular-nums">
            {negativeCount}
          </div>
          <div className="font-mono text-[11px] text-text-muted">
            {neutralCount} neutral · {negativeCount} negative
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
          <div>
            <h2 className="font-display text-sm font-bold text-on-surface">
              Feedback &amp; Quality Score Trend
            </h2>
            <p className="text-xs text-text-muted">
              Weekly AI conversation quality index across voice &amp; chat
            </p>
          </div>
          <SparkAreaTrendChart
            data={csatTrend}
            strokeColor="#16a34a"
            fillColor="rgba(22, 163, 74, 0.1)"
            valueSuffix="/100"
          />
        </div>

        <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="font-display text-sm font-bold text-on-surface">
              Sentiment Distribution &amp; Quality Breakdown
            </h2>
            <p className="text-xs text-text-muted">
              Evaluated from caller tone &amp; post-booking surveys
            </p>
          </div>
          <ProgressBreakdown
            items={[
              {
                label: 'Positive Sentiment',
                value: positiveCount,
                total: totalCount,
                colorClass: 'bg-status-success',
              },
              {
                label: 'Neutral Sentiment',
                value: neutralCount,
                total: totalCount,
                colorClass: 'bg-secondary',
              },
              {
                label: 'Negative Sentiment',
                value: negativeCount,
                total: totalCount,
                colorClass: 'bg-status-danger',
              },
            ]}
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-secondary" />
            <h2 className="font-display text-sm font-bold text-on-surface">
              Feedback History &amp; AI Call Summaries
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Positive', 'Neutral', 'Negative'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSentimentFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                  sentimentFilter === s
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-surface text-text-muted border-surface-border hover:text-on-surface'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted">
            No feedback entries match "{sentimentFilter}".
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-xl bg-surface border border-surface-border space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {fb.sentiment === 'Positive' ? (
                      <Smile className="w-4 h-4 text-status-success" />
                    ) : fb.sentiment === 'Neutral' ? (
                      <Meh className="w-4 h-4 text-secondary" />
                    ) : (
                      <Frown className="w-4 h-4 text-status-danger" />
                    )}
                    <button
                      type="button"
                      onClick={() => onInspectCustomer(fb.customerId)}
                      className="text-xs font-bold text-on-surface hover:text-secondary cursor-pointer"
                    >
                      {fb.customerName}
                    </button>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-surface-card border border-surface-border text-text-muted">
                      {fb.channel}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-on-surface tabular-nums">
                      {fb.rating}.0 / 5 · Quality {fb.qualityScore}%
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">
                    {fb.date}
                  </span>
                </div>

                <p className="text-xs text-on-surface leading-relaxed">
                  "{fb.comment}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-text-muted border-t border-surface-border/70">
                  <span>
                    <strong className="text-on-surface">AI Summary:</strong>{' '}
                    {fb.aiCallSummary}
                  </span>
                  <button
                    type="button"
                    onClick={() => onInspectCall(fb.callId)}
                    className="font-semibold text-secondary hover:underline shrink-0 cursor-pointer"
                  >
                    Inspect Call →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
