import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '../theme';

export function IconButton({
  icon,
  onPress,
  size = 44,
  iconSize = 20,
  tone = 'default',
  style,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  tone?: 'default' | 'gold' | 'subtle';
  style?: ViewStyle;
}) {
  const bg =
    tone === 'gold' ? colors.goldTint : tone === 'subtle' ? 'transparent' : colors.surface;
  const border = tone === 'gold' ? colors.borderGold : colors.border;
  const color = tone === 'gold' ? colors.gold : colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Feather name={icon} size={iconSize} color={color} />
    </Pressable>
  );
}
