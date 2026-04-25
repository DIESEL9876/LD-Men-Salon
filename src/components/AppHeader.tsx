import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../theme';
import { IconButton } from './IconButton';
import { useDrawer } from './Drawer';

export function AppHeader({
  canGoBack,
  trailing,
}: {
  canGoBack?: boolean;
  trailing?: React.ReactNode;
}) {
  const { open } = useDrawer();
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: spacing.md,
      }}
    >
      {canGoBack ? (
        <IconButton icon="chevron-right" tone="subtle" onPress={() => navigation.goBack()} />
      ) : (
        <IconButton icon="menu" onPress={open} />
      )}
      <View style={{ flexDirection: 'row-reverse', gap: spacing.xs }}>{trailing}</View>
    </View>
  );
}
