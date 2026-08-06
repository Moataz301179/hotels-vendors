import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'invo_jwt_token';
const REFRESH_KEY = 'invo_refresh_token';
const USER_KEY = 'invo_user';

export async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

export async function storeUser(user: User): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const data = await SecureStore.getItemAsync(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function clearUser(): Promise<void> {
  await SecureStore.deleteItemAsync(USER_KEY);
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'hotel' | 'supplier' | 'manager' | 'finance' | 'admin';
  tenantId: string;
  hotelId?: string;
  supplierId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OtpLoginCredentials {
  phone: string;
  otp: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'hotel' | 'supplier';
  phone: string;
  city: string;
  governorate: string;
  termsAccepted: boolean;
}