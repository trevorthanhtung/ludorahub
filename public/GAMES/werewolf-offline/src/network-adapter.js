import { NETWORK_MESSAGES } from "./network-message-types.js";

let peer = null;
let connections = {}; // clientId -> dataConnection
let isHost = false;

// Helpers to make connection robust
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'LUDORA_' + result;
}

export const networkAdapter = {
  isHost() {
    return isHost;
  },

  getRoomCode() {
    if (peer) {
      return peer.id.replace('LUDORA_', '');
    }
    return null;
  },

  initHost({ onReady, onClientJoin, onClientLeave, onData }) {
    this.disconnect();
    isHost = true;
    connections = {};
    const fullPeerId = generateRoomCode();
    
    peer = new Peer(fullPeerId, {
      debug: 2
    });

    peer.on('open', (id) => {
      console.log('Host created room:', id);
      if (onReady) onReady(id.replace('LUDORA_', ''));
    });

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        if (data.type === NETWORK_MESSAGES.JOIN_REQUEST) {
          // Store connection and fire onClientJoin
          connections[conn.peer] = conn;
          if (onClientJoin) {
            onClientJoin(conn.peer, data.payload.name, data.payload.sessionId, data.payload.isReconnect);
          }
        } else {
          if (onData) onData(conn.peer, data);
        }
      });

      conn.on('close', () => {
        delete connections[conn.peer];
        if (onClientLeave) onClientLeave(conn.peer);
      });
      
      conn.on('error', (err) => {
        console.error('Connection error with client:', err);
      });
    });

    peer.on('error', (err) => {
      console.error('Host peer error:', err);
      // In a real app we'd handle retries or UI alerts here
    });
  },

    initClient(roomCode, playerName, sessionId, isReconnect, { onConnected, onData, onDisconnected, onError, onRejected }) {
    this.disconnect();
    isHost = false;
    const fullHostId = 'LUDORA_' + roomCode.toUpperCase();
    
    peer = new Peer({
      debug: 2
    });

    peer.on('open', (id) => {
      console.log('Client initialized:', id);
      const conn = peer.connect(fullHostId, { reliable: true });

      conn.on('open', () => {
        console.log('Connected to host:', fullHostId);
        // Save the host connection as our only connection
        connections['HOST'] = conn;
        
        // Send join request
        conn.send({
          type: NETWORK_MESSAGES.JOIN_REQUEST,
          payload: { name: playerName, sessionId: sessionId, isReconnect: isReconnect }
        });
      });

      conn.on('data', (data) => {
        if (data.type === NETWORK_MESSAGES.JOIN_ACCEPTED || data.type === NETWORK_MESSAGES.RECONNECT_SUCCESS) {
          if (onConnected) onConnected();
        } else if (data.type === NETWORK_MESSAGES.JOIN_REJECTED) {
          if (onRejected) onRejected(data.payload?.reason);
          peer.destroy();
        } else {
          if (onData) onData(data);
        }
      });

      conn.on('close', () => {
        console.log('Disconnected from host');
        if (onDisconnected) onDisconnected();
      });
      
      conn.on('error', (err) => {
        console.error('Client connection error:', err);
        if (onError) onError(err);
      });
    });

    peer.on('error', (err) => {
      console.error('Client peer error:', err);
      if (onError) onError(err);
    });
  },

  sendToClient(clientId, data) {
    const conn = connections[clientId];
    if (conn && conn.open) {
      if (this._isDataUnsafe(data)) {
        console.error("SECURITY WARNING: Attempted to send unsafe data to client", clientId);
        return;
      }
      conn.send(data);
    }
  },

  sendToHost(data) {
    const conn = connections['HOST'];
    if (conn && conn.open) {
      conn.send(data);
    }
  },

  broadcast(data) {
    if (!isHost) return;
    if (this._isDataUnsafe(data)) {
      console.error("SECURITY WARNING: Attempted to broadcast unsafe data");
      return;
    }
    Object.values(connections).forEach(conn => {
      if (conn.open) {
        conn.send(data);
      }
    });
  },

  disconnect() {
    if (peer) {
      peer.destroy();
      peer = null;
    }
    connections = {};
    isHost = false;
  },

  getConnectionStatus(clientId) {
    const conn = connections[clientId];
    return conn && conn.open;
  },
  
  _isDataUnsafe(data) {
    if (!data || !data.payload) return false;
    const payload = data.payload;
    // Check for sensitive fields that should never be sent to a client
    if (payload.players && Array.isArray(payload.players) && payload.players.length > 1) return true;
    if (payload.nightActions) return true;
    if (payload.history && Array.isArray(payload.history) && payload.history.length > 5) return true;
    if (payload.gm) return true;
    return false;
  }
};
