import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';
import { Text } from './Text';

export function Avatar({
  name,
  size = 48,
  tone = 'default',
  style,
}: {
  name?: string;
  size?: number;
  tone?: 'default' | 'gold';
  style?: ViewStyle;
}) {
  const initials = (name ?? '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

  const bg = tone === 'gold' ? colors.goldTint : colors.surfaceElevated;
  const border = tone === 'gold' ? colors.borderGold : colors.borderStrong;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        variant={size >= 64 ? 'h2' : 'bodyStrong'}
        tone={tone === 'gold' ? 'gold' : 'primary'}
        align="center"
        style={{ letterSpacing: 0 }}
      >
        {initials || '—'}
      </Text>
    </View>
  );
}
