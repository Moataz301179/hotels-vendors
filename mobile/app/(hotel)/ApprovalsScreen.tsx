import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';

const MOCK_REQUISITIONS: any[] = [
  { id: 'REQ-0042', title: 'Kitchen Towels', status: 'submitted', time: '2h ago', outlet: 'Kitchen', quantity: 12, unit: 'Pack' },
  { id: 'REQ-0041', title: 'Pool Bar Stock', status: 'approved', time: '1d ago', outlet: 'Pool Bar', quantity: 5, unit: 'Case' },
  { id: 'REQ-0040', title: 'Linen Set - King', status: 'rejected', time: '2d ago', outlet: 'Housekeeping', quantity: 20, unit: 'Set' },
];

const MOCK_PENDING = [
  { id: 'REQ-0043', title: 'Bathroom Amenities', status: 'pending_approval', time: '30m ago', outlet: 'Main Lobby', quantity: 10, unit: 'Kit' },
  { id: 'REQ-0044', title: 'Cleaning Supplies', status: 'pending_approval', time: '1h ago', outlet: 'Housekeeping', quantity: 3, unit: 'Box' },
];

export default function ApprovalsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  const data = activeTab === 'pending' ? MOCK_PENDING : MOCK_REQUISITIONS;

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return theme.colors.success;
      case 'rejected': return theme.colors.error;
      case 'submitted': return theme.colors.info;
      case 'pending_approval': return theme.colors.warning;
      default: return theme.colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'pending' && styles.tabActive]} onPress={() => setActiveTab('pending')}>
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Pending Approval ({MOCK_PENDING.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'all' && styles.tabActive]} onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All Requisitions</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequisitionDetail', item)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardMetaText}>{item.outlet} • {item.quantity} {item.unit}</Text>
              <Text style={styles.cardMetaText}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabBar: { flexDirection: 'row', paddingHorizontal: theme.spacing.xxl, paddingTop: 16, gap: theme.spacing.sm },
  tab: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
  tabActive: { borderBottomWidth: 2, borderBottomColor: theme.colors.primary },
  tabText: { fontSize: theme.typography.md, color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.primary, fontWeight: '500' },
  list: { paddingHorizontal: theme.spacing.xxl, paddingTop: theme.spacing.lg, paddingBottom: 40 },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  cardId: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500' },
  statusBadge: { paddingHorizontal: theme.spacing.sm, paddingVertical: 2, borderRadius: theme.radius.full },
  statusText: { fontSize: theme.typography.xs, fontWeight: '500' },
  cardTitle: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMetaText: { fontSize: theme.typography.xs, color: theme.colors.textMuted },
});