import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { BookingScreen } from '../screens/customer/BookingScreen';
import { MyAppointmentsScreen } from '../screens/customer/MyAppointmentsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { t } from '../i18n/he';
import { CustomTabBar } from './CustomTabBar';
import type { CustomerTabParamList } from './types';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export function CustomerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t.tabs.home }} />
      <Tab.Screen name="Book" component={BookingScreen} options={{ tabBarLabel: t.tabs.book }} />
      <Tab.Screen
        name="MyAppointments"
        component={MyAppointmentsScreen}
        options={{ tabBarLabel: t.tabs.myAppointments }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t.tabs.profile }} />
    </Tab.Navigator>
  );
}
