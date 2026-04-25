import React, { useCallback, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { Avatar } from '../../components/Avatar';
import { supabase, AppointmentWithJoins } from '../../lib/supabase';
import { t } from '../../i18n/he';
import { colors, spacing } from '../../theme';
import { formatDateHe, formatTime, formatWeekdayHe } from '../../lib/dates';

type Filter = 'all' | 'confirmed' | 'completed' | 'cancelled';

export function AdminAppointmentsScreen() {
  const [appts, setAppts] = useState<AppointmentWithJoins[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, barber:barbers(id,name), service:services(id,name,price,duration_minutes), profile:profiles(id,full_name,phone)')
      .gte('starts_at', new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString())
      .order('starts_at', { ascending: true })
      .limit(100);
    setAppts((data as AppointmentWithJoins[]) ?? []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function updateStatus(id: string, status: 'cancelled' | 'completed') {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) Alert.alert(t.common.error, error.message);
    else load();
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return appts;
    return appts.filter((a) => a.status === filter);
  }, [appts, filter]);

  return (
    <Screen>
      <AppHeader />

      <View style={{ gap: spacing.xxs }}>
        <Text variant="eyebrow" tone="gold">
          ניהול
        </Text>
        <Text variant="hero">כל התורים</Text>
        <Text variant="body" tone="secondary">
          סינון, אישור וסגירה — במקום אחד.
        </Text>
      </View>

      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'הכל' },
          { value: 'confirmed', label: 'מאושר' },
          { value: 'completed', label: 'הושלם' },
          { value: 'cancelled', label: 'מבוטל' },
        ]}
      />

      {filtered.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon="calendar"
            title="אין תורים"
            subtitle="לא נמצאו תורים לסינון זה."
          />
        </Card>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {filtered.map((a) => {
            const d = new Date(a.starts_at);
            const tone = statusTone(a.status);
            return (
              <Card
                key={a.id}
                padding="lg"
                tone={a.status === 'cancelled' ? 'subtle' : 'default'}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ gap: 2 }}>
                    <Text variant="eyebrow" tone={a.status === 'cancelled' ? 'tertiary' : 'gold'}>
                      {formatWeekdayHe(d)}
                    </Text>
                    <Text variant="h1" tone={a.status === 'cancelled' ? 'secondary' : 'primary'}>
                      {formatTime(d)}
                    </Text>
                    <Text variant="caption" tone="tertiary">
                      {formatDateHe(d)}
                    </Text>
                  </View>
                  <Badge label={statusLabel(a.status)} tone={tone} />
                </View>

                <Divider />

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Avatar name={a.profile?.full_name} size={40} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="bodyStrong">{a.profile?.full_name ?? '—'}</Text>
                    {a.profile?.phone ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Feather name="phone" size={11} color={colors.textTertiary} />
                        <Text variant="micro" tone="tertiary">
                          {a.profile.phone}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={{ gap: 4, marginTop: spacing.xs }}>
                  <DetailRow icon="scissors" label={a.service?.name ?? '—'} />
                  <DetailRow icon="user" label={a.barber?.name ?? '—'} />
                  {a.service?.price ? (
                    <DetailRow icon="credit-card" label={`₪${a.service.price}`} />
                  ) : null}
                </View>

                {a.status === 'confirmed' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: spacing.sm,
                      marginTop: spacing.md,
                    }}
                  >
                    <Button
                      title="סמן כהושלם"
                      icon="check"
                      onPress={() => updateStatus(a.id, 'completed')}
                      fullWidth={false}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="בטל"
                      variant="danger"
                      onPress={() => updateStatus(a.id, 'cancelled')}
                      fullWidth={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                ) : null}
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

function DetailRow({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <Feather name={icon} size={14} color={colors.textTertiary} />
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
    </View>
  );
}

function statusLabel(s: string) {
  if (s === 'cancelled') return 'מבוטל';
  if (s === 'completed') return 'הושלם';
  return 'מאושר';
}

function statusTone(s: string): 'gold' | 'success' | 'danger' | 'neutral' {
  if (s === 'cancelled') return 'danger';
  if (s === 'completed') return 'success';
  if (s === 'confirmed') return 'gold';
  return 'neutral';
}
