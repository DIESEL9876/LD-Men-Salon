import type { TextStyle } from 'react-native';

// Premium type scale — tight tracking on large sizes, eyebrow labels in caps.
export const typography = {
  display: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1.2,
    lineHeight: 46,
  } satisfies TextStyle,
  hero: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 38,
  } satisfies TextStyle,
  h1: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 32,
  } satisfies TextStyle,
  h2: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 26,
  } satisfies TextStyle,
  h3: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.1,
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  } satisfies TextStyle,
  bodyStrong: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  } satisfies TextStyle,
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  } satisfies TextStyle,
  micro: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  } satisfies TextStyle,
  // All-caps eyebrow / category label
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    lineHeight: 14,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  button: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 20,
  } satisfies TextStyle,
  // Monospaced-feel numerals for stats
  numeral: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1.5,
    lineHeight: 48,
  } satisfies TextStyle,
};

export type TypographyVariant = keyof typeof typography;
