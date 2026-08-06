import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { theme } from '../../lib/theme';

export default function RequisitionReviewScreen({ route, navigation }: any) {
  const { barcode, type } = route.params || {};
  const [quantity, setQuantity] = useState('1');
  const [outlet, setOutlet] = useState('Kitchen');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const productName = barcode ? `Product ${barcode}` : 'Unknown Product';
  const supplierName = 'Nile Trading Co.';
  const price = 45;
  const unit = 'Roll';

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('https://hotelsvendors.com/api/v1/hotel/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          barcode,
          quantity: parseInt(quantity),
          unit,
          price,
          outlet,
          note,
          supplierName,
        }),
      });
      Alert.alert('Success', 'Requisition submitted successfully');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to submit requisition. It has been queued for sync.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Requisition</Text>

      <View style={styles.productCard}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productMeta}>SKU: {barcode || 'N/A'} | Supplier: {supplierName}</Text>
        <View style={styles.productMetaRow}>
          <Text style={styles.productPrice}>EGP {price}/{unit}</Text>
          <Text style={styles.productStock}>Stock: 2,400 {unit}s</Text>
        </View>
      </View>

      <Text style={styles.label}>Quantity</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}>
          <Text style={styles.qtyButtonText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.qtyInput}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          textAlign="center"
        />
        <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity((parseInt(quantity) + 1).toString())}>
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.qtyUnit}>{unit}</Text>
      </View>

      <Text style={styles.label}>Outlet</Text>
      <View style={styles.picker}>
        <Text style={styles.pickerText}>{outlet}</Text>
      </View>

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Add a note..."
        placeholderTextColor={theme.colors.textMuted}
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <Text style={styles.submitButtonText}>Submitting...</Text>
        ) : (
          <Text style={styles.submitButtonText}>Submit Requisition</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.xxl, paddingTop: 20, paddingBottom: 40 },
  title: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.xxl },
  productCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.xxl },
  productName: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.xs },
  productMeta: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  productMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  productPrice: { fontSize: theme.typography.lg, color: theme.colors.primary, fontWeight: '500' },
  productStock: { fontSize: theme.typography.md, color: theme.colors.textSecondary },
  label: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, marginTop: theme.spacing.lg },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  qtyButton: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  qtyButtonText: { fontSize: 24, color: theme.colors.text },
  qtyInput: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, width: 80, height: 48, textAlign: 'center', color: theme.colors.text, fontSize: theme.typography.lg },
  qtyUnit: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
  picker: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, marginBottom: theme.spacing.lg },
  pickerText: { color: theme.colors.text, fontSize: theme.typography.md },
  noteInput: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, color: theme.colors.text, fontSize: theme.typography.md, minHeight: 80, textAlignVertical: 'top' },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center', marginBottom: theme.spacing.lg },
  cancelButtonText: { color: theme.colors.textSecondary, fontSize: theme.typography.lg },
  submitButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  submitButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
});