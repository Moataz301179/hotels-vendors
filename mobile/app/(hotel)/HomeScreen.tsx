import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-store';

export default function HotelHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ requisitions: 0, pendingApprovals: 0, orders: 0, invoices: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        api.get('/hotel/dashboard/stats'),
        api.get('/hotel/dashboard/activities'),
      ]);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
    } catch {
      setStats({ requisitions: 3, pendingApprovals: 2, orders: 1, invoices: 1 });
      setActivities([
        { id: '1', type: 'requisition', title: 'REQ-0042', desc: 'Kitchen Towels', time: '2h ago', status: 'submitted' },
        { id: '2', type: 'po', title: 'PO-1023', desc: 'F&B Delivery', time: '3d ago', status: 'delivered' },
        { id: '3', type: 'invoice', title: 'INV-2026-001234', desc: 'Paid via Credit Line', time: '5d ago', status: 'paid' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      <View style={styles.insightCard}>
        <Text style={styles.insightIcon}>💡</Text>
        <Text style={styles.insightText}>
          Housekeeping scan shows 40% increase in towel requests this week. Consider reorder.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('RequisitionDetail')}>
          <Text style={styles.statNumber}>{stats.requisitions}</Text>
          <Text style={styles.statLabel}>My Requisitions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Approvals')}>
          <Text style={styles.statNumber}>{stats.pendingApprovals}</Text>
          <Text style={styles.statLabel}>Pending Approvals</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {activities.map((item) => (
        <TouchableOpacity key={item.id} style={styles.activityItem}>
          <View style={styles.activityLeft}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDesc}>{item.desc}</Text>
          </View>
          <Text style={styles.activityTime}>{item.time}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.xxl, paddingTop: 20, paddingBottom: 100 },
  loadingContainer: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xxl },
  headerTitle: { fontSize: theme.typography.xxxl, color: theme.colors.primary, fontWeight: '500', letterSpacing: 3 },
  headerActions: { flexDirection: 'row', gap: theme.spacing.lg },
  headerIcon: { fontSize: 24, marginLeft: theme.spacing.md },
  insightCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.xxl, flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
  insightIcon: { fontSize: 24 },
  insightText: { flex: 1, fontSize: theme.typography.md, color: theme.colors.textSecondary, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.xxl },
  statCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, alignItems: 'center' },
  statNumber: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500' },
  statLabel: { fontSize: theme.typography.xs, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  sectionTitle: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.lg },
  activityItem: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityLeft: { flex: 1 },
  activityTitle: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500' },
  activityDesc: { fontSize: theme.typography.sm, color: theme.colors.textSecondary, marginTop: 2 },
  activityTime: { fontSize: theme.typography.xs, color: theme.colors.textMuted },
});