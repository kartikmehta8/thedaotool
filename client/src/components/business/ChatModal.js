import React, { useState, useEffect } from 'react';
import { Modal, Input, List } from 'antd';
import { listenToMessages, sendMessage } from '../../api/firebaseBusiness';

const ChatModal = ({ visible, contractId, userId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (visible && contractId) {
      const unsubscribe = listenToMessages(contractId, setMessages);

      return () => {
        unsubscribe(); // Cleanup on modal close.
      };
    }
  }, [visible, contractId]);

  const handleSendMessage = async () => {
    await sendMessage(contractId, userId, 'Business', newMessage);
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
