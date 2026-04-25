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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) Alert.alert(t.common.error, t.auth.emailOrPasswordError);
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'space-between', gap: spacing.xl, paddingTop: spacing.xxl }}>
        <Brandmark size="lg" />

        <View style={{ gap: spacing.md }}>
          <View style={{ gap: spacing.xxs, marginBottom: spacing.sm }}>
            <Text variant="eyebrow" tone="gold" align="right">
              ברוך הבא
            </Text>
            <Text variant="hero" align="right">
              כניסה לחשבון
            </Text>
            <Text variant="body" tone="secondary" align="right">
              התחבר כדי להזמין תור, לנהל תורים ולקבל תזכורות.
            </Text>
          </View>

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
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button title={t.auth.login} onPress={onLogin} loading={loading} icon="arrow-left" />
        </View>

        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text variant="body" tone="gold" align="center">
            {t.auth.toSignup}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
