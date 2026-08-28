import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/languages';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [visible, setVisible] = useState(false);

  const renderItem = ({ item }: { item: Language }) => {
    const isActive = item.code === language;
    return (
      <TouchableOpacity
        style={[styles.row, isActive && styles.rowActive]}
        onPress={() => {
          setLanguage(item.code);
          setVisible(false);
        }}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.rowText}>
          <Text style={styles.nativeName}>{item.nativeName}</Text>
          <Text style={styles.englishName}>{item.name}</Text>
        </View>
        {isActive && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
        accessibilityLabel="Change language"
      >
        <Text style={styles.triggerIcon}>🌐</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{t('langSelectTitle')}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={renderItem}
              style={styles.list}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerIcon: {
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sheetTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '700',
  },
  closeIcon: {
    color: '#94a3b8',
    fontSize: 20,
  },
  list: {
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  rowActive: {
    backgroundColor: '#334155',
  },
  flag: {
    fontSize: 22,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  nativeName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },
  englishName: {
    color: '#94a3b8',
    fontSize: 12,
  },
  checkmark: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '800',
  },
});
