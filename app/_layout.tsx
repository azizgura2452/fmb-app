import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useFonts,
  JetBrainsMono_400Regular,
} from '@expo-google-fonts/jetbrains-mono';
import { NotoSans_400Regular } from '@expo-google-fonts/noto-sans';
import * as Localization from 'expo-localization';
import { SplashScreen, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '@/store';
import {
  registerForPushNotificationsAsync,
  setNotificationHandler,
} from '@/services/notificationService';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

import { Setting } from '@/lib/types';
import { StackHeader, Themes } from '@/lib/ui';
import * as Notifications from 'expo-notifications';
import { API_URL } from '@/services/base.api';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    NotoSans_400Regular,
    JetBrainsMono_400Regular,
    ...MaterialCommunityIcons.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
};

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = React.useState<Setting>({
    theme: 'light',
    color: 'default',
    language: 'auto',
  });
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Load settings from the device
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      SecureStore.getItemAsync('settings').then((result) => {
        if (result === null) {
          SecureStore.setItemAsync('settings', JSON.stringify(settings)).then(
            (res) => console.log(res),
          );
        }

        setSettings(JSON.parse(result ?? JSON.stringify(settings)));
      });
    } else {
      setSettings({ ...settings, theme: colorScheme ?? 'light' });
    }
  }, []);

  // Notification setup
  useEffect(() => {
    setNotificationHandler();

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        console.log('Push token:', token);
        // Send token to your backend here
        sendTokenToBackend(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      },
    );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification tapped:', response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const sendTokenToBackend = async (token) => {
    try {
      const response = await fetch(API_URL + 'save_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ token }),
      });
      console.log('Token saved:', await response.json());
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider
          theme={
            Themes[
            'light'
            ]['gold']
          }
        >
          <Stack
            screenOptions={{
              animation: 'default',
              header: (props) => (
                <StackHeader navProps={props} children={undefined} />
              ),
              headerShown: false,
            }}
          >
            <Stack.Screen name="(guard)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default RootLayout;