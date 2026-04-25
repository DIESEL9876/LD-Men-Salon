import { Platform, ViewStyle } from 'react-native';

// Subtle, premium shadows — never harsh.
export const shadows = {
  none: {} as ViewStyle,
  subtle: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ViewStyle,
  elevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: {
      elevation: 6,
    },
    default: {},
  }) as ViewStyle,
  glow: Platform.select({
    ios: {
      shadowColor: '#C9A961',
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 4,
    },
    default: {},
  }) as ViewStyle,
};
