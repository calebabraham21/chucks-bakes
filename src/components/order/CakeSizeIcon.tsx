import type { CAKE_SIZES } from '../../lib/constants';

type CakeSize = (typeof CAKE_SIZES)[number]['value'];

interface Tier {
  width: number;
  height: number;
  layers?: number;
}

interface CakeSpec {
  shape: 'round' | 'sheet';
  /** Listed bottom tier first. */
  tiers: Tier[];
}

const CAKE_SPECS: Record<CakeSize, CakeSpec> = {
  '6in-3layer': { shape: 'round', tiers: [{ width: 20, height: 23, layers: 3 }] },
  '8in-3layer': { shape: 'round', tiers: [{ width: 36, height: 23, layers: 3 }] },
  '2tier': { shape: 'round', tiers: [{ width: 36, height: 13 }, { width: 20, height: 12 }] },
  '3tier': { shape: 'round', tiers: [{ width: 40, height: 9 }, { width: 26, height: 10 }, { width: 12, height: 8 }] },
  'quarter-sheet': { shape: 'sheet', tiers: [{ width: 28, height: 16 }] },
  'half-sheet': { shape: 'sheet', tiers: [{ width: 40, height: 16 }] },
};

const COLORS = {
  sponge: '#fdf0e8',
  outline: '#f0c8a0',
  frosting: '#ffb3cc',
  highlight: '#ffc6d9',
};

const VIEWBOX = 44;
const STROKE = 1.2;
const CAP_HEIGHT = 6;
/** How far the frosting cap reaches down over the top of its tier; the tier above sits behind it. */
const CAP_OVERLAP = 2;
/** Frosting is wider than the sponge so the sponge outline never shows beside it. */
const CAP_OVERHANG = 1;
const HIGHLIGHT_RY = 2.5;

/** Rounded top corners, near-square bottom corners so the cap fully covers the sponge's top edge. */
function capPath(x: number, y: number, w: number) {
  const rt = 3;
  const rb = 1;
  return `M${x} ${y + rt}a${rt} ${rt} 0 0 1 ${rt}-${rt}h${w - 2 * rt}a${rt} ${rt} 0 0 1 ${rt} ${rt}v${CAP_HEIGHT - rt - rb}a${rb} ${rb} 0 0 1-${rb} ${rb}h-${w - 2 * rb}a${rb} ${rb} 0 0 1-${rb}-${rb}z`;
}

function layoutCake({ shape, tiers }: CakeSpec) {
  let base = 0;
  const placed = tiers.map((tier) => {
    const top = base - tier.height;
    const capTop = top - (CAP_HEIGHT - CAP_OVERLAP);
    const placedTier = { ...tier, x: (VIEWBOX - tier.width) / 2, top, bottom: base, capTop };
    base = capTop + CAP_OVERLAP;
    return placedTier;
  });

  const highest = placed[placed.length - 1].capTop - (shape === 'round' ? HIGHLIGHT_RY : 0);
  const lowest = STROKE / 2;
  const dy = Math.round((VIEWBOX / 2 - (highest + lowest) / 2) * 2) / 2;

  return placed.map((t) => ({ ...t, top: t.top + dy, bottom: t.bottom + dy, capTop: t.capTop + dy }));
}

export function CakeSizeIcon({ size }: { size: CakeSize }) {
  const spec = CAKE_SPECS[size];
  const tiers = layoutCake(spec);
  const topTier = tiers[tiers.length - 1];
  const capX = topTier.x - CAP_OVERHANG;
  const capW = topTier.width + CAP_OVERHANG * 2;

  return (
    <svg width={VIEWBOX} height={VIEWBOX} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} fill="none" aria-hidden="true">
      <g fill={COLORS.sponge} stroke={COLORS.outline} strokeWidth={STROKE}>
        {tiers.map((t) => (
          <rect key={t.top} x={t.x} y={t.top} width={t.width} height={t.bottom - t.top} rx={2} />
        ))}
        {tiers.flatMap((t) => {
          const layers = t.layers ?? 1;
          const visibleTop = t.capTop + CAP_HEIGHT;
          const step = (t.bottom - visibleTop) / layers;
          return Array.from({ length: layers - 1 }, (_, i) => {
            const y = visibleTop + step * (i + 1);
            return <line key={`${t.top}-${i}`} x1={t.x} y1={y} x2={t.x + t.width} y2={y} />;
          });
        })}
      </g>
      <g fill={COLORS.frosting}>
        {tiers.map((t) => (
          <path key={t.top} d={capPath(t.x - CAP_OVERHANG, t.capTop, t.width + CAP_OVERHANG * 2)} />
        ))}
      </g>
      {spec.shape === 'round' ? (
        <ellipse cx={VIEWBOX / 2} cy={topTier.capTop} rx={capW / 2} ry={HIGHLIGHT_RY} fill={COLORS.highlight} />
      ) : (
        <rect x={capX + 2} y={topTier.capTop + 1} width={capW - 4} height={2} rx={1} fill={COLORS.highlight} />
      )}
    </svg>
  );
}
