import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, List } from 'antd';
import { listenToMessages, sendMessage } from '../../realtime/chat';

const ChatModal = ({ visible, bounty, userId, onCancel }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (visible && bounty?.id) {
      setMessages([]); // Reset messages on modal open.
      const unsubscribe = listenToMessages(
        bounty.id,
        (msg) => setMessages((prev) => [...prev, msg]),
        (history) => setMessages(history)
      );

      return () => {
        if (unsubscribe) unsubscribe(); // Clean up listener when closing.
      };
    }
  }, [visible, bounty]);

  const handleSendMessage = async () => {
    await sendMessage(bounty.id, userId, 'Contributor', chatInput);
    setChatInput('');
  };

  return (
    <Modal
      open={visible}
      title={`Chat with ${bounty?.organizationInfo?.companyName || 'Organization'}`}
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
