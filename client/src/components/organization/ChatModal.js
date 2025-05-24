import React, { useState, useEffect } from 'react';
import { Modal, Input, List } from 'antd';
import { listenToMessages, sendMessage } from '../../realtime/chat';

const ChatModal = ({ visible, bountyId, userId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (visible && bountyId) {
      const unsubscribe = listenToMessages(
        bountyId,
        (msg) => setMessages((prev) => [...prev, msg]),
        (history) => setMessages(history)
      );

      return () => {
        unsubscribe();
      };
    }
  }, [visible, bountyId]);

  const handleSendMessage = async () => {
    await sendMessage(bountyId, userId, 'Organization', newMessage);
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
      title="Chat with Contributor"
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
