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

    socket.on('join-contract', async (contractId) => {
      if (!contractId) return;

      socket.join(contractId);
      console.log(`📨 ${socket.id} joined contract: ${contractId}`);

      // ✅ Step 1: Emit chat history once
      try {
        const chatRef = ref(rtdb, `chats/${contractId}`);
        const snapshot = await get(chatRef);
        const history = [];
        snapshot.forEach((child) => {
          history.push(child.val());
        });
        socket.emit('chat-history', history); // one-time message history.
      } catch (err) {
        console.error('Error fetching chat history:', err.message);
      }

      // ✅ Step 2: Setup real-time listener if not already.
      if (!listeners[contractId]) {
        const chatRef = ref(rtdb, `chats/${contractId}`);
        listeners[contractId] = onChildAdded(chatRef, (snapshot) => {
          const msg = snapshot.val();
          io.to(contractId).emit('new-message', msg);
        });
      }
    });

    socket.on(
      'send-message',
      async ({ contractId, senderId, senderName, text }) => {
        if (!text?.trim()) return;

        const chatRef = ref(rtdb, `chats/${contractId}`);
        const msg = {
          senderId,
          senderName,
          text: text.trim(),
          timestamp: new Date().toISOString(),
        };

        await push(chatRef, msg);
      }
    );

    socket.on('disconnect', () => {
      console.log(`🔴 Disconnected: ${socket.id}`);
    });
  });

  return io;
};
