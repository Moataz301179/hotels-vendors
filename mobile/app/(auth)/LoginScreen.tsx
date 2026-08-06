import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-store';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      await login(accessToken, refreshToken, user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your INVO account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={theme.colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme.colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.forgotLink}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.background} />
        ) : (
          <Text style={styles.primaryButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.switchText}>
          Don't have an account? <Text style={styles.switchLink}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: 80,
  },
  title: {
    fontSize: theme.typography.xxxl,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxxl,
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xxl,
  },
  forgotText: {
    color: theme.colors.primary,
    fontSize: theme.typography.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.lg,
    fontWeight: '500',
  },
  switchText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.md,
  },
  switchLink: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
});