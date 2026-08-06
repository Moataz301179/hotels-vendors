import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';
import { api } from '../../lib/api';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <Text style={styles.successIcon}>📧</Text>
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>We sent a password reset link to {email}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.primaryButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email and we will send you a reset link</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={theme.colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <TouchableOpacity style={styles.primaryButton} onPress={handleReset} disabled={loading}>
        {loading ? <ActivityIndicator color={theme.colors.background} /> : <Text style={styles.primaryButtonText}>Send Reset Link</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.xxl, paddingTop: 80 },
  title: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.sm },
  subtitle: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.xxxl },
  error: { backgroundColor: 'rgba(239,68,68,0.15)', color: theme.colors.error, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, fontSize: theme.typography.md },
  input: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, fontSize: theme.typography.md, color: theme.colors.text, marginBottom: theme.spacing.lg },
  primaryButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center', marginBottom: theme.spacing.xxl },
  primaryButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
  switchText: { color: theme.colors.primary, fontSize: theme.typography.md, textAlign: 'center' },
  successIcon: { fontSize: 64, textAlign: 'center', marginBottom: theme.spacing.lg },
});