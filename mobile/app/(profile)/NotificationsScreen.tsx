import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';

const MOCK_NOTIFICATIONS: Record<string, any[]> = {
  today: [
    { id: '1', title: 'REQ-0045 approved by Kitchen Manager', time: '2h ago', type: 'requisition', read: false },
    { id: '2', title: 'PO-1026 delivered to Main Resort', time: '4h ago', type: 'delivery', read: false },
  ],
  yesterday: [
    { id: '3', title: 'INV-2026-001234 paid via Credit Line', time: '1d ago', type: 'payment', read: true },
  ],
  week: [
    { id: '4', title: 'Credit facility 80% utilized', time: '3d ago', type: 'alert', read: false },
    { id: '5', title: 'New supplier approved: Nile Trading', time: '5d ago', type: 'supplier', read: true },
  ],
};

export default function NotificationsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);

  const groups = Object.entries(MOCK_NOTIFICATIONS) as [string, any[]][];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item[0]}
          contentContainerStyle={styles.list}
          renderItem={({ item: [date, notifications] }) => (
            <>
              <Text style={styles.dateHeader}>{date.toUpperCase()}</Text>
              {notifications.map((n: any) => (
                <TouchableOpacity key={n.id} style={[styles.card, !n.read && styles.unreadCard]}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{n.title}</Text>
                    <Text style={styles.cardTime}>{n.time}</Text>
                  </View>
                  {!n.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.xxl, paddingTop: 20, paddingBottom: theme.spacing.lg },
  headerTitle: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500' },
  markAllText: { color: theme.colors.primary, fontSize: theme.typography.md },
  list: { paddingHorizontal: theme.spacing.xxl, paddingBottom: 40 },
  dateHeader: { fontSize: theme.typography.sm, color: theme.colors.textMuted, fontWeight: '500', marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, marginBottom: theme.spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  unreadCard: { borderColor: 'rgba(249,115,22,0.3)' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: theme.typography.md, color: theme.colors.text, marginBottom: 2 },
  cardTime: { fontSize: theme.typography.xs, color: theme.colors.textMuted },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
});