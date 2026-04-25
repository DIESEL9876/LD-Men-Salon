import React, { useState } from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { AppHeader } from '../../components/AppHeader';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Divider } from '../../components/Divider';
import { SegmentedControl } from '../../components/SegmentedControl';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing } from '../../theme';

type Tab = 'upcoming' | 'past';

// Fresh-user state — no appointments yet. Real data will land here once
// we wire the Supabase `appointments` query. Types kept inline so the
// render branches below stay type-safe when we swap in live data.
type UpcomingAppointment = {
  id: string;
  date: string;
  time: string;
  dateSub: string;
  service: string;
  barber: string;
  price: number;
};
type PastAppointment = {
  id: string;
  date: string;
  time: string;
  dateSub: string;
  service: string;
  barber: string;
  status: 'completed' | 'cancelled';
};
const UPCOMING: UpcomingAppointment[] = [];
const PAST: PastAppointment[] = [];

export function MyAppointmentsScreen() {
  const [tab, setTab] = useState<Tab>('upcoming');

  return (
    <Screen>
      <AppHeader />

      <View style={{ gap: spacing.xxs }}>
        <Text variant="eyebrow" tone="gold">
          הזמנות
        </Text>
        <Text variant="hero">התורים שלי</Text>
        <Text variant="body" tone="secondary">
          כל מה שקבעת — במקום אחד.
        </Text>
      </View>

      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'upcoming', label: 'קרובים' },
          { value: 'past', label: 'עבר' },
        ]}
      />

      {tab === 'upcoming' && (
        <View style={{ gap: spacing.sm }}>
          {UPCOMING.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="אין תורים קרובים"
              subtitle="נראה שהגיע הזמן לקבוע חדש."
            />
          ) : (
            UPCOMING.map((a) => (
              <Card key={a.id} padding="lg">
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ gap: 2 }}>
                    <Text variant="eyebrow" tone="gold">
                      {a.date}
                    </Text>
                    <Text variant="h1">{a.time}</Text>
                    <Text variant="caption" tone="secondary">
                      {a.dateSub}
                    </Text>
                  </View>
                  <Badge label="מאושר" tone="gold" />
                </View>

                <Divider />

                <IconRow icon="scissors" label={a.service} />
                <IconRow icon="user" label={a.barber} />
                <IconRow icon="credit-card" label={`₪${a.price} · תשלום בעסק`} />

                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                  <Button title="פרטים" variant="secondary" fullWidth={false} style={{ flex: 1 }} />
                  <Button title="ביטול" variant="danger" fullWidth={false} style={{ flex: 1 }} />
                </View>
              </Card>
            ))
          )}
        </View>
      )}

      {tab === 'past' && (
        <View style={{ gap: spacing.sm }}>
          {PAST.length === 0 ? (
            <EmptyState
              icon="archive"
              title="אין היסטוריה עדיין"
              subtitle="ההזמנות הקודמות שלך יופיעו כאן."
            />
          ) : (
            PAST.map((a) => (
            <Card key={a.id} padding="lg" tone="subtle">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ gap: 2 }}>
                  <Text variant="eyebrow" tone="secondary">
                    {a.date}
                  </Text>
                  <Text variant="h2" tone="secondary">
                    {a.time}
                  </Text>
                  <Text variant="caption" tone="tertiary">
                    {a.dateSub}
                  </Text>
                </View>
                <Badge
                  label={a.status === 'completed' ? 'הושלם' : 'מבוטל'}
                  tone={a.status === 'completed' ? 'success' : 'danger'}
                />
              </View>

              <Divider />

              <IconRow icon="scissors" label={a.service} muted />
              <IconRow icon="user" label={a.barber} muted />

              {a.status === 'completed' ? (
                <Button title="הזמן שוב" variant="outline" icon="refresh-cw" style={{ marginTop: spacing.md }} />
              ) : null}
            </Card>
            ))
          )}
        </View>
      )}
    </Screen>
  );
}

function IconRow({
  icon,
  label,
  muted,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  muted?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <Feather name={icon} size={15} color={muted ? colors.textTertiary : colors.gold} />
      <Text variant="body" tone={muted ? 'tertiary' : 'secondary'}>
        {label}
      </Text>
    </View>
  );
}
