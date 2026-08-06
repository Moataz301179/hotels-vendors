import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-store';

export default function SupplierDashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, pendingInvoices: 0, revenue: 0 });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>INVO</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.headerIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Welcome back, {user?.name || 'Supplier'}</Text>
        <Text style={styles.welcomeSub}>Here is your overview</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.orders}</Text>
          <Text style={styles.statLabel}>Active Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pendingInvoices}</Text>
          <Text style={styles.statLabel}>Pending Invoices</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>EGP {stats.revenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SupplierOrders')}>
        <Text style={styles.menuIcon}>📋</Text>
        <Text style={styles.menuText}>My Orders</Text>
        <Text style={styles.menuArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SupplierInvoices')}>
        <Text style={styles.menuIcon}>🧾</Text>
        <Text style={styles.menuText}>Invoices</Text>
        <Text style={styles.menuArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.menuIcon}>⚙️</Text>
        <Text style={styles.menuText}>Settings</Text>
        <Text style={styles.menuArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.xxl, paddingTop: 20, paddingBottom: theme.spacing.lg },
  headerTitle: { fontSize: theme.typography.xxxl, color: theme.colors.primary, fontWeight: '500', letterSpacing: 3 },
  headerActions: { flexDirection: 'row', gap: theme.spacing.lg },
  headerIcon: { fontSize: 24 },
  welcomeCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.xxl },
  welcomeText: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500' },
  welcomeSub: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: theme.spacing.md, paddingHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.xxl },
  statCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, alignItems: 'center' },
  statNumber: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500' },
  statLabel: { fontSize: theme.typography.xs, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.xxl, paddingVertical: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: theme.spacing.md },
  menuIcon: { fontSize: 24, width: 32 },
  menuText: { flex: 1, fontSize: theme.typography.md, color: theme.colors.text },
  menuArrow: { fontSize: 16, color: theme.colors.textMuted },
});