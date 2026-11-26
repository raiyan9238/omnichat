import { useState } from 'react';

export interface DualBarPoint {
  label: string;
  primary: number;
  secondary?: number;
}

interface DualBarTrendChartProps {
  data: DualBarPoint[];
  primaryLabel: string;
  secondaryLabel?: string;
  height?: number;
  unitSuffix?: string;
}

export function DualBarTrendChart({
  data,
  primaryLabel,
  secondaryLabel,
  height = 190,
  unitSuffix = '',
}: DualBarTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(
    1,
    ...data.map((d) => d.primary + (d.secondary ?? 0))
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-medium text-on-surface">
            <span className="w-2.5 h-2.5 rounded-xs bg-secondary" />
            {primaryLabel}
          </span>
          {secondaryLabel && (
            <span className="inline-flex items-center gap-1.5 font-medium text-text-muted">
              <span className="w-2.5 h-2.5 rounded-xs bg-status-warning/80" />
              {secondaryLabel}
            </span>
          )}
        </div>
        {hoveredIdx !== null && data[hoveredIdx] ? (
          <span className="font-mono text-[11px] font-semibold text-on-surface tabular-nums">
            {data[hoveredIdx].label}: {data[hoveredIdx].primary.toLocaleString()}
            {unitSuffix}
            {secondaryLabel && data[hoveredIdx].secondary !== undefined
              ? ` · ${data[hoveredIdx].secondary!.toLocaleString()} ${secondaryLabel.toLowerCase()}`
              : ''}
          </span>
        ) : (
          <span className="font-mono text-[10px] text-text-muted tabular-nums">
            Peak: {maxVal.toLocaleString()}{unitSuffix}
          </span>
        )}
      </div>

      <div
        className="relative flex items-end gap-2 pt-4 pb-1 border-b border-surface-border"
        style={{ height }}
      >
        {/* Subtle horizontal reference lines */}
        <div className="absolute inset-x-0 top-4 bottom-1 flex flex-col justify-between pointer-events-none">
          <div className="border-t border-dashed border-surface-border/70" />
          <div className="border-t border-dashed border-surface-border/70" />
          <div className="border-t border-dashed border-surface-border/70" />
        </div>

        {data.map((point, idx) => {
          const total = point.primary + (point.secondary ?? 0);
          const totalPct = Math.max(6, Math.round((total / maxVal) * 100));
          const secondaryPct =
            point.secondary && total > 0
              ? Math.round((point.secondary / total) * 100)
              : 0;
          const primaryPct = 100 - secondaryPct;
          const isHovered = hoveredIdx === idx;
          const barLabel = `${point.label}: ${point.primary.toLocaleString()} ${primaryLabel}${
            secondaryLabel && point.secondary !== undefined
              ? `, ${point.secondary.toLocaleString()} ${secondaryLabel}`
              : ''
          }`;

          return (
            <button
              key={point.label}
              type="button"
              aria-label={barLabel}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(idx)}
              onBlur={() => setHoveredIdx(null)}
              className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-full max-w-[34px] rounded-t-md overflow-hidden flex flex-col justify-end transition-[filter,box-shadow] duration-150 ease-out group-focus-visible:ring-2 group-focus-visible:ring-secondary ${
                  isHovered ? 'ring-2 ring-secondary/30 brightness-95' : ''
                }`}
                style={{ height: `${totalPct}%` }}
              >
                {secondaryLabel && point.secondary !== undefined && point.secondary > 0 && (
                  <div
                    className="w-full bg-status-warning/80"
                    style={{ height: `${secondaryPct}%` }}
                  />
                )}
                <div
                  className="w-full bg-secondary"
                  style={{ height: `${primaryPct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {data.map((point) => (
          <div
            key={point.label}
            className="flex-1 text-center font-mono text-[10px] text-text-muted truncate"
          >
            {point.label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SparkAreaPoint {
  label: string;
  value: number;
}

interface SparkAreaTrendChartProps {
  data: SparkAreaPoint[];
  strokeColor?: string;
  fillColor?: string;
  valueSuffix?: string;
  height?: number;
}

export function SparkAreaTrendChart({
  data,
  strokeColor = '#0051d5',
  fillColor = 'rgba(0, 81, 213, 0.10)',
  valueSuffix = '',
  height = 170,
}: SparkAreaTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const width = 560;
  const padX = 16;
  const padY = 18;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = Math.max(1, maxVal - minVal);

  const coords = data.map((d, i) => {
    const x =
      data.length > 1
        ? padX + (i / (data.length - 1)) * usableW
        : width / 2;
    const y = padY + usableH - ((d.value - minVal) / range) * usableH;
    return { x, y, ...d };
  });

  const linePath = coords
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(height - padY).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(height - padY).toFixed(1)} Z`
      : '';

  const activePoint =
    hoveredIdx !== null ? coords[hoveredIdx] : coords[coords.length - 1];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] text-text-muted">
          {activePoint ? `${activePoint.label}` : 'Trend'}
        </span>
        {activePoint && (
          <span className="font-mono text-xs font-bold text-on-surface tabular-nums">
            {activePoint.value.toLocaleString()}
            {valueSuffix}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height }}
        role="img"
        aria-label="Trend line chart"
      >
        <line
          x1={padX}
          y1={padY}
          x2={width - padX}
          y2={padY}
          stroke="#e2e8f0"
          strokeDasharray="4 4"
        />
        <line
          x1={padX}
          y1={height / 2}
          x2={width - padX}
          y2={height / 2}
          stroke="#e2e8f0"
          strokeDasharray="4 4"
        />
        <line
          x1={padX}
          y1={height - padY}
          x2={width - padX}
          y2={height - padY}
          stroke="#e2e8f0"
        />
        {areaPath && <path d={areaPath} fill={fillColor} />}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {coords.map((pt, idx) => (
          <g
            key={pt.label}
            tabIndex={0}
            role="button"
            aria-label={`${pt.label}: ${pt.value.toLocaleString()}${valueSuffix}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => setHoveredIdx(idx)}
            onBlur={() => setHoveredIdx(null)}
            className="cursor-pointer focus:outline-none"
          >
            <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === idx ? 5.5 : 3.5}
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth="2.5"
            />
          </g>
        ))}
      </svg>

      <div className="flex items-center justify-between px-1">
        {data.map((pt) => (
          <span
            key={pt.label}
            className="font-mono text-[10px] text-text-muted"
          >
            {pt.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface HourlyPoint {
  hour: string;
  calls: number;
}

export function HourlyDistributionChart({ data }: { data: HourlyPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(1, ...data.map((d) => d.calls));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Call density by hour</span>
        <span className="font-mono text-[11px] font-semibold text-on-surface tabular-nums">
          {hovered !== null && data[hovered]
            ? `${data[hovered].hour}: ${data[hovered].calls} calls`
            : `Peak: ${
                data.reduce((best, cur) => (cur.calls > best.calls ? cur : best), data[0])?.hour ?? '-'
              }`}
        </span>
      </div>
      <div className="h-32 flex items-end gap-1.5 pt-2 border-b border-surface-border">
        {data.map((item, idx) => {
          const pct = Math.max(8, Math.round((item.calls / maxVal) * 100));
          const isPeak = item.calls >= maxVal * 0.85;
          return (
            <button
              key={item.hour}
              type="button"
              aria-label={`${item.hour}: ${item.calls} calls`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(idx)}
              onBlur={() => setHovered(null)}
              className="flex-1 h-full flex items-end cursor-pointer focus:outline-none group"
            >
              <div
                className={`w-full rounded-t-sm transition-colors duration-150 group-focus-visible:ring-2 group-focus-visible:ring-secondary ${
                  hovered === idx
                    ? 'bg-secondary'
                    : isPeak
                    ? 'bg-secondary/85'
                    : 'bg-surface-container-high hover:bg-secondary/60'
                }`}
                style={{ height: `${pct}%` }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
        {data
          .filter((_, idx) => idx % 2 === 0)
          .map((item) => (
            <span key={item.hour}>{item.hour}</span>
          ))}
      </div>
    </div>
  );
}

export interface BreakdownItem {
  label: string;
  value: number;
  total: number;
  colorClass?: string;
}

export function ProgressBreakdown({ items }: { items: BreakdownItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-on-surface">{item.label}</span>
              <span className="font-mono text-[11px] text-text-muted tabular-nums">
                {item.value.toLocaleString()} ({pct}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-container-low overflow-hidden">
              <div
                className={`h-full rounded-full ${item.colorClass ?? 'bg-secondary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
