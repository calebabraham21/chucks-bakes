import type { CAKE_FILLINGS, CAKE_FLAVORS, CAKE_TOPPINGS, SMBC_FLAVORS } from '../../lib/constants';

type Flavor = (typeof CAKE_FLAVORS)[number]['value'];
type Filling = (typeof CAKE_FILLINGS)[number]['value'];
type Frosting = (typeof SMBC_FLAVORS)[number]['value'];
export type Topping = (typeof CAKE_TOPPINGS)[number]['value'];

/** The subset of the cake form the icon reflects; every field may still be empty mid-form. */
export interface CakeChoices {
  flavor?: string;
  filling?: string;
  frostingFlavor?: string;
  toppings?: readonly string[];
  colors?: string;
}

export interface CakePalette {
  sponge: string;
  crumb: string;
  filling: string;
  frosting: string;
  frostingTop: string;
  frostingEdge: string;
  speckles: string[] | null;
  toppings: ReadonlySet<Topping>;
}

const BRAND_FROSTING = '#ffb3cc';
const DEFAULT_SPONGE = '#fdf0e8';

const SPONGE: Record<Flavor, string> = {
  vanilla: '#fcefd6',
  chocolate: '#7b4a36',
  funfetti: '#fdf3e1',
  spice: '#e3b07c',
  'orange-olive-oil': '#f8d98f',
  almond: '#f7e8d2',
  coconut: '#fffaf1',
  'gf-chocolate': '#7b4a36',
  'gf-vanilla': '#fcefd6',
};

const FILLING: Record<Exclude<Filling, 'none'>, string> = {
  'raspberry-jam': '#d6336c',
  'cookies-and-cream': '#8f8079',
  'chocolate-buttercream': '#9a6448',
  'chocolate-ganache': '#4b2a1f',
  'cream-cheese': '#fff6e9',
  'coconut-cream-cheese': '#fffaf3',
  'espresso-pastry-cream': '#c99a6a',
};

const FROSTING_BY_FLAVOR: Partial<Record<Frosting, string>> = {
  chocolate: '#8a5a44',
};

/**
 * Pastel frosting tints for colour words customers type into the free-text "Colors" field.
 * Multi-word names come first so "baby blue" wins over "blue".
 */
const COLOR_WORDS: [string, string][] = [
  ['hot pink', '#ff7eb3'],
  ['baby pink', '#ffc9db'],
  ['baby blue', '#bcdcf5'],
  ['light blue', '#bcdcf5'],
  ['sky blue', '#a9d4f5'],
  ['dusty rose', '#e8a9b5'],
  ['pink', BRAND_FROSTING],
  ['rose', '#f5a3b5'],
  ['blush', '#f9c6cf'],
  ['red', '#f07a7a'],
  ['coral', '#ffa38a'],
  ['peach', '#ffc6a5'],
  ['orange', '#ffb36b'],
  ['yellow', '#ffe38f'],
  ['lemon', '#fff09a'],
  ['gold', '#ecc76e'],
  ['mint', '#b8e8d0'],
  ['sage', '#bccaa6'],
  ['green', '#a9d8a3'],
  ['teal', '#8fd4cf'],
  ['turquoise', '#8fe0dc'],
  ['navy', '#56679a'],
  ['blue', '#a9c6f0'],
  ['periwinkle', '#b9bff2'],
  ['lavender', '#cfbaf0'],
  ['lilac', '#d8bdec'],
  ['purple', '#b893dc'],
  ['violet', '#b893dc'],
  ['ivory', '#f8efdc'],
  ['cream', '#f8efdc'],
  ['white', '#fbf8f4'],
  ['silver', '#d9dade'],
  ['gray', '#cfd0d6'],
  ['grey', '#cfd0d6'],
  ['black', '#3d3536'],
  ['brown', '#a77b5c'],
];

const FUNFETTI_SPECKLES = ['#ff6b9d', '#6ec3f4', '#ffd447', '#7fd88f', '#b98cf0'];

function findColorWord(text: string): string | undefined {
  const lower = text.toLowerCase();
  let best: { index: number; color: string } | undefined;
  for (const [word, color] of COLOR_WORDS) {
    const match = new RegExp(`\\b${word}\\b`).exec(lower);
    if (match && (!best || match.index < best.index)) best = { index: match.index, color };
  }
  return best?.color;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mix(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `#${ca.map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

export function cakePalette(choices: CakeChoices = {}): CakePalette {
  const sponge = SPONGE[choices.flavor as Flavor] ?? DEFAULT_SPONGE;
  const frosting =
    FROSTING_BY_FLAVOR[choices.frostingFlavor as Frosting] ||
    (choices.colors && findColorWord(choices.colors)) ||
    BRAND_FROSTING;
  const filling =
    FILLING[choices.filling as Exclude<Filling, 'none'>] ?? mix(frosting, '#ffffff', 0.15);

  return {
    sponge,
    crumb: mix(sponge, '#5a3424', 0.28),
    filling,
    frosting,
    frostingTop: mix(frosting, '#ffffff', 0.38),
    frostingEdge: mix(frosting, '#6b2a3a', 0.22),
    speckles: choices.flavor === 'funfetti' ? FUNFETTI_SPECKLES : null,
    toppings: new Set((choices.toppings ?? []) as Topping[]),
  };
}
