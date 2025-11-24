import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Redirect, useRouter } from 'expo-router';

export default function LoginScreen() {
  const { token, signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  if (token) return <Redirect href="/(tabs)" />;

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn(username.trim(), password);
      router.replace('/');
    } catch (e: any) {
      setError('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập tài xế</Text>
      <TextInput
        placeholder="Tài khoản"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 24 },
  input: { width: '100%', backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 12 },
  button: { width: '100%', backgroundColor: '#0ea5e9', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#ef4444', marginBottom: 8 }
});
