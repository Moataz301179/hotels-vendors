import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';

const MOCK_INVOICES: any[] = [
  { id: 'INV-2026-001234', po: 'PO-1025', supplier: 'Nile Trading Co.', amount: 120840, status: 'paid', dueDate: '2026-09-03', etaStatus: 'VALIDATED' },
  { id: 'INV-2026-001233', po: 'PO-1024', supplier: 'Green Valley Farms', amount: 45000, status: 'pending', dueDate: '2026-08-15', etaStatus: 'SUBMITTED' },
  { id: 'INV-2026-001232', po: 'PO-1023', supplier: 'Mediterranean Oils', amount: 85000, status: 'overdue', dueDate: '2026-07-20', etaStatus: 'VALIDATED' },
];

export default function InvoicesScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);

  const statusConfig: Record<string, { color: string; label: string }> = {
    paid: { color: theme.colors.success, label: 'Paid' },
    pending: { color: theme.colors.warning, label: 'Pending' },
    overdue: { color: theme.colors.error, label: 'Overdue' },
  };

  const etaConfig: Record<string, { color: string; label: string }> = {
    VALIDATED: { color: theme.colors.success, label: 'ETA ✓' },
    SUBMITTED: { color: theme.colors.info, label: 'ETA Pending' },
    DRAFT: { color: theme.colors.textMuted, label: 'Draft' },
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_INVOICES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('InvoiceDetail', item)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig[item.status].color + '20' }]}>
                <Text style={[styles.statusText, { color: statusConfig[item.status].color }]}>{statusConfig[item.status].label}</Text>
              </View>
            </View>
            <Text style={styles.cardSupplier}>{item.supplier}</Text>
            <View style={styles.cardMetaRow}>
              <Text style={styles.cardAmount}>EGP {item.amount.toLocaleString()}</Text>
              <View style={[styles.etaBadge, { backgroundColor: etaConfig[item.etaStatus].color + '20' }]}>
                <Text style={[styles.etaText, { color: etaConfig[item.etaStatus].color }]}>{etaConfig[item.etaStatus].label}</Text>
              </View>
            </View>
            <Text style={styles.cardDue}>Due: {item.dueDate}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: theme.spacing.xxl, paddingTop: theme.spacing.lg, paddingBottom: 40 },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs },
  cardId: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500' },
  statusBadge: { paddingHorizontal: theme.spacing.sm, paddingVertical: 2, borderRadius: theme.radius.full },
  statusText: { fontSize: theme.typography.xs, fontWeight: '500' },
  cardSupplier: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs },
  cardAmount: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500' },
  etaBadge: { paddingHorizontal: theme.spacing.sm, paddingVertical: 2, borderRadius: theme.radius.full },
  etaText: { fontSize: theme.typography.xs, fontWeight: '500' },
  cardDue: { fontSize: theme.typography.xs, color: theme.colors.textMuted },
});