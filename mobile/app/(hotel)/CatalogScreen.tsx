import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';

const CATEGORIES = ['All', 'F&B', 'Housekeeping', 'Engineering', 'Amenities', 'Capital Equipment'];

const MOCK_PRODUCTS: any[] = [
  { id: '1', name: 'Toilet Paper - 2-ply, 400 sheets', sku: 'TP-001', category: 'Housekeeping', price: 45, unit: 'Roll', stock: 2400, supplier: 'Nile Trading Co.' },
  { id: '2', name: 'Tomatoes 25kg', sku: 'FV-042', category: 'F&B', price: 120, unit: 'Case', stock: 800, supplier: 'Green Valley Farms' },
  { id: '3', name: 'Olive Oil 5L', sku: 'FV-089', category: 'F&B', price: 280, unit: 'Bottle', stock: 350, supplier: 'Mediterranean Oils' },
  { id: '4', name: 'Bath Towel - White', sku: 'HS-015', category: 'Housekeeping', price: 85, unit: 'Piece', stock: 1200, supplier: 'Nile Trading Co.' },
  { id: '5', name: 'LED Light Bulb 15W', sku: 'EN-023', category: 'Engineering', price: 35, unit: 'Piece', stock: 5000, supplier: 'Electra Solutions' },
  { id: '6', name: 'Shampoo - Professional 1L', sku: 'AM-007', category: 'Amenities', price: 65, unit: 'Bottle', stock: 900, supplier: 'Glamour Distributors' },
  { id: '7', name: 'Commercial Blender 10L', sku: 'CE-101', category: 'Capital Equipment', price: 4500, unit: 'Piece', stock: 12, supplier: 'KitchenPro Egypt' },
  { id: '8', name: 'Bed Sheet - Queen', sku: 'HS-032', category: 'Housekeeping', price: 120, unit: 'Piece', stock: 800, supplier: 'Textile Masters' },
];

export default function CatalogScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', item)}>
      <View style={styles.productImage}>
        <Text style={styles.productImageText}>📦</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productSku}>SKU: {item.sku}</Text>
        <View style={styles.productMetaRow}>
          <Text style={styles.productPrice}>EGP {item.price}/{item.unit}</Text>
          <Text style={styles.productStock}>Stock: {item.stock.toLocaleString()}</Text>
        </View>
        <Text style={styles.productSupplier}>{item.supplier}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products, SKUs..."
        placeholderTextColor={theme.colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === item && styles.categoryChipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchInput: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, fontSize: theme.typography.md, color: theme.colors.text, marginHorizontal: theme.spacing.xxl, marginTop: 16, marginBottom: theme.spacing.md },
  categoryList: { paddingHorizontal: theme.spacing.xxl, paddingVertical: theme.spacing.sm, gap: theme.spacing.sm },
  categoryChip: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.full, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  categoryChipActive: { backgroundColor: 'rgba(249,115,22,0.15)', borderColor: theme.colors.primary },
  categoryChipText: { fontSize: theme.typography.md, color: theme.colors.textSecondary },
  categoryChipTextActive: { color: theme.colors.primary, fontWeight: '500' },
  list: { paddingHorizontal: theme.spacing.xxl, paddingTop: theme.spacing.sm, paddingBottom: 40 },
  productCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.md, flexDirection: 'row', gap: theme.spacing.md },
  productImage: { width: 60, height: 60, backgroundColor: theme.colors.background, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  productImageText: { fontSize: 28 },
  productInfo: { flex: 1 },
  productName: { fontSize: theme.typography.md, color: theme.colors.text, fontWeight: '500', marginBottom: 2 },
  productSku: { fontSize: theme.typography.xs, color: theme.colors.textMuted, marginBottom: theme.spacing.xs },
  productMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  productPrice: { fontSize: theme.typography.md, color: theme.colors.primary, fontWeight: '500' },
  productStock: { fontSize: theme.typography.xs, color: theme.colors.textSecondary },
  productSupplier: { fontSize: theme.typography.xs, color: theme.colors.textMuted },
  emptyText: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40, fontSize: theme.typography.md },
});