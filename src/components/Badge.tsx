import React from 'react';
import { View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';

type BadgeTone = 'neutral' | 'gold' | 'success' | 'danger';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  const palette = {
    neutral: { bg: colors.surfaceElevated, border: colors.border, text: 'secondary' as const },
    gold: { bg: colors.goldTint, border: colors.borderGold, text: 'gold' as const },
    success: { bg: 'rgba(155,188,161,0.12)', border: 'rgba(155,188,161,0.35)', text: 'success' as const },
    danger: { bg: 'rgba(217,133,133,0.12)', border: 'rgba(217,133,133,0.35)', text: 'danger' as const },
  }[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.pill,
      }}
    >
      <Text variant="micro" tone={palette.text} style={{ letterSpacing: 0.6 }}>
        {label}
      </Text>
    </View>
  );
}
