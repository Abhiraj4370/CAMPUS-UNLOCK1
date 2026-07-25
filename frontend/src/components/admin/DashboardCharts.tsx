'use client';

interface SeriesData { labels: string[]; values: number[] }

export function LeadsLineChart({ data }: { data: SeriesData }) {
  const w = 560;
  const h = 200;
  const pad = 30;
  const max = Math.max(...data.values, 1) * 1.15;
  const stepX = data.values.length > 1 ? (w - pad * 2) / (data.values.length - 1) : 0;

  const points = data.values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 1.6);
    return [x, y];
  });

  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const areaPath = points.length ? `${linePath} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z` : '';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="leadsAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#leadsAreaGrad)" />
      <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#2563EB" stroke="#fff" strokeWidth={2} />
      ))}
      {points.map((p, i) => (
        <text key={i} x={p[0]} y={h - 6} fontSize="10.5" fill="#94A3B8" textAnchor="middle">{data.labels[i]}</text>
      ))}
    </svg>
  );
}

const DONUT_COLORS = ['#2563EB', '#F59E0B', '#16A34A', '#7C3AED'];

export function StatusDonutChart({ data }: { data: SeriesData }) {
  const total = data.values.reduce((s, v) => s + v, 0) || 1;
  const cx = 90, cy = 90, r = 64, sw = 26;
  const circumference = 2 * Math.PI * r;
  let angle = -90;

  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg viewBox="0 0 180 180" width={150} height={150}>
        {data.values.map((v, i) => {
          const frac = v / total;
          const dash = frac * circumference;
          const offset = -(angle + 90) / 360 * circumference;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r} fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={sw}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          angle += frac * 360;
          return el;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0F172A">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10.5" fill="#94A3B8">Total</text>
      </svg>
      <div className="flex flex-col gap-2">
        {data.labels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            {label} <strong>{Math.round((data.values[i] / total) * 100)}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
