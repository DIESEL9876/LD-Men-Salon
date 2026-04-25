import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';

export function Divider({ style, spaced = true }: { style?: ViewStyle; spaced?: boolean }) {
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: spaced ? spacing.md : 0,
        },
        style,
      ]}
    />
  );
}
