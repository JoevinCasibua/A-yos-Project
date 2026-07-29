import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { theme } from '@/constants/theme';
import { ArrowLeft, User, Mail, Phone, X } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';

export default function AccountScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<{ id: string, title: string, value: string, field: 'name' | 'email' | 'phone' } | null>(null);
  const [editValue, setEditValue] = useState('');

  const INFO_ITEMS = [
    { id: '1', title: 'Name', value: user?.name || 'Juan Dela Cruz', icon: User, field: 'name' as const },
    { id: '2', title: 'Email Address', value: user?.email || 'juan.delacruz@example.com', icon: Mail, field: 'email' as const },
    { id: '3', title: 'Phone Number', value: user?.phone || '0917 123 4567', icon: Phone, field: 'phone' as const },
  ];

  const handleEdit = (item: typeof INFO_ITEMS[0]) => {
    setEditingField(item);
    setEditValue(item.value);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingField && editValue.trim() !== '') {
      updateUser({ [editingField.field]: editValue.trim() });
    }
    setIsEditing(false);
    Keyboard.dismiss();
  };

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <View style={styles.card}>
            {INFO_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={[styles.infoRow, index !== INFO_ITEMS.length - 1 && styles.borderBottom]}>
                  <View style={styles.iconContainer}>
                    <Icon color={theme.colors.textSecondary} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.typography.caption}>{item.title}</Text>
                    <Text style={[theme.typography.body1, { marginTop: 2 }]}>{item.value}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Text style={[theme.typography.button, { color: theme.colors.primary, fontSize: 14 }]}>Edit</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={isEditing} transparent animationType="slide">
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={theme.typography.h3}>Edit {editingField?.title}</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeBtn}>
                <X color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            
            <AppInput 
              label={editingField?.title || ''}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter new ${editingField?.title.toLowerCase()}`}
              keyboardType={editingField?.field === 'email' ? 'email-address' : editingField?.field === 'phone' ? 'phone-pad' : 'default'}
              autoCapitalize={editingField?.field === 'email' ? 'none' : 'words'}
              autoFocus
              containerStyle={{ marginBottom: theme.spacing.xl }}
            />
            
            <AppButton 
              label="Save Changes"
              onPress={handleSave}
              fullWidth
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.md },
  
  section: { marginBottom: theme.spacing.xl },
  
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.background, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: theme.spacing.xl, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl },
  closeBtn: { padding: theme.spacing.xs },
});
