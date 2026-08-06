import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingGatewayScreen from '../(auth)/OnboardingGatewayScreen';
import LoginScreen from '../(auth)/LoginScreen';
import RegisterScreen from '../(auth)/RegisterScreen';
import ForgotPasswordScreen from '../(auth)/ForgotPasswordScreen';
import OtpVerificationScreen from '../(auth)/OtpVerificationScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingGatewayScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    </Stack.Navigator>
  );
}