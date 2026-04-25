import React, { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';
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
import { supabase, Service } from '../../lib/supabase';
import { t } from '../../i18n/he';
import { colors, spacing } from '../../theme';

export function AdminServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('30');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('services').select('*').order('name');
    setServices((data as Service[]) ?? []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function resetForm() {
    setName('');
    setDescription('');
    setPrice('');
    setDuration('30');
    setEditingId(null);
    setFormOpen(false);
  }

  async function submit() {
    const priceNum = parseFloat(price);
    const durNum = parseInt(duration, 10);
    if (!name.trim() || isNaN(priceNum) || isNaN(durNum)) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: priceNum,
      duration_minutes: durNum,
    };
    const { error } = editingId
      ? await supabase.from('services').update(payload).eq('id', editingId)
      : await supabase.from('services').insert(payload);
    setSaving(false);
    if (error) {
      Alert.alert(t.common.error, error.message);
      return;
    }
    resetForm();
    load();
  }

  async function toggleActive(s: Service) {
    await supabase.from('services').update({ active: !s.active }).eq('id', s.id);
    load();
  }

  async function remove(id: string) {
    Alert.alert(t.common.delete, 'למחוק את השירות?', [
      { text: t.common.no, style: 'cancel' },
      {
        text: t.common.yes,
        style: 'destructive',
        onPress: async () => {
          await supabase.from('services').delete().eq('id', id);
          load();
        },
      },
    ]);
  }

  function edit(s: Service) {
    setEditingId(s.id);
    setName(s.name);
    setDescription(s.description ?? '');
    setPrice(String(s.price));
    setDuration(String(s.duration_minutes));
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
          תפריט
        </Text>
        <Text variant="hero">שירותים</Text>
        <Text variant="body" tone="secondary">
          הוסף, ערוך ומחיר — בשליטה מלאה.
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
              {editingId ? 'עריכת שירות' : 'שירות חדש'}
            </Text>
            <IconButton icon="x" tone="subtle" onPress={resetForm} />
          </View>

          <View style={{ gap: spacing.sm }}>
            <TextField label="שם השירות" value={name} onChangeText={setName} placeholder="תספורת קלאסית" />
            <TextField
              label="תיאור"
              value={description}
              onChangeText={setDescription}
              placeholder="תיאור קצר לשירות"
            />
            <View style={{ flexDirection: 'row-reverse', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <TextField label="מחיר (₪)" value={price} onChangeText={setPrice} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="משך (דק׳)" value={duration} onChangeText={setDuration} keyboardType="numeric" />
              </View>
            </View>

            <View style={{ height: spacing.xs }} />
            <Button
              title={editingId ? 'שמור שינויים' : 'הוסף שירות'}
              icon={editingId ? 'check' : 'plus'}
              onPress={submit}
              loading={saving}
            />
          </View>
        </Card>
      ) : null}

      <View style={{ gap: spacing.sm }}>
        <Text variant="eyebrow" tone="secondary">
          {services.length ? `${services.length} שירותים` : 'עדיין ריק'}
        </Text>

        {services.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon="scissors"
              title="אין עדיין שירותים"
              subtitle="הוסף את השירות הראשון כדי להתחיל."
            />
          </Card>
        ) : (
          services.map((s) => (
            <Card key={s.id} padding="lg" tone={s.active ? 'default' : 'subtle'}>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="h3" tone={s.active ? 'primary' : 'secondary'}>
                    {s.name}
                  </Text>
                  {s.description ? (
                    <Text variant="caption" tone="tertiary">
                      {s.description}
                    </Text>
                  ) : null}
                </View>
                <Badge
                  label={s.active ? 'פעיל' : 'מושהה'}
                  tone={s.active ? 'gold' : 'neutral'}
                />
              </View>

              <View style={{ flexDirection: 'row-reverse', gap: spacing.lg, marginTop: spacing.sm }}>
                <MetaItem icon="credit-card" value={`₪${s.price}`} highlight />
                <MetaItem icon="clock" value={`${s.duration_minutes} דק׳`} />
              </View>

              <Divider />

              <View style={{ flexDirection: 'row-reverse', gap: spacing.sm }}>
                <Button
                  title="ערוך"
                  variant="secondary"
                  icon="edit-2"
                  onPress={() => edit(s)}
                  fullWidth={false}
                  style={{ flex: 1 }}
                />
                <Button
                  title={s.active ? 'השהה' : 'הפעל'}
                  variant="ghost"
                  icon={s.active ? 'pause' : 'play'}
                  onPress={() => toggleActive(s)}
                  fullWidth={false}
                  style={{ flex: 1 }}
                />
                <Button
                  title="מחק"
                  variant="danger"
                  icon="trash-2"
                  onPress={() => remove(s.id)}
                  fullWidth={false}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}

function MetaItem({
  icon,
  value,
  highlight,
}: {
  icon: keyof typeof Feather.glyphMap;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
      <Feather name={icon} size={13} color={highlight ? colors.gold : colors.textTertiary} />
      <Text variant="bodyStrong" tone={highlight ? 'gold' : 'secondary'}>
        {value}
      </Text>
    </View>
  );
}
