import { DEFAULT_COLORS } from "./colors";

export const RADII = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 28,
  curve: 42,
  pill: 999,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 7,
  },
  floating: {
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  glow: {
    shadowColor: DEFAULT_COLORS.orange,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.42,
    shadowRadius: 18,
    elevation: 12,
  },
  soft: {
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

export const SURFACES = {
  background: DEFAULT_COLORS.homeBackground,
  card: DEFAULT_COLORS.cardDark,
  cardAlt: DEFAULT_COLORS.cardDarkAlt,
  surfaceLight: DEFAULT_COLORS.homeSurfaceLight,
  fill: DEFAULT_COLORS.white_06,
  fillStrong: DEFAULT_COLORS.white_08,
  overlay: DEFAULT_COLORS.overlayDark_45,
  overlayStrong: DEFAULT_COLORS.overlayDark_95,
} as const;

export const BORDERS = {
  subtle: DEFAULT_COLORS.white_08,
  divider: DEFAULT_COLORS.white_12,
  highlight: DEFAULT_COLORS.purpleBorder_35,
  highlightStrong: DEFAULT_COLORS.purpleBorder_65,
  cta: DEFAULT_COLORS.orangeBorder_85,
  ctaSoft: DEFAULT_COLORS.orangeBorder_45,
} as const;

export const TEXT_TONES = {
  primary: DEFAULT_COLORS.white,
  muted: DEFAULT_COLORS.textMuted,
  mutedLight: DEFAULT_COLORS.textMutedLight,
  accent: DEFAULT_COLORS.purpleBright,
  cta: DEFAULT_COLORS.orange,
} as const;

export const eyebrowText = {
  color: TEXT_TONES.accent,
  fontSize: 12,
  letterSpacing: 2,
  textTransform: "uppercase",
  fontWeight: "700",
} as const;
