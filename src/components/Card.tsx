import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

type Tone = 'default' | 'elevated' | 'subtle' | 'gold' | 'hero';

export function Card({
  children,
  onPress,
  selected,
  tone = 'default',
  padding = 'md',
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  tone?: Tone;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  style?: ViewStyle;
}) {
  const pad = padding === 'none' ? 0 : padding === 'sm' ? spacing.md : padding === 'lg' ? spacing.lg : spacing.md + 4;

  const baseStyle: ViewStyle = {
    backgroundColor:
      tone === 'elevated'
        ? colors.surfaceElevated
        : tone === 'subtle'
        ? colors.surfaceSubtle
        : tone === 'gold'
        ? colors.goldTint
        : tone === 'hero'
        ? colors.surfaceElevated
        : colors.surface,
    borderRadius: tone === 'hero' ? radius.xl : radius.lg,
    borderWidth: 1,
    borderColor: selected
      ? colors.gold
      : tone === 'gold'
      ? colors.borderGold
      : colors.border,
    padding: pad,
    gap: spacing.xs,
  };

  const content = (
    <View style={[baseStyle, tone === 'hero' ? shadows.elevated : shadows.subtle, style]}>
      {children}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] })}
    >
      {content}
    </Pressable>
  );
}
