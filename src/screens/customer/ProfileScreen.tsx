import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { AppHeader } from '../../components/AppHeader';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { ListRow } from '../../components/ListRow';
import { TextField } from '../../components/TextField';
import { Divider } from '../../components/Divider';
import { useAuth } from '../../store/AuthContext';
import { supabase } from '../../lib/supabase';
import { t } from '../../i18n/he';
import { colors, spacing } from '../../theme';

export function ProfileScreen() {
  const { profile, session, refreshProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState(true);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile]);

  async function save() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim() || null })
      .eq('id', profile.id);
    setSaving(false);
    if (error) return Alert.alert(t.common.error, error.message);
    await refreshProfile();
    Alert.alert(t.common.success, t.profile.updateSuccess);
  }

  return (
    <Screen>
      <AppHeader />

      <View style={{ gap: spacing.xxs }}>
        <Text variant="eyebrow" tone="gold">
          חשבון
        </Text>
        <Text variant="hero">הפרופיל שלי</Text>
        <Text variant="body" tone="secondary">
          פרטים אישיים, התראות והגדרות.
        </Text>
      </View>

      <Card tone="hero" padding="lg">
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md }}>
          <Avatar name={profile?.full_name} size={64} tone="gold" />
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="h2">{profile?.full_name || 'משתמש חדש'}</Text>
            <Text variant="caption" tone="secondary">
              {session?.user.email}
            </Text>
          </View>
          <Feather name="shield" size={18} color={colors.gold} />
        </View>
      </Card>

      <View style={{ gap: spacing.sm }}>
        <Text variant="eyebrow" tone="secondary">
          פרטים אישיים
        </Text>
        <Card padding="md">
          <TextField label={t.profile.name} value={fullName} onChangeText={setFullName} />
          <View style={{ height: spacing.sm }} />
          <TextField
            label={t.profile.phone}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={{ height: spacing.md }} />
          <Button title={t.common.save} onPress={save} loading={saving} icon="check" />
        </Card>
      </View>

      <View style={{ gap: spacing.sm }}>
        <Text variant="eyebrow" tone="secondary">
          העדפות
        </Text>
        <Card padding="none">
          <ListRow
            icon="bell"
            title="תזכורות והתראות"
            subtitle="דחיפת תזכורת לפני תור"
            trailing={
              <ToggleVisual on={notif} onPress={() => setNotif((v) => !v)} />
            }
          />
          <Divider spaced={false} />
          <ListRow icon="globe" title="שפה" subtitle="עברית" trailing="עברית" />
          <Divider spaced={false} />
          <ListRow icon="moon" title="מצב כהה" subtitle="תמיד פעיל במצב פרימיום" trailing="פעיל" />
        </Card>
      </View>

      <View style={{ gap: spacing.sm }}>
        <Text variant="eyebrow" tone="secondary">
          מידע
        </Text>
        <Card padding="none">
          <ListRow icon="help-circle" title="עזרה ותמיכה" onPress={() => {}} />
          <Divider spaced={false} />
          <ListRow icon="file-text" title="תנאי שימוש" onPress={() => {}} />
          <Divider spaced={false} />
          <ListRow icon="shield" title="מדיניות פרטיות" onPress={() => {}} />
        </Card>
      </View>

      <Button title={t.auth.logout} variant="danger" icon="log-out" onPress={signOut} />
    </Screen>
  );
}

// Lightweight toggle — a simple on/off pill, no external dep.
function ToggleVisual({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <View
      onTouchEnd={onPress}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        backgroundColor: on ? colors.gold : colors.surfaceElevated,
        borderWidth: 1,
        borderColor: on ? colors.gold : colors.border,
        justifyContent: 'center',
        padding: 2,
        alignItems: on ? 'flex-start' : 'flex-end',
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          backgroundColor: on ? colors.textInverse : colors.textSecondary,
        }}
      />
    </View>
  );
}
