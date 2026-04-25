import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';

export function EmptyState({
  icon = 'inbox',
  title,
  subtitle,
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: radius.pill,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={28} color={colors.textTertiary} />
      </View>
      <View style={{ gap: spacing.xxs, alignItems: 'center' }}>
        <Text variant="h2" align="center">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" tone="secondary" align="center">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
