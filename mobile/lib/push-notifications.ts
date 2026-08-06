import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push notification permission');
    return null;
  }

  const projectId = 'invo-mobile-project';
  const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F97316',
    });

    await Notifications.setNotificationChannelAsync('order_status', {
      name: 'Order Status',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F97316',
    });

    await Notifications.setNotificationChannelAsync('payment', {
      name: 'Payment',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22C55E',
    });

    await Notifications.setNotificationChannelAsync('alert', {
      name: 'Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#EF4444',
    });
  }

  return pushToken.data;
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  try {
    await fetch('https://exp.host/--api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
      }),
    });
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  trigger?: { seconds: number } | { date: Date }
): Promise<void> {
  let triggerInput: Notifications.NotificationTriggerInput = null;
  if (trigger) {
    if ('seconds' in trigger) {
      triggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: trigger.seconds,
      };
    } else {
      triggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger.date,
      };
    }
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: {},
    },
    trigger: triggerInput,
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getNotificationPermissions(): Promise<{
  granted: boolean;
  status: string;
}> {
  const { status } = await Notifications.getPermissionsAsync();
  return { granted: status === 'granted', status };
}