import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  I18nManager,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { Divider } from './Divider';
import { ListRow } from './ListRow';
import { Brandmark } from './Brandmark';

type DrawerApi = { open: () => void; close: () => void };
const DrawerContext = createContext<DrawerApi>({ open: () => {}, close: () => {} });
export const useDrawer = () => useContext(DrawerContext);

export type DrawerItem = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  danger?: boolean;
  caption?: string;
};

type DrawerConfig = {
  name?: string;
  subtitle?: string;
  sections: { title?: string; items: DrawerItem[] }[];
};

const WIDTH = Math.min(340, Dimensions.get('window').width * 0.88);
// Under forceRTL, RN auto-flips physical-axis style props like `left`/`right`
// — but it does NOT flip `transform: [{ translateX }]`. So to pin the sheet
// to the physical RIGHT edge in both LTR and RTL builds, we set `left: 0`
// under RTL (RN will flip it to physical right) and `right: 0` otherwise.
// The hidden translateX is +WIDTH in both cases (off-screen physical-right).
const isRTL = I18nManager.isRTL;
const HIDDEN_TX = WIDTH;

export function DrawerProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: DrawerConfig;
}) {
  const [visible, setVisible] = useState(false);
  const tx = useRef(new Animated.Value(HIDDEN_TX)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(tx, {
        toValue: HIDDEN_TX,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [tx, backdropOpacity]);

  useEffect(() => {
    if (visible) {
      tx.setValue(HIDDEN_TX);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(tx, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, tx, backdropOpacity]);

  return (
    <DrawerContext.Provider value={{ open, close }}>
      {children}
      <Modal
        transparent
        visible={visible}
        onRequestClose={close}
        statusBarTranslucent
        animationType="none"
      >
        <View style={styles.root}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
            <Pressable style={{ flex: 1 }} onPress={close} />
          </Animated.View>

          <Animated.View
            style={[
              styles.sheet,
              { width: WIDTH, transform: [{ translateX: tx }] },
            ]}
          >
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
              <View style={styles.brandBar}>
                <Brandmark layout="inline" size="xs" showTagline={false} />
              </View>

              <View style={styles.header}>
                <Avatar name={config.name} size={56} tone="gold" />

                <View style={styles.headerTextWrap}>
                  <Text variant="eyebrow" tone="gold">
                    חשבון
                  </Text>

                  <Text variant="h3">
                    {config.name ?? 'אורח'}
                  </Text>

                  {config.subtitle ? (
                    <Text variant="caption" tone="secondary">
                      {config.subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>

              <Divider />

              <View style={styles.sectionsWrap}>
                {config.sections.map((section, sIdx) => (
                  <View key={sIdx} style={styles.sectionBlock}>
                    {section.title ? (
                      <Text
                        variant="eyebrow"
                        tone="tertiary"
                        style={styles.sectionTitle}
                      >
                        {section.title}
                      </Text>
                    ) : null}

                    {section.items.map((item) => (
                      <ListRow
                        key={item.key}
                        icon={item.icon}
                        title={item.label}
                        subtitle={item.caption}
                        danger={item.danger}
                        onPress={() => {
                          close();
                          setTimeout(item.onPress, 180);
                        }}
                      />
                    ))}
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <Text variant="micro" tone="dim" align="center">
                  גרסה 0.1 · Premium barber experience
                </Text>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </DrawerContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayStrong,
  },

  sheet: {
    position: 'absolute',
    top: 0,
    ...(isRTL ? { left: 0 } : { right: 0 }),
    height: '100%',
    backgroundColor: colors.surfaceSubtle,
    borderTopLeftRadius: radius.xxl,
    borderBottomLeftRadius: radius.xxl,
    borderLeftWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  brandBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    alignItems: 'flex-end',
  },

  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },

  headerTextWrap: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-end',
  },

  sectionsWrap: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },

  sectionBlock: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },

  footer: {
    padding: spacing.lg,
  },
});