import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, List, Grid } from 'antd';
import { motion } from 'framer-motion';
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

  const screens = Grid.useBreakpoint();

  return (
    <Modal
      open={visible}
      onCancel={handleModalClose}
      title="Chat with Contributor"
      footer={null}
      width={screens.xs ? '100%' : 600}
      bodyStyle={{ flex: 1, overflowY: 'auto' }}
      wrapClassName="modal-right"
      modalRender={(modal) => (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {modal}
        </motion.div>
      )}
    >
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
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

ChatModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  bountyId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatModal;
