import React from 'react';
import { View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number; // 1-based
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
        {steps.map((_, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: radius.pill,
                backgroundColor: done || active ? colors.gold : colors.border,
                opacity: done ? 0.6 : 1,
              }}
            />
          );
        })}
      </View>
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <Text variant="eyebrow" tone="gold">
          שלב {current} מתוך {steps.length}
        </Text>
        <Text variant="eyebrow" tone="secondary">
          {steps[current - 1]}
        </Text>
      </View>
    </View>
  );
}
