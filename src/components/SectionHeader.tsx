import React from 'react';
import { View } from 'react-native';
import { spacing } from '../theme';
import { Text } from './Text';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  trailing,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View style={{ gap: spacing.xxs, marginBottom: spacing.xs }}>
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ flex: 1, gap: spacing.xxs }}>
          {eyebrow ? <Text variant="eyebrow" tone="gold">{eyebrow}</Text> : null}
          <Text variant="h1" tone="primary">{title}</Text>
        </View>
        {trailing ? <View>{trailing}</View> : null}
      </View>
      {subtitle ? (
        <Text variant="body" tone="secondary">{subtitle}</Text>
      ) : null}
    </View>
  );
}
