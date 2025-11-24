import { Platform } from 'react-native';
let socket: WebSocket | null = null;

const wsURL: string = (process.env.EXPO_PUBLIC_WS_URL as string) ||
  (Platform.OS === 'android' ? 'ws://10.0.2.2:4000' : 'ws://localhost:4000');

export function getWS(token?: string | null) {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    const url: string = token ? `${wsURL}?token=${encodeURIComponent(token)}` : wsURL;
    socket = new WebSocket(url);
  }
  return socket;
}

export function sendEvent(event: string, data: any) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ event, data }));
}
