import * as Linking from 'expo-linking';

export const linking = {
  prefixes: ['invo://', 'https://hotelsvendors.com', 'https://invo.hotelsvendors.com'],
  config: {
    screens: {
      Auth: {
        path: 'auth',
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          OtpVerification: 'verify-otp',
        },
      },
      Main: {
        path: 'app',
        screens: {
          HotelHome: 'home',
          Catalog: 'catalog',
          Scan: 'scan',
          Invoices: 'invoices',
          OrderDetail: 'orders/:id',
          InvoiceDetail: 'invoices/:id',
          Notifications: 'notifications',
          Profile: 'profile',
        },
      },
    },
  },
  getInitialURL: async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      return url;
    }
    return null;
  },
  subscribe: (listener: (url: string) => void) => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });
    return subscription;
  },
};

export function handleDeepLink(url: string) {
  const parsed = Linking.parse(url);
  const path = parsed.path ?? '';

  if (path.startsWith('/payment-return')) {
    const reference = parsed.queryParams?.reference;
    const status = parsed.queryParams?.status;
    if (reference && status === 'success') {
      // Poll for payment status
      return { screen: 'InvoiceDetail', params: { reference } };
    }
  }

  if (path.startsWith('/orders/')) {
    const orderId = path.split('/orders/')[1];
    return { screen: 'OrderDetail', params: { id: orderId } };
  }

  if (path.startsWith('/invoices/')) {
    const invoiceId = path.split('/invoices/')[1];
    return { screen: 'InvoiceDetail', params: { id: invoiceId } };
  }

  return { screen: 'Main' };
}