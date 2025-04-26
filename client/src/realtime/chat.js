import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_BACKEND_URL);
  }
  return socket;
};

export const listenToMessages = (contractId, onNewMessage, onHistory) => {
  const socket = initSocket();
  socket.emit('join-contract', contractId);

  socket.on('new-message', onNewMessage);
  socket.on('chat-history', onHistory);

  return () => {
    socket.off('new-message', onNewMessage);
    socket.off('chat-history', onHistory);
  };
};

export const sendMessage = (contractId, userId, senderName, text) => {
  if (!text.trim()) return;
  const socket = initSocket();
  socket.emit('send-message', {
    contractId,
    senderId: userId,
    senderName,
    text: text.trim(),
  });
};
