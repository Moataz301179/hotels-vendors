import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';

export default function RequisitionsScreen({ navigation }: any) {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRequisitions([
        { id: 'REQ-0042', title: 'Kitchen Towels', status: 'submitted', time: '2h ago', outlet: 'Kitchen', quantity: 12, unit: 'Pack' },
        { id: 'REQ-0041', title: 'Pool Bar Stock', status: 'approved', time: '1d ago', outlet: 'Pool Bar', quantity: 5, unit: 'Case' },
        { id: 'REQ-0040', title: 'Linen Set - King', status: 'rejected', time: '2d ago', outlet: 'Housekeeping', quantity: 20, unit: 'Set' },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return theme.colors.success;
      case 'rejected': return theme.colors.error;
      case 'submitted': return theme.colors.info;
      default: return theme.colors.textMuted;
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
    <View style={styles.container}>
      <FlatList
        data={requisitions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequisitionDetail', item)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
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
  loadingContainer: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
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