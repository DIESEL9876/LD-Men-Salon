import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Text } from '../../components/Text';
import { Brandmark } from '../../components/Brandmark';
import { supabase } from '../../lib/supabase';
import { t } from '../../i18n/he';
import { spacing } from '../../theme';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSignup() {
    setError(null);
    if (!fullName.trim()) return setError(t.auth.nameRequired);
    if (password.length < 6) return setError(t.auth.weakPassword);

    setLoading(true);
    const { error: signupErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim(), phone: phone.trim() || null } },
    });
    setLoading(false);
    if (signupErr) Alert.alert(t.common.error, signupErr.message);
  }

  return (
    <Screen>
      <View style={{ flex: 1, gap: spacing.lg, paddingTop: spacing.xl }}>
        <Brandmark size="md" />

        <View style={{ gap: spacing.xxs }}>
          <Text variant="eyebrow" tone="gold" align="right">
            הצטרפות
          </Text>
          <Text variant="hero" align="right">
            יוצרים חשבון חדש
          </Text>
          <Text variant="body" tone="secondary" align="right">
            זה לוקח פחות מדקה — וזה כל מה שצריך כדי להתחיל.
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <TextField
            label={t.auth.fullName}
            placeholder="ישראל ישראלי"
            value={fullName}
            onChangeText={setFullName}
            textContentType="name"
          />
          <TextField
            label={t.auth.phone}
            placeholder="050-000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
          />
          <TextField
            label={t.auth.email}
            placeholder="name@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextField
            label={t.auth.password}
            placeholder="לפחות 6 תווים"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error ?? undefined}
          />
        </View>

        <Button title={t.auth.signup} onPress={onSignup} loading={loading} icon="arrow-left" />

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text variant="body" tone="gold" align="center">
            {t.auth.toLogin}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
