import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { AppHeader } from '../../components/AppHeader';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { StatTile } from '../../components/StatTile';
import { Badge } from '../../components/Badge';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { Avatar } from '../../components/Avatar';
import { supabase, AppointmentWithJoins } from '../../lib/supabase';
import { colors, spacing } from '../../theme';
import { addDays, formatTime, startOfDay } from '../../lib/dates';

export function AdminDashboardScreen() {
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [todayList, setTodayList] = useState<AppointmentWithJoins[]>([]);

  const load = useCallback(async () => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const weekEnd = addDays(today, 7);

    const [todayRes, weekRes, listRes] = await Promise.all([
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .neq('status', 'cancelled')
        .gte('starts_at', today.toISOString())
        .lt('starts_at', tomorrow.toISOString()),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .neq('status', 'cancelled')
        .gte('starts_at', today.toISOString())
        .lt('starts_at', weekEnd.toISOString()),
      supabase
        .from('appointments')
        .select('*, barber:barbers(id,name), service:services(id,name,price,duration_minutes), profile:profiles(id,full_name,phone)')
        .neq('status', 'cancelled')
        .gte('starts_at', today.toISOString())
        .lt('starts_at', tomorrow.toISOString())
        .order('starts_at', { ascending: true }),
    ]);

    setTodayCount(todayRes.count ?? 0);
    setWeekCount(weekRes.count ?? 0);
    setTodayList((listRes.data as AppointmentWithJoins[]) ?? []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <Screen>
      <AppHeader />

      <View style={{ gap: spacing.xxs }}>
        <Text variant="eyebrow" tone="gold">
          לוח ניהול
        </Text>
        <Text variant="hero">מבט מלמעלה</Text>
        <Text variant="body" tone="secondary">
          תמונת מצב חיה של היום והשבוע.
        </Text>
      </View>

      <View style={{ flexDirection: 'row-reverse', gap: spacing.sm }}>
        <StatTile label="היום" value={todayCount} icon="calendar" highlight />
        <StatTile label="השבוע" value={weekCount} icon="trending-up" />
      </View>

      <View style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="eyebrow" tone="secondary">
            סדר היום
          </Text>
          <Text variant="micro" tone="tertiary">
            {todayList.length} תורים
          </Text>
        </View>

        {todayList.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon="coffee"
              title="יום רגוע"
              subtitle="אין תורים מתוכננים להיום."
            />
          </Card>
        ) : (
          <Card padding="none">
            {todayList.map((a, idx) => (
              <React.Fragment key={a.id}>
                {idx > 0 ? <Divider spaced={false} /> : null}
                <AgendaRow appointment={a} />
              </React.Fragment>
            ))}
          </Card>
        )}
      </View>
    </Screen>
  );
}

function AgendaRow({ appointment }: { appointment: AppointmentWithJoins }) {
  const when = new Date(appointment.starts_at);
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
      }}
    >
      <View
        style={{
          width: 64,
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Text variant="h3" tone="gold" align="center">
          {formatTime(when)}
        </Text>
      </View>

      <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: colors.border }} />

      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyStrong">{appointment.profile?.full_name ?? '—'}</Text>
        <Text variant="caption" tone="secondary">
          {appointment.service?.name} · {appointment.barber?.name}
        </Text>
        {appointment.profile?.phone ? (
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Feather name="phone" size={11} color={colors.textTertiary} />
            <Text variant="micro" tone="tertiary">
              {appointment.profile.phone}
            </Text>
          </View>
        ) : null}
      </View>

      <Avatar name={appointment.profile?.full_name} size={36} />
    </View>
  );
}
