import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import type { TypographyVariant } from '../theme';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'dim' | 'gold' | 'inverse' | 'danger' | 'success';

export function Text({
  variant = 'body',
  tone = 'primary',
  align = 'right',
  style,
  children,
  ...rest
}: TextProps & {
  variant?: TypographyVariant;
  tone?: Tone;
  align?: 'right' | 'left' | 'center';
}) {
  const toneColor = {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    dim: colors.textDim,
    gold: colors.gold,
    inverse: colors.textInverse,
    danger: colors.danger,
    success: colors.success,
  }[tone];

  return (
    <RNText
      style={[typography[variant], { color: toneColor, textAlign: align, writingDirection: 'rtl' }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

// small convenience wrappers
export const Eyebrow = (props: React.ComponentProps<typeof Text>) => (
  <Text variant="eyebrow" tone="gold" {...props} />
);
