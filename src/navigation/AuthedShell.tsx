import React, { useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import { useAuth } from '../store/AuthContext';
import { DrawerProvider } from '../components/Drawer';
import { t } from '../i18n/he';
import { CustomerNavigator } from './CustomerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { navigate } from './navigationService';
import { BUSINESS } from '../data/placeholders';

export function AuthedShell() {
  const { profile, session, signOut } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const drawerConfig = useMemo(
    () => ({
      name: profile?.full_name || 'אורח',
      subtitle: session?.user.email ?? undefined,
      sections: [
        {
          title: 'ניווט',
          items: [
            {
              key: 'home',
              label: isAdmin ? t.tabs.dashboard : t.tabs.home,
              icon: (isAdmin ? 'bar-chart-2' : 'home') as const,
              onPress: () => navigate(isAdmin ? 'Dashboard' : 'Home'),
            },
            {
              key: 'book',
              label: isAdmin ? t.tabs.appointments : t.tabs.book,
              icon: 'calendar' as const,
              onPress: () => navigate(isAdmin ? 'Appointments' : 'Book'),
            },
            {
              key: 'history',
              label: isAdmin ? t.tabs.services : t.tabs.myAppointments,
              icon: (isAdmin ? 'tag' : 'clock') as const,
              onPress: () => navigate(isAdmin ? 'Services' : 'MyAppointments'),
            },
            {
              key: 'profile',
              label: t.tabs.profile,
              icon: 'user' as const,
              onPress: () => navigate('Profile'),
            },
          ],
        },
        {
          title: 'מידע ותמיכה',
          items: [
            {
              key: 'contact',
              label: 'צור קשר',
              icon: 'phone' as const,
              caption: BUSINESS.phone,
              onPress: () => Linking.openURL(`tel:${BUSINESS.phone}`).catch(() => {}),
            },
            {
              key: 'address',
              label: 'כתובת העסק',
              icon: 'map-pin' as const,
              caption: BUSINESS.address,
              onPress: () =>
                Linking.openURL(
                  `https://maps.google.com/?q=${encodeURIComponent(BUSINESS.address)}`
                ).catch(() => {}),
            },
            {
              key: 'help',
              label: 'עזרה ותמיכה',
              icon: 'help-circle' as const,
              onPress: () => Alert.alert('עזרה', 'יתווסף בקרוב'),
            },
            {
              key: 'terms',
              label: 'תנאי שימוש',
              icon: 'file-text' as const,
              onPress: () => Alert.alert('תנאי שימוש', 'יתווסף בקרוב'),
            },
            {
              key: 'share',
              label: 'שתף את האפליקציה',
              icon: 'share-2' as const,
              onPress: () => Linking.openURL('https://example.com').catch(() => {}),
            },
          ],
        },
        {
          items: [
            {
              key: 'logout',
              label: t.auth.logout,
              icon: 'log-out' as const,
              onPress: signOut,
              danger: true,
            },
          ],
        },
      ],
    }),
    [profile, session, isAdmin, signOut]
  );

  return (
    <DrawerProvider config={drawerConfig}>
      {isAdmin ? <AdminNavigator /> : <CustomerNavigator />}
    </DrawerProvider>
  );
}
