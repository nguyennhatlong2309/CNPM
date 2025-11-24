import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import api from '../../src/services/api';
import { sendEvent } from '../../src/services/ws';

export default function ReportsScreen() {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const quickSend = async (type: string) => {
    setSending(true);
    try {
      await api.post('/driver/reports', { type });
    } catch {}
    try {
      sendEvent('alert', { type });
    } catch {}
    setSending(false);
    Alert.alert('Đã gửi', type);
  };

  const submit = async () => {
    if (!text.trim()) return;
    setSending(true);
    try { await api.post('/driver/reports', { type: 'custom', text }); } catch {}
    try { sendEvent('alert', { type: 'custom', text }); } catch {}
    setSending(false);
    setText('');
    Alert.alert('Đã gửi', 'Báo cáo đã được gửi');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo cáo / Cảnh báo</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: '#f97316' }]} onPress={() => quickSend('tac_duong')} disabled={sending}>
          <Text style={styles.quickText}>Tắc đường</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: '#ef4444' }]} onPress={() => quickSend('tai_nan')} disabled={sending}>
          <Text style={styles.quickText}>Tai nạn</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: '#0ea5e9' }]} onPress={() => quickSend('ky_thuat')} disabled={sending}>
          <Text style={styles.quickText}>Kỹ thuật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: '#22c55e' }]} onPress={() => quickSend('khac')} disabled={sending}>
          <Text style={styles.quickText}>Khác</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Nhập nội dung</Text>
      <TextInput placeholder="Mô tả sự cố..." style={styles.input} value={text} onChangeText={setText} multiline />
      <TouchableOpacity style={styles.sendBtn} onPress={submit} disabled={sending}>
        <Text style={styles.sendText}>Gửi báo cáo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16, gap: 12 },
  title: { fontWeight: '700', fontSize: 18 },
  row: { flexDirection: 'row', gap: 12 },
  quickBtn: { flex: 1, padding: 18, borderRadius: 14, alignItems: 'center' },
  quickText: { color: '#fff', fontWeight: '700' },
  subtitle: { fontWeight: '600', marginTop: 4 },
  input: { backgroundColor: '#fff', minHeight: 120, textAlignVertical: 'top', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  sendBtn: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 12, alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: '700' }
});
