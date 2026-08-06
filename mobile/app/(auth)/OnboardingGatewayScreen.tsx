import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';
import { useAuth } from '../../lib/auth-store';

export default function OnboardingGatewayScreen() {
  const { setRole } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>INVO</Text>
        <Text style={styles.tagline}>Operational Layer for Hotels Vendors</Text>
      </View>

      <View style={styles.roleSection}>
        <Text style={styles.roleTitle}>I am a</Text>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => { setRole('hotel'); }}
          activeOpacity={0.8}
        >
          <Text style={styles.roleIcon}>🏨</Text>
          <Text style={styles.roleName}>Hotel Buyer</Text>
          <Text style={styles.roleDesc}>I procure goods and services for my hotel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => { setRole('supplier'); }}
          activeOpacity={0.8}
        >
          <Text style={styles.roleIcon}>📦</Text>
          <Text style={styles.roleName}>Supplier</Text>
          <Text style={styles.roleDesc}>I supply products to hotels</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        By continuing, you agree to Terms of Service and Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: theme.typography.xxxl,
    fontWeight: '500',
    color: theme.colors.primary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontWeight: '400',
  },
  roleSection: {
    flex: 1,
  },
  roleTitle: {
    fontSize: theme.typography.lg,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.lg,
  },
  roleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  roleName: {
    fontSize: theme.typography.lg,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  roleDesc: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  footerText: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});