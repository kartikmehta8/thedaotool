import React, { useState, useEffect } from 'react';
import { Modal, Input, List } from 'antd';
import { ref, onChildAdded, push, off } from 'firebase/database';
import { rtdb } from '../../providers/firebase';

const ChatModal = ({ visible, contractId, userId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (visible && contractId) {
      const chatRef = ref(rtdb, `chats/${contractId}`);
      onChildAdded(chatRef, (snapshot) => {
        const msg = snapshot.val();
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        off(chatRef);
      };
    }
  }, [visible, contractId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const chatRef = ref(rtdb, `chats/${contractId}`);
    await push(chatRef, {
      senderId: userId,
      senderName: 'Business',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    });
    setNewMessage('');
  };

  const handleModalClose = () => {
    setMessages([]);
    setNewMessage('');
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      title={`Chat with Contractor`}
      footer={null}
      width={600}
    >
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: '#111',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
        }}
      >
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item>
              <strong>{item.senderName}:</strong> {item.text}
            </List.Item>
          )}
        />
      </div>
      <Input.Search
        placeholder="Type a message..."
        enterButton="Send"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSearch={handleSendMessage}
      />
    </Modal>
  );
};

export default ChatModal;
