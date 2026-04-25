import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'md' | 'lg';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading,
  disabled,
  icon,
  fullWidth = true,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  const height = size === 'lg' ? 56 : 48;

  let bg = 'transparent';
  let border = 'transparent';
  let textTone: React.ComponentProps<typeof Text>['tone'] = 'primary';
  let shadow = shadows.none;

  if (variant === 'primary') {
    bg = colors.gold;
    textTone = 'inverse';
    shadow = shadows.glow;
  } else if (variant === 'secondary') {
    bg = colors.surfaceElevated;
    border = colors.borderStrong;
  } else if (variant === 'outline') {
    border = colors.borderGold;
    textTone = 'gold';
  } else if (variant === 'danger') {
    bg = 'transparent';
    border = 'rgba(217, 133, 133, 0.4)';
    textTone = 'danger';
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        {
          height,
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'ghost' ? 0 : 1,
          opacity: isDisabled ? 0.45 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? spacing.lg : spacing.xl,
        },
        shadow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.text} />
      ) : (
        <View style={styles.inner}>
          {icon ? (
            <Feather
              name={icon}
              size={18}
              color={
                textTone === 'inverse'
                  ? colors.textInverse
                  : textTone === 'gold'
                  ? colors.gold
                  : textTone === 'danger'
                  ? colors.danger
                  : colors.text
              }
              style={{ marginEnd: 8 }}
            />
          ) : null}
          <Text variant="button" tone={textTone} align="center">
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
