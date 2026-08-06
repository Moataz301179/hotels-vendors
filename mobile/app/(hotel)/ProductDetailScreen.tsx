import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../../lib/theme';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const [outlet, setOutlet] = useState('Kitchen');

  const handleAddToRequisition = () => {
    navigation.navigate('RequisitionReview', {
      product,
      quantity,
      outlet,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>📦</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.productName}>{product?.name || 'Product'}</Text>
        <Text style={styles.productSku}>SKU: {product?.sku || 'N/A'}</Text>
        <Text style={styles.productSupplier}>{product?.supplier || 'N/A'}</Text>
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>Unit Price</Text>
        <Text style={styles.priceValue}>EGP {product?.price}/ {product?.unit}</Text>
      </View>

      <View style={styles.stockCard}>
        <Text style={styles.stockLabel}>Available Stock</Text>
        <Text style={styles.stockValue}>{product?.stock?.toLocaleString()} {product?.unit}s</Text>
      </View>

      <Text style={styles.sectionTitle}>Quantity</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Text style={styles.qtyButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(quantity + 1)}>
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.qtyUnit}>{product?.unit}</Text>
      </View>

      <Text style={styles.sectionTitle}>Outlet</Text>
      <View style={styles.picker}>
        <Text style={styles.pickerText}>{outlet}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddToRequisition}>
        <Text style={styles.addButtonText}>Add to Requisition</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 40 },
  imagePlaceholder: { backgroundColor: theme.colors.surface, margin: theme.spacing.xxl, borderRadius: theme.radius.lg, height: 200, alignItems: 'center', justifyContent: 'center' },
  imageText: { fontSize: 80 },
  infoSection: { paddingHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.lg },
  productName: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.xs },
  productSku: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: 4 },
  productSupplier: { fontSize: theme.typography.md, color: theme.colors.textMuted },
  priceCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.md },
  priceLabel: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: 4 },
  priceValue: { fontSize: theme.typography.xxxl, color: theme.colors.primary, fontWeight: '500' },
  stockCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.xxl },
  stockLabel: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: 4 },
  stockValue: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500' },
  sectionTitle: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500', paddingHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.md, marginTop: theme.spacing.lg },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.lg },
  qtyButton: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  qtyButtonText: { fontSize: 24, color: theme.colors.text },
  qtyValue: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500', width: 60, textAlign: 'center' },
  qtyUnit: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
  picker: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, marginHorizontal: theme.spacing.xxl, marginBottom: theme.spacing.lg },
  pickerText: { color: theme.colors.text, fontSize: theme.typography.md },
  addButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center', marginHorizontal: theme.spacing.xxl, marginTop: theme.spacing.lg },
  addButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
});