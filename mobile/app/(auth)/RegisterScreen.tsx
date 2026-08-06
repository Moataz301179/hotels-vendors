import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-store';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'hotel' | 'supplier'>('supplier');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        role,
        city,
        governorate,
        termsAccepted,
      });
      const { accessToken, refreshToken, user } = response.data;
      await login(accessToken, refreshToken, user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the INVO marketplace</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={theme.colors.textMuted} value={name} onChangeText={setName} />

      <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={theme.colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={theme.colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />

      <TextInput style={styles.input} placeholder="Phone number" placeholderTextColor={theme.colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <View style={styles.roleSelector}>
        <Text style={styles.label}>I am a</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'hotel' && styles.roleButtonActive]}
            onPress={() => setRole('hotel')}
          >
            <Text style={[styles.roleButtonText, role === 'hotel' && styles.roleButtonTextActive]}>Hotel Buyer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'supplier' && styles.roleButtonActive]}
            onPress={() => setRole('supplier')}
          >
            <Text style={[styles.roleButtonText, role === 'supplier' && styles.roleButtonTextActive]}>Supplier</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput style={styles.input} placeholder="City" placeholderTextColor={theme.colors.textMuted} value={city} onChangeText={setCity} />

      <TextInput style={styles.input} placeholder="Governorate" placeholderTextColor={theme.colors.textMuted} value={governorate} onChangeText={setGovernorate} />

      <TouchableOpacity style={styles.termsRow} onPress={() => setTermsAccepted(!termsAccepted)}>
        <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
          {termsAccepted ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.primaryButton, !termsAccepted && styles.primaryButtonDisabled]} onPress={handleRegister} disabled={loading || !termsAccepted}>
        {loading ? <ActivityIndicator color={theme.colors.background} /> : <Text style={styles.primaryButtonText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? <Text style={styles.switchLink}>Sign In</Text></Text>
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
  roleSelector: { marginBottom: theme.spacing.lg },
  label: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  roleButtons: { flexDirection: 'row', gap: theme.spacing.md },
  roleButton: { flex: 1, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  roleButtonActive: { borderColor: theme.colors.primary, backgroundColor: 'rgba(249,115,22,0.1)' },
  roleButtonText: { color: theme.colors.textSecondary, fontSize: theme.typography.md },
  roleButtonTextActive: { color: theme.colors.primary, fontWeight: '500' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.sm },
  checkboxActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  checkmark: { color: theme.colors.background, fontSize: 14, fontWeight: '500' },
  termsText: { flex: 1, fontSize: theme.typography.md, color: theme.colors.textSecondary },
  primaryButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center', marginBottom: theme.spacing.xxl },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
  switchText: { color: theme.colors.textSecondary, fontSize: theme.typography.md },
  switchLink: { color: theme.colors.primary, fontWeight: '500' },
});