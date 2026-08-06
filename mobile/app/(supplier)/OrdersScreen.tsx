import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';

const MOCK_ORDERS: any[] = [
  { id: 'PO-1025', hotel: 'Stella Di Mare', amount: 120840, status: 'accepted', date: '2026-08-04', etaStatus: 'VALIDATED' },
  { id: 'PO-1024', hotel: 'Sunrise Resort', amount: 45000, status: 'pending', date: '2026-08-03', etaStatus: 'SUBMITTED' },
  { id: 'PO-1023', hotel: 'Royal Palace', amount: 85000, status: 'delivered', date: '2026-07-28', etaStatus: 'PAID' },
];

export default function SupplierOrdersScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);

  const statusConfig: Record<string, { color: string; label: string }> = {
    accepted: { color: theme.colors.success, label: 'Accepted' },
    pending: { color: theme.colors.warning, label: 'Pending' },
    delivered: { color: theme.colors.info, label: 'Delivered' },
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
        data={MOCK_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderDetail', item)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig[item.status].color + '20' }]}>
                <Text style={[styles.statusText, { color: statusConfig[item.status].color }]}>{statusConfig[item.status].label}</Text>
              </View>
            </View>
            <Text style={styles.cardHotel}>{item.hotel}</Text>
            <View style={styles.cardMetaRow}>
              <Text style={styles.cardAmount}>EGP {item.amount.toLocaleString()}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
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
  cardHotel: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardAmount: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500' },
  cardDate: { fontSize: theme.typography.xs, color: theme.colors.textMuted },
});