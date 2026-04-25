import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';

// ───────────────────────────────────────────────────────────────────────────
// Placeholder brand lockup. Swap with a real logo asset later by
// replacing the monogram <View> with an <Image source={require(…)} />.
// ───────────────────────────────────────────────────────────────────────────

type Size = 'xs' | 'sm' | 'md' | 'lg';
type Layout = 'stack' | 'inline';

const MARK_SIZES: Record<Size, number> = { xs: 28, sm: 36, md: 56, lg: 88 };
const LETTER_SIZES: Record<Size, number> = { xs: 14, sm: 18, md: 26, lg: 36 };
const WORD_SIZES: Record<Size, number> = { xs: 11, sm: 13, md: 17, lg: 22 };

export function Brandmark({
  size = 'md',
  layout = 'stack',
  showTagline = true,
  style,
}: {
  size?: Size;
  layout?: Layout;
  showTagline?: boolean;
  style?: ViewStyle;
}) {
  const mark = MARK_SIZES[size];
  const letter = LETTER_SIZES[size];
  const word = WORD_SIZES[size];

  const monogram = (
    <View
      style={{
        width: mark,
        height: mark,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.borderGold,
        backgroundColor: colors.goldTint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        tone="gold"
        align="center"
        style={{
          fontSize: letter,
          fontWeight: '300',
          letterSpacing: -0.5,
          lineHeight: letter + 4,
        }}
      >
        ב
      </Text>
    </View>
  );

  const wordmark = (
    <View style={{ gap: 2, alignItems: layout === 'stack' ? 'center' : 'flex-start' }}>
      <Text
        tone="primary"
        align={layout === 'stack' ? 'center' : 'right'}
        style={{ fontSize: word, fontWeight: '700', letterSpacing: 5 }}
      >
        B A R B E R
      </Text>
      {showTagline ? (
        <Text
          variant="micro"
          tone="gold"
          align={layout === 'stack' ? 'center' : 'right'}
          style={{ letterSpacing: 1.5 }}
        >
          MEN · HAIR · ATELIER
        </Text>
      ) : null}
    </View>
  );

  if (layout === 'inline') {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
          },
          style,
        ]}
      >
        {monogram}
        {wordmark}
      </View>
    );
  }

  return (
    <View style={[{ alignItems: 'center', gap: spacing.md }, style]}>
      {monogram}
      {wordmark}
    </View>
  );
}
