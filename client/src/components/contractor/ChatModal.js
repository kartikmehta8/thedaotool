import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, List } from 'antd';
import { subscribeToChat, sendChatMessage } from '../../api/firebaseContractor';

const ChatModal = ({ visible, contract, userId, onCancel }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (visible && contract?.id) {
      setMessages([]); // Reset messages on modal open.
      const unsubscribe = subscribeToChat(contract.id, setMessages);

      return () => {
        if (unsubscribe) unsubscribe(); // Clean up listener when closing.
      };
    }
  }, [visible, contract]);

  const handleSendMessage = async () => {
    await sendChatMessage(contract.id, userId, 'Contractor', chatInput);
    setChatInput('');
  };

  return (
    <Modal
      open={visible}
      title={`Chat with ${contract?.businessInfo?.companyName || 'Business'}`}
      onCancel={onCancel}
      footer={null}
    >
      <List
        size="small"
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <strong>{msg.sender === userId ? 'You' : msg.senderName}:</strong>{' '}
            {msg.text}
          </List.Item>
        )}
        style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 10 }}
      />
      <Input.TextArea
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        rows={2}
        placeholder="Type your message..."
      />
      <Button
        onClick={handleSendMessage}
        type="primary"
        block
        style={{ marginTop: 8 }}
      >
        Send
      </Button>
    </Modal>
  );
};

export default ChatModal;
