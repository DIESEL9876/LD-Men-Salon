import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { Text } from './Text';

export function TextField({
  label,
  error,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps & { label?: string; error?: string }) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? colors.danger
    : focused
    ? colors.borderGold
    : colors.border;

  return (
    <View style={{ width: '100%', gap: 6 }}>
      {label ? (
        <Text variant="eyebrow" tone="secondary" align="right">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { borderColor }, style]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        selectionColor={colors.gold}
        {...rest}
      />
      {error ? (
        <Text variant="caption" tone="danger" align="right">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.bodyLarge,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
    borderWidth: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
