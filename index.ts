import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { I18nManager, NativeModules } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

// Force RTL for Hebrew.
//
// IMPORTANT: `I18nManager.forceRTL(true)` only flips JS-side state
// immediately — the native layout engine doesn't pick up the change until
// the next *full* app reload. Without that reload, JS reads `isRTL = true`
// while the native side keeps rendering in LTR, so:
//   - `flexDirection: 'row'` doesn't auto-flip → text/buttons stay on the left
//   - `right: 0` doesn't flip → drawer slides in from the wrong physical edge
//
// To guarantee a single, deterministic state we reload the JS bundle once
// the first time we enable RTL. After the reload `I18nManager.isRTL` is
// already `true`, so this whole block is skipped on every subsequent boot.
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // `DevSettings.reload()` is available in Expo Go / dev builds and on
  // every standard RN runtime — it triggers a clean JS bundle reload.
  // Wrap in try/catch so a missing module never crashes a release build;
  // worst case the user simply re-opens the app once and RTL "sticks".
  try {
    (NativeModules as any).DevSettings?.reload?.();
  } catch {
    // no-op — fall back to "user relaunches once on first install"
  }
}

registerRootComponent(App);
