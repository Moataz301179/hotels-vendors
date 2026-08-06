import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-store';

export default function OtpVerificationScreen({ route, navigation }: any) {
  const { phone } = route.params || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/otp-login', { phone, otp });
      const { accessToken, refreshToken, user } = response.data;
      await login(accessToken, refreshToken, user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Phone</Text>
      <Text style={styles.subtitle}>We sent a code to {phone}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.otpInput}
        placeholder="Enter 6-digit code"
        placeholderTextColor={theme.colors.textMuted}
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleVerify} disabled={loading || otp.length !== 6}>
        {loading ? <ActivityIndicator color={theme.colors.background} /> : <Text style={styles.primaryButtonText}>Verify</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.resendText}>Resend code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.xxl, paddingTop: 80 },
  title: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.sm },
  subtitle: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.xxxl },
  error: { backgroundColor: 'rgba(239,68,68,0.15)', color: theme.colors.error, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, fontSize: theme.typography.md },
  otpInput: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, fontSize: 32, color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing.xxl, letterSpacing: 8 },
  primaryButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center', marginBottom: theme.spacing.xxl },
  primaryButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
  resendText: { color: theme.colors.primary, fontSize: theme.typography.md, textAlign: 'center' },
});