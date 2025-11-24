import * as SecureStore from 'expo-secure-store';

async function get(key: string): Promise<string | null> {
  try { return await SecureStore.getItemAsync(key); } catch { return null; }
}

async function set(key: string, value: string): Promise<void> {
  try { await SecureStore.setItemAsync(key, value); } catch {}
}

async function remove(key: string): Promise<void> {
  try { await SecureStore.deleteItemAsync(key); } catch {}
}

export default { get, set, remove };
