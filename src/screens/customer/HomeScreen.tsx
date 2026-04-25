import React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { AppHeader } from '../../components/AppHeader';
import { IconButton } from '../../components/IconButton';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { Brandmark } from '../../components/Brandmark';
import { useAuth } from '../../store/AuthContext';
import { colors, radius, spacing } from '../../theme';
import type { CustomerTabParamList } from '../../navigation/types';
import { BUSINESS } from '../../data/placeholders';
import { useNow } from '../../hooks/useNow';
import { greetingHe, formatTodayHeader } from '../../lib/dates';

function firstName(fullName: string | null | undefined): string {
  if (!fullName) return '';
  return fullName.trim().split(/\s+/)[0] ?? '';
}

type QuickAction = {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Feather.glyphMap;
  target?: keyof CustomerTabParamList;
  externalUrl?: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { key: 'book', label: 'הזמן תור', sub: 'תוך 30 שניות', icon: 'calendar', target: 'Book' },
  { key: 'my', label: 'התורים שלי', sub: 'עבר ועתיד', icon: 'clock', target: 'MyAppointments' },
  { key: 'services', label: 'שירותים ומחירים', sub: 'התפריט שלנו', icon: 'scissors', target: 'Book' },
  { key: 'contact', label: 'צור קשר', sub: 'טלפון ישיר', icon: 'phone', externalUrl: `tel:${BUSINESS.phone}` },
];

export function HomeScreen() {
  const { profile } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<CustomerTabParamList>>();
  // Re-render every minute so the greeting and "today" header track the
  // wall clock. The hook also pauses while the app is backgrounded and
  // snaps to a fresh `Date` the moment the user returns to the app.
  const now = useNow();

  // Greeting line — append ", שם" only when we actually know the user.
  const name = firstName(profile?.full_name);

  function handleQuickAction(a: QuickAction) {
    if (a.target) navigation.navigate(a.target);
    else if (a.externalUrl) Linking.openURL(a.externalUrl).catch(() => {});
  }

  return (
    <Screen>
      <AppHeader
        trailing={<IconButton icon="bell" tone="subtle" onPress={() => {}} />}
      />

      {/* Brandmark at top */}
      <View style={{ alignItems: 'flex-start', paddingBottom: spacing.xs }}>
        <Brandmark layout="inline" size="xs" showTagline={false} />
      </View>

      {/* Greeting block — live "ערב טוב, יוסי" + today's date below */}
      <View style={{ gap: spacing.xxs }}>
        <Text variant="eyebrow" tone="gold" align="right">
          {formatTodayHeader(now)}
        </Text>
        <Text variant="display" align="right">
          {greetingHe(now)}{name ? `, ${name}` : ''}
        </Text>
        <Text variant="body" tone="secondary" align="right">
          מוכן למראה רענן? קל ומהיר לקבוע תור.
        </Text>
      </View>

      {/* Empty state — no upcoming appointments yet */}
      <Card tone="hero" padding="lg">
        <View style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.pill,
              backgroundColor: colors.goldTint,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.xs,
            }}
          >
            <Feather name="calendar" size={24} color={colors.gold} />
          </View>
          <Text variant="eyebrow" tone="gold" align="center">
            עוד אין לך תור
          </Text>
          <Text variant="h2" align="center">
            הזמן את התור הראשון שלך
          </Text>
          <Text variant="body" tone="secondary" align="center">
            בחר ספר, שירות ושעה — הכל במספר נגיעות.
          </Text>
          <Button
            title="הזמנת תור"
            icon="plus"
            onPress={() => navigation.navigate('Book')}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </Card>

      {/* Quick actions grid */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="eyebrow" tone="secondary">
          פעולות מהירות
        </Text>
        <View style={styles.grid}>
          {QUICK_ACTIONS.map((a) => (
            <QuickTile key={a.key} action={a} onPress={() => handleQuickAction(a)} />
          ))}
        </View>
      </View>

      {/* Hours card */}
      <Card tone="subtle" padding="lg">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ gap: spacing.xxs }}>
            <Text variant="eyebrow" tone="gold">
              שעות פתיחה
            </Text>
            <Text variant="h3">{BUSINESS.hoursLabel}</Text>
            <Text variant="caption" tone="secondary">
              {BUSINESS.hoursDetail}
            </Text>
          </View>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: radius.pill,
              backgroundColor: colors.success,
            }}
          />
        </View>
      </Card>
    </Screen>
  );
}

function QuickTile({
  action,
  onPress,
}: {
  action: QuickAction;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.pill,
          backgroundColor: colors.goldTint,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.sm,
        }}
      >
        <Feather name={action.icon} size={18} color={colors.gold} />
      </View>
      <Text variant="bodyStrong">{action.label}</Text>
      <Text variant="caption" tone="tertiary">
        {action.sub}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 2,
    minHeight: 130,
    justifyContent: 'space-between',
  },
});
