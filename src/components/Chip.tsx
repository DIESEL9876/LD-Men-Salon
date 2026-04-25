import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';

export function Chip({
  label,
  sublabel,
  active,
  onPress,
  style,
}: {
  label: string;
  sublabel?: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: active ? colors.gold : colors.border,
          backgroundColor: active ? colors.gold : colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 68,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text variant="bodyStrong" tone={active ? 'inverse' : 'primary'} align="center">
        {label}
      </Text>
      {sublabel ? (
        <Text variant="micro" tone={active ? 'inverse' : 'tertiary'} align="center">
          {sublabel}
        </Text>
      ) : null}
    </Pressable>
  );
}
