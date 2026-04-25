import React from 'react';
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';

export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  onPress,
  danger,
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode | string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const titleTone = danger ? 'danger' : 'primary';
  const iconColor = danger ? colors.danger : colors.gold;

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        gap: spacing.md,
      }}
    >
      {icon ? (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.pill,
            backgroundColor: danger ? 'rgba(217,133,133,0.1)' : colors.goldTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name={icon} size={18} color={iconColor} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyStrong" tone={titleTone}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="secondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {typeof trailing === 'string' ? (
        <Text variant="caption" tone="tertiary">
          {trailing}
        </Text>
      ) : trailing ? (
        <View>{trailing}</View>
      ) : onPress ? (
        <Feather name="chevron-left" size={18} color={colors.textTertiary} />
      ) : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {content}
    </Pressable>
  );
}
