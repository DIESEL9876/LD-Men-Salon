import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';

export function StatTile({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string | number;
  icon?: keyof typeof Feather.glyphMap;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: highlight ? colors.goldTint : colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: highlight ? colors.borderGold : colors.border,
        padding: spacing.md + 4,
        gap: spacing.sm,
        minHeight: 120,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="eyebrow" tone={highlight ? 'gold' : 'secondary'}>
          {label}
        </Text>
        {icon ? (
          <Feather
            name={icon}
            size={16}
            color={highlight ? colors.gold : colors.textTertiary}
          />
        ) : null}
      </View>
      <Text
        variant="numeral"
        tone={highlight ? 'gold' : 'primary'}
        align="right"
        style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.2 }}
      >
        {value}
      </Text>
    </View>
  );
}
