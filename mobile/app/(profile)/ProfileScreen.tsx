import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../lib/theme';
import { useAuth } from '../../lib/auth-store';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          {editing ? (
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          ) : (
            <Text style={styles.fieldValue}>{name}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Phone</Text>
          {editing ? (
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          ) : (
            <Text style={styles.fieldValue}>{phone || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Company</Text>
          {editing ? (
            <TextInput style={styles.input} value={company} onChangeText={setCompany} />
          ) : (
            <Text style={styles.fieldValue}>{company || 'Not set'}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => editing ? handleSave() : setEditing(true)}>
          <Text style={styles.editButtonText}>{editing ? 'Save' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Change Password</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Two-Factor Authentication</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.xxl, paddingTop: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: theme.spacing.xxl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, color: theme.colors.background, fontWeight: '500' },
  userName: { fontSize: theme.typography.xxxl, color: theme.colors.text, fontWeight: '500', marginTop: theme.spacing.md },
  userRole: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginTop: 4 },
  infoSection: { marginBottom: theme.spacing.xxl },
  sectionTitle: { fontSize: theme.typography.lg, color: theme.colors.text, fontWeight: '500', marginBottom: theme.spacing.lg },
  field: { marginBottom: theme.spacing.lg },
  fieldLabel: { fontSize: theme.typography.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
  fieldValue: { fontSize: theme.typography.md, color: theme.colors.text },
  input: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, fontSize: theme.typography.md, color: theme.colors.text },
  editButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  editButtonText: { color: theme.colors.background, fontSize: theme.typography.lg, fontWeight: '500' },
  section: { marginBottom: theme.spacing.xxl },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: theme.spacing.md },
  menuText: { flex: 1, fontSize: theme.typography.md, color: theme.colors.text },
  menuArrow: { fontSize: 16, color: theme.colors.textMuted },
  logoutButton: { backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: theme.radius.md, paddingVertical: theme.spacing.md, alignItems: 'center' },
  logoutButtonText: { color: theme.colors.error, fontSize: theme.typography.lg, fontWeight: '500' },
});