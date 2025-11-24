import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import api from '../../src/services/api';
import { getWS } from '../../src/services/ws';
import { useAuth } from '../../src/context/AuthContext';

interface Msg { id: string; from: 'driver' | 'coordinator'; text: string; createdAt: string }

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const { token } = useAuth();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    let mounted = true;
    api.get('/chat/history').then(r => {
      if (!mounted) return;
      setMessages(r.data as Msg[]);
    }).catch(() => {
      if (!mounted) return;
      setMessages([]);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const ws = getWS(token);
    if (!ws) return;
    const onMessage = (e: any) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === 'chat') {
          setMessages(prev => [...prev, { id: String(Date.now()), from: 'coordinator', text: msg.data.text, createdAt: new Date().toISOString() }]);
          setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
        }
      } catch {}
    };
    ws.addEventListener('message', onMessage);
    return () => { ws.removeEventListener('message', onMessage); };
  }, [token]);

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    setText('');
    const my = { id: String(Date.now()), from: 'driver' as const, text: t, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, my]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    try { await api.post('/chat/send', { text: t }); } catch {}
    try { getWS(token)?.send(JSON.stringify({ event: 'chat', data: { text: t } })); } catch {}
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        style={{ flex: 1 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.from === 'driver' ? styles.me : styles.them]}>
            <Text style={{ color: item.from === 'driver' ? '#fff' : '#0f172a' }}>{item.text}</Text>
          </View>
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Nhắn cho điều phối viên..." value={text} onChangeText={setText} />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  bubble: { padding: 10, borderRadius: 12, marginVertical: 6, maxWidth: '80%' },
  me: { alignSelf: 'flex-end', backgroundColor: '#0ea5e9' },
  them: { alignSelf: 'flex-start', backgroundColor: '#e2e8f0' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  sendBtn: { backgroundColor: '#0ea5e9', paddingHorizontal: 16, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});
