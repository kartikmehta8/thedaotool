import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_BACKEND_URL);
  }
  return socket;
};

export const listenToMessages = (bountyId, onNewMessage, onHistory) => {
  const socket = initSocket();
  socket.emit('join-bounty', bountyId);

  socket.on('new-message', onNewMessage);
  socket.on('chat-history', onHistory);

  return () => {
    socket.off('new-message', onNewMessage);
    socket.off('chat-history', onHistory);
  };
};

export const sendMessage = (bountyId, userId, senderName, text) => {
  if (!text.trim()) return;
  const socket = initSocket();
  socket.emit('send-message', {
    bountyId,
    senderId: userId,
    senderName,
    text: text.trim(),
  });
};
