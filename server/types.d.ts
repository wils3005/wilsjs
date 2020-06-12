import WebSocketLib from "ws";

interface PeerClient {
  id?: string;
  getId: () => string;
  getToken: () => string;
  getSocket: () => WebSocketLib | null;
  setSocket: (socket: WebSocketLib | null) => void;
  getLastPing: () => number;
  setLastPing: (lastPing: number) => void;
  send: (data: unknown) => void;
}

interface ColouredShape {
  colour: string;
  shape: string;
}
