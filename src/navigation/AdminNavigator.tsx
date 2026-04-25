import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminAppointmentsScreen } from '../screens/admin/AdminAppointmentsScreen';
import { AdminServicesScreen } from '../screens/admin/AdminServicesScreen';
import { AdminBarbersScreen } from '../screens/admin/AdminBarbersScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { t } from '../i18n/he';
import { CustomTabBar } from './CustomTabBar';
import type { AdminTabParamList } from './types';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ tabBarLabel: t.tabs.dashboard }} />
      <Tab.Screen name="Appointments" component={AdminAppointmentsScreen} options={{ tabBarLabel: t.tabs.appointments }} />
      <Tab.Screen name="Services" component={AdminServicesScreen} options={{ tabBarLabel: t.tabs.services }} />
      <Tab.Screen name="Barbers" component={AdminBarbersScreen} options={{ tabBarLabel: t.tabs.barbers }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t.tabs.profile }} />
    </Tab.Navigator>
  );
}
