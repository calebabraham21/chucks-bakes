import { useId } from 'react';
import type { CAKE_SIZES } from '../../lib/constants';
import { cakePalette, type CakeChoices, type CakePalette } from './cakeIconPalette';
import styles from './CakeSizeIcon.module.css';

type CakeSize = (typeof CAKE_SIZES)[number]['value'];

interface Tier {
  width: number;
  height: number;
  layers: number;
}

interface CakeSpec {
  shape: 'round' | 'sheet';
  /** Listed bottom tier first. */
  tiers: Tier[];
  /** Foreshortened front-to-back depth of a sheet cake's top. */
  depth?: number;
}

const CAKE_SPECS: Record<CakeSize, CakeSpec> = {
  '6in-3layer': { shape: 'round', tiers: [{ width: 22, height: 18, layers: 3 }] },
  '8in-3layer': { shape: 'round', tiers: [{ width: 34, height: 18, layers: 3 }] },
  '2tier': { shape: 'round', tiers: [{ width: 34, height: 11, layers: 2 }, { width: 20, height: 10, layers: 2 }] },
  '3tier': {
    shape: 'round',
    tiers: [{ width: 35, height: 8, layers: 2 }, { width: 25, height: 8, layers: 2 }, { width: 15, height: 7, layers: 1 }],
  },
  'quarter-sheet': { shape: 'sheet', tiers: [{ width: 28, height: 12, layers: 2 }], depth: 6 },
  'half-sheet': { shape: 'sheet', tiers: [{ width: 37, height: 12, layers: 2 }], depth: 7 },
};

const VIEWBOX = 48;
/** Ellipse height-to-width ratio: how far above the cakes the viewer sits. */
const TILT = 0.22;
const OVERHANG = 0.8;
const SKIRT = 1.2;
const BOARD_MARGIN = 3.5;
const BOARD_THICKNESS = 1.2;
/** Space a lit candle needs above the top surface. */
const CANDLE_HEADROOM = 12.5;

const SPRINKLE_SPOTS: [number, number, number][] = [
  [-0.55, -0.1, 30], [0.15, -0.35, 70], [0.45, 0.25, 10], [-0.2, 0.4, -40],
  [0.62, -0.2, 50], [-0.05, 0.05, -80], [-0.42, -0.45, 85], [0.3, 0.55, -20],
];
const SPRINKLE_COLORS = ['#ff6b9d', '#6ec3f4', '#ffd447', '#7fd88f', '#ffffff', '#b98cf0'];
const SPECKLE_SPOTS: [number, number][] = [[-0.6, 0.35], [-0.2, 0.75], [0.25, 0.4], [0.62, 0.7], [0.05, 0.9], [-0.45, 0.85]];
const DRIP_DEPTHS = [0.55, 1, 0.4, 0.8, 0.6];

const r1 = (v: number) => Math.round(v * 10) / 10;
type Point = readonly [number, number];

/**
 * Samples the lower edge of a frosting skirt: coarse along the plain edge, dense inside each drip
 * so the rounded drip ends stay smooth without bloating the path.
 */
function skirtEdge(from: number, to: number, maxDepth: number, baseY: (x: number) => number): Point[] {
  const count = to - from > 26 ? 5 : to - from > 16 ? 4 : 3;
  const span = (to - from) * 0.72;
  const width = Math.min(1.7, Math.max(1.1, (to - from) * 0.06));
  const drips = Array.from({ length: count }, (_, k) => ({
    center: (from + to) / 2 - span / 2 + (span * k) / (count - 1),
    depth: maxDepth * DRIP_DEPTHS[k],
  }));

  const xs = new Set<number>([r1(to)]);
  for (let x = from; x < to; x += 2) xs.add(r1(x));
  for (const d of drips) for (let i = -4; i <= 4; i++) xs.add(r1(d.center + (width * i) / 4));

  return [...xs]
    .sort((a, b) => a - b)
    .map((x) => {
      let depth = 0;
      for (const d of drips) {
        const u = Math.abs(x - d.center) / width;
        if (u < 1) depth = Math.max(depth, d.depth * (1 - u ** 2.4) ** (1 / 2.4));
      }
      return [x, r1(baseY(x) + depth)];
    });
}

const polyline = (points: readonly Point[]) => points.map(([x, y]) => `L${x} ${y}`).join('');

function spread(count: number, at: (t: number) => Point): Point[] {
  return Array.from({ length: count }, (_, i) => at(i / (count - 1)));
}

interface PlacedTier extends Tier {
  cx: number;
  rx: number;
  /** Centre of the bottom face (round) or bottom front edge (sheet). */
  base: number;
  /** Centre of the top face (round) or top front edge (sheet). */
  top: number;
}

function layoutCake(spec: CakeSpec) {
  let base = 0;
  const tiers: PlacedTier[] = spec.tiers.map((tier) => {
    const placed = { ...tier, cx: VIEWBOX / 2, rx: tier.width / 2, base, top: base - tier.height };
    base = placed.top;
    return placed;
  });
  const topTier = tiers[tiers.length - 1];
  const boardRx = tiers[0].rx + BOARD_MARGIN;
  const isRound = spec.shape === 'round';
  const depth = spec.depth ?? 0;

  const highest = isRound ? topTier.top - (topTier.rx + OVERHANG) * TILT : topTier.top - depth;
  const lowest = (isRound ? boardRx * TILT : 2.5) + BOARD_THICKNESS + 1.5;
  const surface = isRound ? topTier.top : topTier.top - depth / 2;

  let dy = VIEWBOX / 2 - (highest + lowest) / 2;
  dy = Math.max(dy, 1 + CANDLE_HEADROOM - surface);
  dy = Math.round(dy * 2) / 2;

  return { tiers, topTier, boardRx, depth, surface, dy };
}

interface TierArt {
  body: string;
  skirt: string;
  top: { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number } | { kind: 'path'; d: string };
  fillings: string[];
  speckles: Point[];
  pearls: Point[];
  piping: Point[];
  pipingR: number;
  sprinkles: { cx: number; cy: number; rx: number; ry: number; count: number };
}

function roundTierArt({ cx, rx, base, top, layers }: PlacedTier): TierArt {
  const ry = rx * TILT;
  const R = rx + OVERHANG;
  const rTop = R * TILT;
  const visibleTop = top + SKIRT + rTop;
  const edge = skirtEdge(cx - R, cx + R, Math.min((base - visibleTop) * 0.6, 5), (x) => {
    const u = (x - cx) / R;
    return top + SKIRT + rTop * Math.sqrt(Math.max(0, 1 - u * u));
  });
  const frontArc = (y: number, a: number, b: number, spacing: number, inset: number) =>
    spread(Math.max(3, Math.round((Math.PI * a) / spacing)), (t) => {
      const theta = Math.PI * (1 - inset - (1 - 2 * inset) * t);
      return [r1(cx + a * Math.cos(theta)), r1(y + b * Math.sin(theta))];
    });

  return {
    body: `M${r1(cx - rx)} ${top}V${base}A${rx} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${base}V${top}Z`,
    skirt: `M${r1(cx - R)} ${top}${polyline(edge)}L${r1(cx + R)} ${top}A${R} ${r1(rTop)} 0 0 0 ${r1(cx - R)} ${top}Z`,
    top: { kind: 'ellipse', cx, cy: top, rx: R, ry: r1(rTop) },
    fillings: Array.from({ length: layers - 1 }, (_, i) => {
      const y = r1(top + SKIRT + ((base - top - SKIRT) * (i + 1)) / layers);
      return `M${r1(cx - rx + 0.4)} ${y}A${rx} ${r1(ry)} 0 0 0 ${r1(cx + rx - 0.4)} ${y}`;
    }),
    speckles: SPECKLE_SPOTS.slice(0, rx > 12 ? 6 : 4).map(([u, v]) => [r1(cx + u * rx), r1(visibleTop + v * (base - visibleTop))]),
    pearls: frontArc(base - 0.4, rx, ry, 2.3, 0.04),
    piping: frontArc(top, R - 0.4, rTop, 3.4, 0.1),
    pipingR: r1(Math.min(1, 0.5 + R * 0.03)),
    sprinkles: { cx, cy: top, rx: R * 0.72, ry: rTop * 0.62, count: R > 12 ? 8 : R > 8 ? 6 : 4 },
  };
}

function sheetTierArt({ cx, rx, base, top, layers }: PlacedTier, depth: number): TierArt {
  const x0 = cx - rx;
  const x1 = cx + rx;
  const fx0 = r1(x0 - OVERHANG);
  const fx1 = r1(x1 + OVERHANG);
  const back = top - depth;
  const edge = skirtEdge(fx0, fx1, Math.min((base - top - SKIRT) * 0.6, 5), () => top + SKIRT).reverse();
  const backEdge = `M${fx0} ${back + 2}Q${fx0} ${back} ${r1(fx0 + 2)} ${back}H${r1(fx1 - 2)}Q${fx1} ${back} ${fx1} ${back + 2}`;
  const row = (y: number, from: number, to: number, spacing: number) =>
    spread(Math.max(3, Math.round((to - from) / spacing)), (t) => [r1(from + (to - from) * t), r1(y)]);

  return {
    body: `M${x0} ${top}V${base - 1.5}Q${x0} ${base} ${x0 + 1.5} ${base}H${x1 - 1.5}Q${x1} ${base} ${x1} ${base - 1.5}V${top}Z`,
    skirt: `${backEdge}${polyline(edge)}Z`,
    top: { kind: 'path', d: `${backEdge}V${top}H${fx0}Z` },
    fillings: Array.from({ length: layers - 1 }, (_, i) => {
      const y = r1(top + SKIRT + ((base - top - SKIRT) * (i + 1)) / layers);
      return `M${x0 + 0.4} ${y}H${x1 - 0.4}`;
    }),
    speckles: SPECKLE_SPOTS.map(([u, v]) => [r1(cx + u * rx), r1(top + SKIRT + 1 + v * (base - top - SKIRT - 2))]),
    pearls: row(base - 0.4, x0 + 1, x1 - 1, 2.3),
    piping: row(top, fx0 + 1.6, fx1 - 1.6, 3.4),
    pipingR: 0.95,
    sprinkles: { cx, cy: top - depth / 2, rx: rx * 0.8, ry: depth * 0.32, count: rx > 15 ? 8 : 6 },
  };
}

function Dots({ points, r }: { points: readonly Point[]; r: number }) {
  return points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} />);
}

function Sprinkles({ cx, cy, rx, ry, count }: TierArt['sprinkles']) {
  return (
    <g strokeWidth={0.75} strokeLinecap="round">
      {SPRINKLE_SPOTS.slice(0, count).map(([u, v, angle], i) => {
        const x = cx + u * rx;
        const y = cy + v * ry;
        const dx = 0.7 * Math.cos((angle * Math.PI) / 180);
        const dy = 0.42 * Math.sin((angle * Math.PI) / 180);
        return <path key={i} d={`M${r1(x - dx)} ${r1(y - dy)}l${r1(dx * 2)} ${r1(dy * 2)}`} stroke={SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]} />;
      })}
    </g>
  );
}

function TierDrawing({ art, p, ids, id, isTop }: { art: TierArt; p: CakePalette; ids: Ids; id: string; isTop: boolean }) {
  const { top } = art;
  const topShape = (fill: string) =>
    top.kind === 'ellipse' ? <ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} fill={fill} /> : <path d={top.d} fill={fill} />;

  return (
    <g>
      <defs>
        <path id={`${id}b`} d={art.body} />
        <path id={`${id}s`} d={art.skirt} />
      </defs>
      <use href={`#${id}b`} fill={p.sponge} stroke={p.crumb} strokeWidth={0.8} />
      {p.speckles && (
        <g>
          {art.speckles.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.55} fill={p.speckles![i % p.speckles!.length]} />
          ))}
        </g>
      )}
      <g stroke={p.filling} strokeWidth={1.3}>
        {art.fillings.map((d) => <path key={d} d={d} />)}
      </g>
      <use href={`#${id}b`} fill={`url(#${ids.shade})`} />
      {p.toppings.has('pearls') && (
        <g fill="#fffdf8" stroke="#dccbbf" strokeWidth={0.3}>
          <Dots points={art.pearls} r={0.8} />
        </g>
      )}
      <use href={`#${id}s`} fill={p.frosting} stroke={p.frostingEdge} strokeWidth={0.5} strokeLinejoin="round" />
      <use href={`#${id}s`} fill={`url(#${ids.shade})`} />
      {topShape(p.frostingTop)}
      {topShape(`url(#${ids.gloss})`)}
      {isTop && p.toppings.has('sprinkles') && <Sprinkles {...art.sprinkles} />}
      <g fill={p.frostingTop} stroke={p.frosting} strokeWidth={0.4}>
        <Dots points={art.piping} r={art.pipingR} />
      </g>
    </g>
  );
}

function Sparkle({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  const [cx, cy, s] = [r1(x), r1(y), size];
  return (
    <path
      className={styles.sparkle}
      d={`M${cx} ${r1(cy - s)}Q${cx} ${cy} ${r1(cx + s)} ${cy}Q${cx} ${cy} ${cx} ${r1(cy + s)}Q${cx} ${cy} ${r1(cx - s)} ${cy}Q${cx} ${cy} ${cx} ${r1(cy - s)}Z`}
      fill={fill}
    />
  );
}

interface Ids {
  shade: string;
  gloss: string;
  shadow: string;
  flame: string;
}

interface CakeSizeIconProps {
  size: CakeSize;
  /** Live order choices; the icon tints sponge, filling and frosting and shows toppings to match. */
  choices?: CakeChoices;
  selected?: boolean;
}

export function CakeSizeIcon({ size, choices, selected = false }: CakeSizeIconProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids: Ids = { shade: `${uid}sh`, gloss: `${uid}gl`, shadow: `${uid}sd`, flame: `${uid}fl` };
  const spec = CAKE_SPECS[size];
  const palette = cakePalette(choices);
  const { tiers, topTier, boardRx, depth, surface, dy } = layoutCake(spec);
  const isRound = spec.shape === 'round';
  const bottom = tiers[0];
  const boardRy = isRound ? r1(boardRx * TILT) : 2.5;
  const topR = topTier.rx + OVERHANG;
  const hasCherry = palette.toppings.has('cherries');
  const candleX = r1(hasCherry ? topTier.cx - topR * 0.36 : topTier.cx);
  const s = (offset: number) => r1(surface - offset);

  return (
    <svg
      width={VIEWBOX}
      height={VIEWBOX}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      fill="none"
      aria-hidden="true"
      className={`${styles.root} ${selected ? styles.selected : ''}`}
    >
      <defs>
        <linearGradient id={ids.shade}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.28" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#3b1d14" stopOpacity="0.16" />
        </linearGradient>
        <radialGradient id={ids.gloss} cx="0.36" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.shadow}>
          <stop offset="0" stopColor="#6b2a3a" stopOpacity="0.2" />
          <stop offset="1" stopColor="#6b2a3a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.flame} cx="0.5" cy="0.7" r="0.6">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset="0.45" stopColor="#ffd34d" />
          <stop offset="1" stopColor="#ff8a1f" />
        </radialGradient>
      </defs>

      <g transform={`translate(0 ${dy})`}>
        <ellipse
          className={styles.shadow}
          cx={VIEWBOX / 2}
          cy={r1(boardRy + BOARD_THICKNESS + 0.6)}
          rx={r1(boardRx + 1.5)}
          ry={r1(Math.max(boardRy, 2) + 0.8)}
          fill={`url(#${ids.shadow})`}
        />
        <g className={styles.float}>
          {isRound ? (
            <>
              <ellipse cx={VIEWBOX / 2} cy={BOARD_THICKNESS} rx={boardRx} ry={boardRy} fill="#f4c3d2" />
              <ellipse cx={VIEWBOX / 2} cy={0} rx={boardRx} ry={boardRy} fill="#fffafb" stroke="#f0bccb" strokeWidth={0.5} />
            </>
          ) : (
            <>
              <rect x={bottom.cx - boardRx} y={-depth - 1.5 + BOARD_THICKNESS} width={boardRx * 2} height={depth + 4} rx={1.5} fill="#f4c3d2" />
              <rect x={bottom.cx - boardRx} y={-depth - 1.5} width={boardRx * 2} height={depth + 4} rx={1.5} fill="#fffafb" stroke="#f0bccb" strokeWidth={0.5} />
            </>
          )}

          <g className={styles.cake}>
            {tiers.map((t, i) => (
              <TierDrawing
                key={i}
                art={isRound ? roundTierArt(t) : sheetTierArt(t, depth)}
                p={palette}
                ids={ids}
                id={`${uid}t${i}`}
                isTop={i === tiers.length - 1}
              />
            ))}

            {hasCherry && (
              <g transform={selected ? `translate(${r1(topR * 0.32)} 0)` : undefined}>
                <path d={`M${topTier.cx} ${s(2.6)}q0.4-2.4 2-3.4`} stroke="#5d8a3a" strokeWidth={0.6} strokeLinecap="round" />
                <circle cx={topTier.cx} cy={s(1.3)} r={2} fill="#d7263d" stroke="#a3172b" strokeWidth={0.4} />
                <circle cx={topTier.cx - 0.7} cy={s(2)} r={0.55} fill="#fff" fillOpacity={0.75} />
              </g>
            )}

            <g className={styles.candle}>
              <rect x={r1(candleX - 0.9)} y={s(6.6)} width={1.8} height={6.6} rx={0.4} fill="#fff" stroke="#f08fb0" strokeWidth={0.4} />
              <g fill="#ff8fb5">
                <rect x={r1(candleX - 0.9)} y={s(5.2)} width={1.8} height={0.8} />
                <rect x={r1(candleX - 0.9)} y={s(2.8)} width={1.8} height={0.8} />
              </g>
              <path d={`M${candleX} ${s(6.6)}v-1`} stroke="#5a4a42" strokeWidth={0.4} strokeLinecap="round" />
              <g className={styles.flame}>
                <circle cx={candleX} cy={s(9.4)} r={3} fill="#ffd36b" fillOpacity={0.3} />
                <path
                  d={`M${candleX} ${s(12.2)}C${r1(candleX + 1.7)} ${s(10.2)} ${r1(candleX + 1.6)} ${s(7.9)} ${candleX} ${s(7.5)}C${r1(candleX - 1.6)} ${s(7.9)} ${r1(candleX - 1.7)} ${s(10.2)} ${candleX} ${s(12.2)}Z`}
                  fill={`url(#${ids.flame})`}
                />
              </g>
            </g>
          </g>

          {palette.toppings.has('edible-glitter') && (
            <g stroke="#e0a82e" strokeWidth={0.3}>
              <Sparkle x={Math.max(3, topTier.cx - topR - 3)} y={surface - 1.5} size={1.9} fill="#fff6d6" />
              <Sparkle x={Math.min(45, bottom.cx + bottom.rx + 1.5)} y={(surface + bottom.base) / 2 + 1} size={1.5} fill="#ffe08a" />
              <Sparkle x={Math.min(45, topTier.cx + topR + 2.2)} y={surface - 5} size={1.2} fill="#fff6d6" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
