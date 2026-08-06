import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';

export default function InvoiceDetailScreen({ route, navigation }: any) {
  const { id, po, supplier, amount, status, dueDate, etaStatus } = route.params || {};

  const paymentOptions = [
    { id: 'oliv', name: 'Pay via Credit Line (Oliv)', icon: '💳', available: 'EGP 3,200,000' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', detail: 'IBAN: EG00 0000 0000 0000 0000 0000 000' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice {id}</Text>
        <View />
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: status === 'paid' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)' }]}>
            <Text style={[styles.statusText, { color: status === 'paid' ? theme.colors.success : theme.colors.warning }]}>{status.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PO</Text>
          <Text style={styles.infoValue}>{po}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Supplier</Text>
          <Text style={styles.infoValue}>{supplier}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Amount</Text>
          <Text style={styles.amountText}>EGP {amount.toLocaleString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Due Date</Text>
          <Text style={styles.infoValue}>{dueDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ETA Status</Text>
          <Text style={[styles.infoValue, { color: theme.colors.success }]}>{etaStatus}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Payment Options</Text>

      {paymentOptions.map((option) => (
        <TouchableOpacity key={option.id} style={styles.paymentCard}>
          <Text style={styles.paymentIcon}>{option.icon}</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>{option.name}</Text>
            <Text style={styles.paymentDetail}>{option.available || option.detail}</Text>
          </View>
          <Text style={styles.paymentArrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.xxl, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xxl },
  backButton: { color: theme.colors.textSecondary, fontSize: 16 },
  headerTitle: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500' },
  infoCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.xxl },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  infoLabel: { fontSize: theme.typography.md, color: theme.colors.textSecondary },
  infoValue: { fontSize: theme.typography.md, color: theme.colors.text },
  amountText: { fontSize: theme.typography.xxxl, color: theme.colors.primary, fontWeight: '500' },
  statusBadge: { paddingHorizontal: theme.spacing.sm, paddingVertical: 2, borderRadius: theme.radius.full },
  statusText: { fontSize: theme.typography.xs, fontWeight: '500' },
  sectionTitle: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.lg },
  paymentCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  paymentIcon: { fontSize: 32 },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500' },
  paymentDetail: { fontSize: theme.typography.sm, color: theme.colors.textSecondary, marginTop: 2 },
  paymentArrow: { fontSize: 20, color: theme.colors.textMuted },
});