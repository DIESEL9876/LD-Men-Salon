import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radius, shadows, spacing } from '../theme';
import { Text } from '../components/Text';

// Icon + label mapping per route — kept here so each navigator can pass
// whatever route names it wants and we render the right glyph.
const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Book: 'calendar',
  MyAppointments: 'clock',
  Profile: 'user',
  Dashboard: 'bar-chart-2',
  Appointments: 'calendar',
  Services: 'tag',
  Barbers: 'users',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.wrap}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = (options.tabBarLabel as string) ?? options.title ?? route.name;
          const icon = ICONS[route.name] ?? 'circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.item,
                focused && styles.itemActive,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              <Feather
                name={icon}
                size={focused ? 20 : 18}
                color={focused ? colors.textInverse : colors.textSecondary}
              />
              {focused ? (
                <Text
                  variant="micro"
                  tone="inverse"
                  style={{ fontWeight: '700', letterSpacing: 0.3 }}
                >
                  {label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 6,
    gap: 4,
    ...shadows.elevated,
  },
  item: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  itemActive: {
    backgroundColor: colors.gold,
  },
});
