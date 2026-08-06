import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from './auth-store';
import { api } from './api';
import { registerForPushNotificationsAsync } from './push-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function NotificationHandler() {
  const { token } = useAuth();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    registerForPushNotifications();
    handleNotificationResponses();
    const appStateSub = AppState.addEventListener('change', handleAppStateChanges);
    return () => appStateSub.remove();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const expoPushToken = await registerForPushNotificationsAsync();
      if (expoPushToken && token) {
        await api.post('/api/v1/notifications/register', {
          expoPushToken,
          platform: Platform.OS,
        });
      }
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
    }
  };

  const handleNotificationResponses = () => {
    Notifications.addNotificationResponseReceivedListener((response) => {
      const { notification } = response;
      const data = notification.request.content.data;

      if (data?.type === 'order_status') {
        // Navigate to order detail
      } else if (data?.type === 'payment') {
        // Navigate to invoice detail
      } else if (data?.type === 'approval') {
        // Navigate to approvals screen
      } else if (data?.type === 'delivery') {
        // Navigate to order tracking
      }
    });
  };

  const handleAppStateChanges = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground - refresh notifications
      refreshNotificationCount();
    }
    appState.current = nextAppState;
  };

  const refreshNotificationCount = async () => {
    try {
      await api.get('/api/v1/notifications/count');
    } catch {
      // Silently fail
    }
  };

  return null;
}