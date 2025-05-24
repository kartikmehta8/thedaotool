const { Server } = require('socket.io');
const { rtdb } = require('../utils/firebase');

const listeners = {};

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-bounty', (bountyId) => joinBounty(socket, io, bountyId));
    socket.on('send-message', (data) => sendMessage(data));
    socket.on('disconnect', () => handleDisconnect(socket));
  });

  return io;
};

async function joinBounty(socket, io, bountyId) {
  if (!bountyId) return;

  socket.join(bountyId);

  const chatRef = rtdb.ref(`chats/${bountyId}`);

  // Step 1: Emit chat history.
  try {
    const snapshot = await chatRef.once('value');
    const history = [];

    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        history.push(child.val());
      });
    }

    socket.emit('chat-history', history);
  } catch (err) {
    console.error('Error fetching chat history:', err.message);
  }

  // Step 2: Setup real-time listener if not already.
  if (!listeners[bountyId]) {
    listeners[bountyId] = chatRef.on('child_added', (snapshot) => {
      const msg = snapshot.val();
      io.to(bountyId).emit('new-message', msg);
    });
  }
}

async function sendMessage({ bountyId, senderId, senderName, text }) {
  if (!bountyId || !text?.trim()) return;

  const chatRef = rtdb.ref(`chats/${bountyId}`);
  const msg = {
    senderId,
    senderName,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    await chatRef.push(msg);
  } catch (err) {
    console.error('Error sending message:', err.message);
  }
}

function handleDisconnect(socket) {
  console.log(`Disconnected: ${socket.id}`);
}
