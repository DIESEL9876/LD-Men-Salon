import React, { useCallback, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { AppHeader } from '../../components/AppHeader';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Badge } from '../../components/Badge';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import { Avatar } from '../../components/Avatar';
import { supabase, Barber, WorkingHours } from '../../lib/supabase';
import { t } from '../../i18n/he';
import { colors, radius, spacing } from '../../theme';

const DEFAULT_START = '09:00';
const DEFAULT_END = '19:00';

export function AdminBarbersScreen() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [hoursByBarber, setHoursByBarber] = useState<Record<string, WorkingHours[]>>({});

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    const { data: bs } = await supabase.from('barbers').select('*').order('name');
    const barbersList = (bs as Barber[]) ?? [];
    setBarbers(barbersList);

    if (barbersList.length > 0) {
      const { data: wh } = await supabase
        .from('working_hours')
        .select('*')
        .in(
          'barber_id',
          barbersList.map((b) => b.id)
        );
      const map: Record<string, WorkingHours[]> = {};
      ((wh as WorkingHours[]) ?? []).forEach((w) => {
        if (!map[w.barber_id]) map[w.barber_id] = [];
        map[w.barber_id].push(w);
      });
      setHoursByBarber(map);
    } else {
      setHoursByBarber({});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function resetForm() {
    setName('');
    setBio('');
    setPhotoUrl('');
    setEditingId(null);
    setFormOpen(false);
  }

  async function submit() {
    if (!name.trim()) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      bio: bio.trim() || null,
      photo_url: photoUrl.trim() || null,
    };
    const { data, error } = editingId
      ? await supabase.from('barbers').update(payload).eq('id', editingId).select().single()
      : await supabase.from('barbers').insert(payload).select().single();
    setSaving(false);
    if (error) {
      Alert.alert(t.common.error, error.message);
      return;
    }
    // Seed default working hours (Sun-Fri) for new barber
    if (!editingId && data) {
      const seed = [0, 1, 2, 3, 4, 5].map((dow) => ({
        barber_id: (data as Barber).id,
        day_of_week: dow,
        start_time: DEFAULT_START,
        end_time: DEFAULT_END,
      }));
      await supabase.from('working_hours').insert(seed);
    }
    resetForm();
    load();
  }

  async function toggleDay(barberId: string, dow: number, hours: WorkingHours[]) {
    const existing = hours.find((w) => w.day_of_week === dow);
    if (existing) {
      await supabase.from('working_hours').delete().eq('id', existing.id);
    } else {
      await supabase.from('working_hours').insert({
        barber_id: barberId,
        day_of_week: dow,
        start_time: DEFAULT_START,
        end_time: DEFAULT_END,
      });
    }
    load();
  }

  async function toggleActive(b: Barber) {
    await supabase.from('barbers').update({ active: !b.active }).eq('id', b.id);
    load();
  }

  async function remove(id: string) {
    Alert.alert(t.common.delete, 'למחוק את הספר?', [
      { text: t.common.no, style: 'cancel' },
      {
        text: t.common.yes,
        style: 'destructive',
        onPress: async () => {
          await supabase.from('barbers').delete().eq('id', id);
          load();
        },
      },
    ]);
  }

  function edit(b: Barber) {
    setEditingId(b.id);
    setName(b.name);
    setBio(b.bio ?? '');
    setPhotoUrl(b.photo_url ?? '');
    setFormOpen(true);
  }

  return (
    <Screen>
      <AppHeader
        trailing={
          !formOpen ? (
            <IconButton icon="plus" tone="gold" onPress={() => setFormOpen(true)} />
          ) : undefined
        }
      />

      <View style={{ gap: spacing.xxs }}>
        <Text variant="eyebrow" tone="gold">
          צוות
        </Text>
        <Text variant="hero">הסטייליסטים</Text>
        <Text variant="body" tone="secondary">
          נהל את הצוות, שעות העבודה והזמינות.
        </Text>
      </View>

      {formOpen ? (
        <Card padding="lg" tone="hero">
          <View
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Text variant="eyebrow" tone="gold">
              {editingId ? 'עריכת ספר' : 'ספר חדש'}
            </Text>
            <IconButton icon="x" tone="subtle" onPress={resetForm} />
          </View>

          <View style={{ gap: spacing.sm }}>
            <TextField label="שם הספר" value={name} onChangeText={setName} placeholder="ישראל ישראלי" />
            <TextField
              label="אודות"
              value={bio}
              onChangeText={setBio}
              placeholder="תיאור קצר, התמחות"
            />
            <TextField
              label="קישור לתמונה"
              value={photoUrl}
              onChangeText={setPhotoUrl}
              autoCapitalize="none"
              placeholder="https://..."
            />

            <View style={{ height: spacing.xs }} />
            <Button
              title={editingId ? 'שמור שינויים' : 'הוסף ספר'}
              icon={editingId ? 'check' : 'plus'}
              onPress={submit}
              loading={saving}
            />
          </View>
        </Card>
      ) : null}

      <View style={{ gap: spacing.sm }}>
        <Text variant="eyebrow" tone="secondary">
          {barbers.length ? `${barbers.length} אנשי צוות` : 'עדיין ריק'}
        </Text>

        {barbers.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon="users"
              title="אין עדיין ספרים"
              subtitle="הוסף את הספר הראשון כדי להתחיל."
            />
          </Card>
        ) : (
          barbers.map((b) => {
            const hours = hoursByBarber[b.id] ?? [];
            return (
              <Card key={b.id} padding="lg" tone={b.active ? 'default' : 'subtle'}>
                <View
                  style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    gap: spacing.md,
                  }}
                >
                  <Avatar name={b.name} size={56} tone={b.active ? 'gold' : 'default'} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="h3" tone={b.active ? 'primary' : 'secondary'}>
                      {b.name}
                    </Text>
                    {b.bio ? (
                      <Text variant="caption" tone="tertiary">
                        {b.bio}
                      </Text>
                    ) : null}
                  </View>
                  <Badge
                    label={b.active ? 'פעיל' : 'מושהה'}
                    tone={b.active ? 'gold' : 'neutral'}
                  />
                </View>

                <Divider />

                <View style={{ gap: spacing.xs }}>
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text variant="eyebrow" tone="secondary">
                      ימי עבודה
                    </Text>
                    <Text variant="micro" tone="tertiary">
                      {DEFAULT_START}–{DEFAULT_END}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row-reverse', gap: 6, flexWrap: 'wrap' }}>
                    {t.days.map((_label, dow) => {
                      const active = hours.some((w) => w.day_of_week === dow);
                      return (
                        <DayPill
                          key={dow}
                          label={t.daysShort[dow]}
                          active={active}
                          onPress={() => toggleDay(b.id, dow, hours)}
                        />
                      );
                    })}
                  </View>
                </View>

                <Divider />

                <View style={{ flexDirection: 'row-reverse', gap: spacing.sm }}>
                  <Button
                    title="ערוך"
                    variant="secondary"
                    icon="edit-2"
                    onPress={() => edit(b)}
                    fullWidth={false}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title={b.active ? 'השהה' : 'הפעל'}
                    variant="ghost"
                    icon={b.active ? 'pause' : 'play'}
                    onPress={() => toggleActive(b)}
                    fullWidth={false}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="מחק"
                    variant="danger"
                    icon="trash-2"
                    onPress={() => remove(b.id)}
                    fullWidth={false}
                    style={{ flex: 1 }}
                  />
                </View>
              </Card>
            );
          })
        )}
      </View>
    </Screen>
  );
}

function DayPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: active ? colors.gold : colors.border,
        backgroundColor: active ? colors.gold : colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text
        variant="bodyStrong"
        tone={active ? 'inverse' : 'secondary'}
        align="center"
      >
        {label}
      </Text>
    </Pressable>
  );
}
