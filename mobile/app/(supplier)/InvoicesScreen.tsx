import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';

const MOCK_INVOICES = [
  { id: 'INV-2026-001234', po: 'PO-1025', hotel: 'Stella Di Mare', amount: 120840, status: 'paid', dueDate: '2026-09-03' },
  { id: 'INV-2026-001233', po: 'PO-1024', hotel: 'Sunrise Resort', amount: 45000, status: 'pending', dueDate: '2026-08-15' },
  { id: 'INV-2026-001232', po: 'PO-1023', hotel: 'Royal Palace', amount: 85000, status: 'overdue', dueDate: '2026-07-20' },
];

export default function SupplierInvoicesScreen({ navigation }: any) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    paid: { color: theme.colors.success, label: 'Paid' },
    pending: { color: theme.colors.warning, label: 'Pending' },
    overdue: { color: theme.colors.error, label: 'Overdue' },
  };

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
            <Text style={styles.cardHotel}>{item.hotel}</Text>
            <View style={styles.cardMetaRow}>
              <Text style={styles.cardAmount}>EGP {item.amount.toLocaleString()}</Text>
              <Text style={styles.cardDue}>Due: {item.dueDate}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingHorizontal: theme.spacing.xxl, paddingTop: theme.spacing.lg, paddingBottom: 40 },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs },
  cardId: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500' },
  statusBadge: { paddingHorizontal: theme.spacing.sm, paddingVertical: 2, borderRadius: theme.radius.full },
  statusText: { fontSize: theme.typography.xs, fontWeight: '500' },
  cardHotel: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardAmount: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500' },
  cardDue: { fontSize: theme.typography.xs, color: theme.colors.textMuted },
});