const { Server } = require('socket.io');
const { rtdb } = require('../utils/firebase');
const { ref, onChildAdded, get, push } = require('firebase/database');

const listeners = {};

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    socket.on('join-contract', (contractId) =>
      joinContract(socket, io, contractId)
    );
    socket.on('send-message', (data) => sendMessage(data));
    socket.on('disconnect', () => handleDisconnect(socket));
  });

  return io;
};

async function joinContract(socket, io, contractId) {
  if (!contractId) return;

  socket.join(contractId);

  const chatRef = ref(rtdb, `chats/${contractId}`);

  // Step 1: Emit chat history.
  try {
    const snapshot = await get(chatRef);
    const history = [];

    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        history.push(child.val());
      });
    }

    socket.emit('chat-history', history);
  } catch (err) {
    console.error('❌ Error fetching chat history:', err.message);
  }

  // Step 2: Setup real-time listener if not already.
  if (!listeners[contractId]) {
    listeners[contractId] = onChildAdded(chatRef, (snapshot) => {
      const msg = snapshot.val();
      io.to(contractId).emit('new-message', msg);
    });
  }
}

async function sendMessage({ contractId, senderId, senderName, text }) {
  if (!contractId || !text?.trim()) return;

  const chatRef = ref(rtdb, `chats/${contractId}`);
  const msg = {
    senderId,
    senderName,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    await push(chatRef, msg);
  } catch (err) {
    console.error('❌ Error sending message:', err.message);
  }
}

function handleDisconnect(socket) {
  console.log(`🔴 Disconnected: ${socket.id}`);
}
