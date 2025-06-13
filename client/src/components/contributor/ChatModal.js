import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button, List, Grid } from 'antd';
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

  const screens = Grid.useBreakpoint();

  return (
    <Modal
      open={visible}
      title={`Chat with ${bounty?.organizationInfo?.companyName || 'Organization'}`}
      onCancel={onCancel}
      footer={null}
      width={screens.xs ? '100%' : 600}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
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

ChatModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  bounty: PropTypes.object,
  userId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ChatModal;
