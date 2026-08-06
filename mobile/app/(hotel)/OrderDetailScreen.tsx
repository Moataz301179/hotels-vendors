import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';

export default function OrderDetailScreen({ route, navigation }: any) {
  const { id, status, supplier, amount, items, etaStatus } = route.params || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order {id}</Text>
        <View />
      </View>

      <View style={styles.statusBanner}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Supplier</Text>
        <Text style={styles.infoValue}>{supplier}</Text>
        <Text style={[styles.infoLabel, { marginTop: 12 }]}>Total Amount</Text>
        <Text style={styles.amountText}>EGP {amount.toLocaleString()}</Text>
        <Text style={[styles.infoLabel, { marginTop: 12 }]}>ETA Status</Text>
        <Text style={[styles.infoValue, { color: theme.colors.success }]}>{etaStatus}</Text>
      </View>

      <Text style={styles.sectionTitle}>Items</Text>
      {items?.map((item: any, i: number) => (
        <View key={i} style={styles.itemRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQty}>{item.quantity} × EGP {item.price}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.trackButton}>
        <Text style={styles.trackButtonText}>Track Delivery</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.xxl, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xxl },
  backButton: { color: theme.colors.textSecondary, fontSize: 16 },
  headerTitle: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500' },
  statusBanner: { backgroundColor: 'rgba(249,115,22,0.15)', borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center', marginBottom: theme.spacing.lg },
  statusText: { color: theme.colors.primary, fontWeight: '500', fontSize: theme.typography.md },
  infoCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.xxl },
  infoLabel: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: theme.typography.md, color: theme.colors.text },
  amountText: { fontSize: theme.typography.xxxl, color: theme.colors.primary, fontWeight: '500' },
  sectionTitle: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.lg },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  itemName: { fontSize: theme.typography.md, color: theme.colors.text },
  itemQty: { fontSize: theme.typography.md, color: theme.colors.textSecondary },
  trackButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  trackButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
});