import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export function Screen({
  children,
  scroll = true,
  padded = true,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}) {
  const padding = padded ? { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg } : {};

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[padding, { paddingBottom: spacing.xxxl, gap: spacing.lg }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[padding, { flex: 1, gap: spacing.lg }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
});
