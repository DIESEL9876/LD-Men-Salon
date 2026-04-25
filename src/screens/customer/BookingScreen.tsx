import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { AppHeader } from '../../components/AppHeader';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Stepper';
import { Chip } from '../../components/Chip';
import { Avatar } from '../../components/Avatar';
import { Divider } from '../../components/Divider';
import { SegmentedControl } from '../../components/SegmentedControl';
import { colors, radius, spacing } from '../../theme';
import {
  PLACEHOLDER_BARBERS as BARBERS,
  PLACEHOLDER_SERVICES as SERVICES,
  type PlaceholderBarber as Barber,
  type PlaceholderService as Service,
} from '../../data/placeholders';
import { useNow } from '../../hooks/useNow';
import { addDays, formatDayMonthHe, formatWeekdayHe, startOfDay } from '../../lib/dates';

const STEPS = ['ספר', 'שירות', 'תאריך ושעה', 'אישור'];

type DayOption = { key: string; label: string; sub: string; date: Date };

// Build a rolling 7-day window starting at "today". Labels: "היום",
// "מחר", then weekday names. Sublabel is always "12 ביוני" so the user
// can confirm the actual date.
function buildDayOptions(now: Date): DayOption[] {
  const today = startOfDay(now);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    const label = i === 0 ? 'היום' : i === 1 ? 'מחר' : formatWeekdayHe(date);
    return {
      key: `d${i}`,
      label,
      sub: formatDayMonthHe(date),
      date,
    };
  });
}

const TIMES = ['09:00', '09:30', '10:00', '11:30', '12:00', '14:00', '14:30', '15:00', '16:30', '17:00', '18:00', '18:30', '19:00', '19:30'];
// ———————————————————————————————————

export function BookingScreen() {
  const [step, setStep] = useState(1);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [service, setService] = useState<Service | null>(null);
  // Re-render daily so "היום / מחר" and the date row stay anchored to the
  // real wall clock — useful if the user keeps the app open past midnight.
  const now = useNow(60_000);
  const days = useMemo(() => buildDayOptions(now), [now]);
  // Default to "tomorrow" so the user starts on a sensible booking day.
  const [dayKey, setDayKey] = useState<string>('d1');
  const day = days.find((d) => d.key === dayKey) ?? days[0];
  const [time, setTime] = useState<string | null>(null);
  const [payment, setPayment] = useState<'in_store' | 'in_app'>('in_store');

  const canContinue = useMemo(() => {
    if (step === 1) return !!barber;
    if (step === 2) return !!service;
    if (step === 3) return !!time;
    return true;
  }, [step, barber, service, time]);

  return (
    <Screen>
      <AppHeader />

      <View style={{ gap: spacing.xxs }}>
        <Text variant="eyebrow" tone="gold">
          קביעת תור
        </Text>
        <Text variant="hero">
          {step === 1 ? 'בחר ספר' : step === 2 ? 'בחר שירות' : step === 3 ? 'בחר זמן' : 'סיכום ואישור'}
        </Text>
        <Text variant="body" tone="secondary">
          {step === 1
            ? 'בחר את הסטייליסט שמדבר אליך — כולם מנוסים.'
            : step === 2
            ? 'כמה דקות, המון הבדל.'
            : step === 3
            ? 'בחר יום ושעה שנוחים לך.'
            : 'עוד רגע קטן ואתה בפנים.'}
        </Text>
      </View>

      <Stepper steps={STEPS} current={step} />

      {step === 1 && (
        <View style={{ gap: spacing.sm }}>
          {BARBERS.map((b) => (
            <Card
              key={b.id}
              onPress={() => setBarber(b)}
              selected={barber?.id === b.id}
              tone={barber?.id === b.id ? 'gold' : 'default'}
              padding="md"
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md }}>
                <Avatar name={b.name} size={56} tone={barber?.id === b.id ? 'gold' : 'default'} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="h3">{b.name}</Text>
                  <Text variant="caption" tone="gold">{b.role}</Text>
                  <Text variant="caption" tone="secondary">
                    {b.specialty}
                  </Text>
                </View>
                <Feather name={barber?.id === b.id ? 'check' : 'chevron-left'} size={18} color={barber?.id === b.id ? colors.gold : colors.textTertiary} />
              </View>
            </Card>
          ))}
        </View>
      )}

      {step === 2 && (
        <View style={{ gap: spacing.sm }}>
          {SERVICES.map((s) => (
            <Card
              key={s.id}
              onPress={() => setService(s)}
              selected={service?.id === s.id}
              tone={service?.id === s.id ? 'gold' : 'default'}
              padding="md"
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md }}>
                <View style={{ flex: 1, gap: spacing.xxs }}>
                  <View style={{ flexDirection: 'row-reverse', gap: spacing.xs, alignItems: 'center' }}>
                    <Text variant="h3">{s.name}</Text>
                    {s.popular ? (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          backgroundColor: colors.goldTint,
                          borderRadius: radius.pill,
                          borderWidth: 1,
                          borderColor: colors.borderGold,
                        }}
                      >
                        <Text variant="micro" tone="gold" style={{ letterSpacing: 0.5 }}>
                          הכי מבוקש
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text variant="caption" tone="secondary">
                    {s.description}
                  </Text>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Feather name="clock" size={12} color={colors.textTertiary} />
                    <Text variant="micro" tone="tertiary">
                      {s.duration} דקות
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 2 }}>
                  <Text variant="h2" tone="gold">
                    ₪{s.price}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {step === 3 && (
        <View style={{ gap: spacing.md }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.xs, paddingVertical: 2 }}
          >
            {days.map((d) => (
              <Chip
                key={d.key}
                label={d.label}
                sublabel={d.sub}
                active={day.key === d.key}
                onPress={() => {
                  setDayKey(d.key);
                  setTime(null);
                }}
              />
            ))}
          </ScrollView>

          <Text variant="eyebrow" tone="secondary">
            זמנים פנויים
          </Text>
          <View style={styles.timeGrid}>
            {TIMES.map((ts) => (
              <Pressable
                key={ts}
                onPress={() => setTime(ts)}
                style={({ pressed }) => [
                  styles.timeSlot,
                  time === ts && styles.timeSlotActive,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text variant="bodyStrong" tone={time === ts ? 'inverse' : 'primary'} align="center">
                  {ts}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 4 && (
        <View style={{ gap: spacing.md }}>
          <Card tone="hero" padding="lg">
            <Text variant="eyebrow" tone="gold">
              סיכום ההזמנה
            </Text>

            <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
              <Text variant="hero">{time}</Text>
              <Text variant="bodyLarge" tone="secondary">
                {day.label} · {day.sub}
              </Text>
            </View>

            <Divider />

            <SummaryRow label="ספר" value={barber?.name ?? '—'} />
            <SummaryRow label="שירות" value={service?.name ?? '—'} />
            <SummaryRow label="משך" value={`${service?.duration ?? 0} דקות`} />

            <Divider />

            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="bodyStrong">סה"כ</Text>
              <Text variant="h2" tone="gold">
                ₪{service?.price ?? 0}
              </Text>
            </View>
          </Card>

          <View style={{ gap: spacing.xs }}>
            <Text variant="eyebrow" tone="secondary">
              אופן תשלום
            </Text>
            <SegmentedControl
              value={payment}
              onChange={setPayment}
              options={[
                { value: 'in_store', label: 'תשלום בעסק' },
                { value: 'in_app', label: 'תשלום באפליקציה' },
              ]}
            />
          </View>
        </View>
      )}

      {/* Footer action */}
      <View style={{ flexDirection: 'row-reverse', gap: spacing.sm, marginTop: spacing.sm }}>
        {step > 1 ? (
          <Button
            title="הקודם"
            variant="ghost"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={() => setStep((s) => Math.max(1, s - 1))}
          />
        ) : null}
        <Button
          title={step === 4 ? 'אשר הזמנה' : 'המשך'}
          icon={step === 4 ? 'check' : 'arrow-left'}
          disabled={!canContinue}
          style={{ flex: step === 1 ? 1 : 2 }}
          fullWidth={false}
          onPress={() => setStep((s) => Math.min(4, s + 1))}
        />
      </View>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
      <Text variant="body" tone="secondary">
        {label}
      </Text>
      <Text variant="bodyStrong">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timeGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  timeSlot: {
    width: '23.5%',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
});
