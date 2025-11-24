async function get(key: string): Promise<string | null> {
  try { return Promise.resolve(window.localStorage.getItem(key)); } catch { return Promise.resolve(null); }
}

async function set(key: string, value: string): Promise<void> {
  try { window.localStorage.setItem(key, value); } catch {}
}

async function remove(key: string): Promise<void> {
  try { window.localStorage.removeItem(key); } catch {}
}

const storage = { get, set, remove };
export default storage;
