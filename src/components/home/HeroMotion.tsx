'use client';

// Orbital rings + geometric constellation — hero background motion graphic
// All animations use SVG animateTransform for maximum browser compatibility

const GOLD       = '#c9923a';
const GOLD_LIGHT = '#e0b04a';
const AMBER      = '#f59e0b';
const CX = 700;   // ring centre X in 1400×700 viewBox
const CY = 350;   // ring centre Y

/** Evenly-spaced points on a circle (relative to CX/CY) */
function ring(r: number, count: number, startDeg = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((startDeg + (i * 360) / count) * Math.PI) / 180;
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  });
}

/** Tick marks around the outermost dial */
function ticks(n: number, outer: number) {
  return Array.from({ length: n }, (_, i) => {
    const a  = ((i * 360) / n) * (Math.PI / 180);
    const major = i % (n / 12) === 0;
    const inner = major ? outer - 14 : outer - 6;
    return {
      x1: CX + outer * Math.cos(a), y1: CY + outer * Math.sin(a),
      x2: CX + inner * Math.cos(a), y2: CY + inner * Math.sin(a),
      major,
    };
  });
}

/** Polygon point-string from degrees array on a given radius */
function hexPoints(r: number, degs: number[]) {
  return degs
    .map(d => {
      const a = (d * Math.PI) / 180;
      return `${CX + r * Math.cos(a)},${CY + r * Math.sin(a)}`;
    })
    .join(' ');
}

const dialTicks  = ticks(48, 385);
const ring2nodes = ring(310, 8);
const ring3nodes = ring(218, 6);
const ring4nodes = ring(143, 4, 45);
const ring5nodes = ring(74, 3);

export default function HeroMotion() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 700"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Soft amber centre glow */}
          <radialGradient id="hm-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={AMBER} stopOpacity="0.55" />
            <stop offset="60%"  stopColor={AMBER} stopOpacity="0.08" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0"    />
          </radialGradient>
          {/* Glow filter for bright nodes */}
          <filter id="hm-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── RING 1 — outermost tick-dial, very slow CW ── */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="180s" repeatCount="indefinite" />
          <circle cx={CX} cy={CY} r="385" fill="none"
            stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.07" strokeDasharray="32 22" />
          {dialTicks.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={GOLD}
              strokeWidth={t.major ? 0.9 : 0.45}
              strokeOpacity={t.major ? 0.22 : 0.10}
            />
          ))}
        </g>

        {/* ── RING 2 — solid, slow CCW, 8 nodes ── */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${CX} ${CY}`} to={`-360 ${CX} ${CY}`} dur="120s" repeatCount="indefinite" />
          <circle cx={CX} cy={CY} r="310" fill="none"
            stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.11" />
          {ring2nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r="2.8" fill={GOLD} fillOpacity="0.32">
              {i % 2 === 0 && (
                <animate attributeName="r" values="2.8;4.5;2.8"
                  dur={`${4 + i * 0.4}s`} repeatCount="indefinite" />
              )}
            </circle>
          ))}
        </g>

        {/* ── RING 3 — hexagram ring, medium CW, 6 nodes ── */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="85s" repeatCount="indefinite" />
          <circle cx={CX} cy={CY} r="218" fill="none"
            stroke={GOLD_LIGHT} strokeWidth="0.9" strokeOpacity="0.16" />
          {/* Inscribed hexagram — two overlapping triangles */}
          <polygon points={hexPoints(218, [0, 120, 240])}
            fill="none" stroke={GOLD_LIGHT} strokeWidth="0.5" strokeOpacity="0.11" />
          <polygon points={hexPoints(218, [60, 180, 300])}
            fill="none" stroke={GOLD_LIGHT} strokeWidth="0.5" strokeOpacity="0.11" />
          {ring3nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r="3.5" fill={GOLD_LIGHT} fillOpacity="0.44">
              <animate attributeName="fillOpacity" values="0.44;0.80;0.44"
                dur={`${3.5 + i * 0.6}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* ── RING 4 — dashed, faster CCW, 4 diamond nodes ── */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${CX} ${CY}`} to={`-360 ${CX} ${CY}`} dur="58s" repeatCount="indefinite" />
          <circle cx={CX} cy={CY} r="143" fill="none"
            stroke={GOLD} strokeWidth="1.0" strokeOpacity="0.22" strokeDasharray="10 9" />
          {/* Diamond cross — connect opposite nodes */}
          {[[0, 2], [1, 3]].map(([a, b], i) => (
            <line key={i}
              x1={ring4nodes[a].x} y1={ring4nodes[a].y}
              x2={ring4nodes[b].x} y2={ring4nodes[b].y}
              stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.14"
            />
          ))}
          {ring4nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r="4" fill={GOLD} fillOpacity="0.50"
              filter="url(#hm-glow)" />
          ))}
        </g>

        {/* ── RING 5 — inner, fast CW, 3 nodes ── */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="40s" repeatCount="indefinite" />
          <circle cx={CX} cy={CY} r="74" fill="none"
            stroke={AMBER} strokeWidth="1.2" strokeOpacity="0.30" />
          {ring5nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r="3" fill={AMBER} fillOpacity="0.60"
              filter="url(#hm-glow)" />
          ))}
        </g>

        {/* ── RING 6 — core, fastest CCW ── */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${CX} ${CY}`} to={`-360 ${CX} ${CY}`} dur="26s" repeatCount="indefinite" />
          <circle cx={CX} cy={CY} r="33" fill="none"
            stroke={AMBER} strokeWidth="1.6" strokeOpacity="0.42" strokeDasharray="6 6" />
          <line x1={CX - 33} y1={CY} x2={CX + 33} y2={CY}
            stroke={AMBER} strokeWidth="0.4" strokeOpacity="0.20" />
          <line x1={CX} y1={CY - 33} x2={CX} y2={CY + 33}
            stroke={AMBER} strokeWidth="0.4" strokeOpacity="0.20" />
        </g>

        {/* ── CENTRE GLOW + POINT ── */}
        <circle cx={CX} cy={CY} r="90" fill="url(#hm-center)" />
        <circle cx={CX} cy={CY} r="5.5" fill={AMBER} fillOpacity="0.70" filter="url(#hm-glow)">
          <animate attributeName="r"            values="5.5;7.5;5.5" dur="3s" repeatCount="indefinite" />
          <animate attributeName="fillOpacity"  values="0.70;1;0.70"  dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r="2.2" fill="#ffffff" fillOpacity="0.85" />

        {/* ── FAINT AXES ── */}
        <line x1={CX - 400} y1={CY} x2={CX + 400} y2={CY}
          stroke={GOLD} strokeWidth="0.3" strokeOpacity="0.05" />
        <line x1={CX} y1={CY - 400} x2={CX} y2={CY + 400}
          stroke={GOLD} strokeWidth="0.3" strokeOpacity="0.05" />

        {/* ── CORNER BRACKETS ── */}
        {([
          [50,  40,  1,  1],
          [1350, 40, -1,  1],
          [50,  660,  1, -1],
          [1350,660, -1, -1],
        ] as [number,number,number,number][]).map(([x, y, dx, dy], i) => (
          <g key={i} stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.14" fill="none">
            <line x1={x} y1={y} x2={x + dx * 55} y2={y} />
            <line x1={x} y1={y} x2={x}             y2={y + dy * 55} />
            <line x1={x + dx*14} y1={y} x2={x} y2={y + dy*14} />
          </g>
        ))}

        {/* ── SCATTER CROSS MARKS ── */}
        {([
          [190, 115], [1120, 140], [280, 555],
          [1160, 510], [130, 355], [1270, 210],
          [420, 80],  [980, 590],
        ] as [number, number][]).map(([x, y], i) => (
          <g key={i} stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.13">
            <line x1={x - 7} y1={y}     x2={x + 7} y2={y} />
            <line x1={x}     y1={y - 7} x2={x}     y2={y + 7} />
          </g>
        ))}

        {/* ── DOT GRIDS (two corners) ── */}
        {Array.from({ length: 16 }, (_, i) => {
          const col = i % 4, row = Math.floor(i / 4);
          return <circle key={i} cx={1210 + col * 18} cy={70 + row * 18} r="1.2" fill={GOLD} fillOpacity="0.14" />;
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const col = i % 4, row = Math.floor(i / 4);
          return <circle key={i} cx={195 + col * 18} cy={590 + row * 18} r="1.2" fill={GOLD} fillOpacity="0.11" />;
        })}

        {/* ── SMALL TICK RULER (right edge) ── */}
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} stroke={GOLD} strokeOpacity="0.12" fill="none">
            <line x1={1340} y1={200 + i * 40} x2={i % 4 === 0 ? 1320 : 1330} y2={200 + i * 40} strokeWidth="0.6" />
          </g>
        ))}
      </svg>
    </div>
  );
}
