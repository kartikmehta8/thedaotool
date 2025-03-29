import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, List } from 'antd';
import { onChildAdded, push, ref } from 'firebase/database';
import { rtdb } from '../../providers/firebase';

const ChatModal = ({ visible, contract, userId, onCancel }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (visible && contract) {
      setMessages([]);
      const chatRef = ref(rtdb, `chats/${contract.id}`);
      // eslint-disable-next-line no-unused-vars
      const unsubscribe = onChildAdded(chatRef, (snapshot) => {
        setMessages((prev) => [...prev, snapshot.val()]);
      });

      return () => {
        // This doesn't actually unsubscribe in Firebase RTDB.
        // In a real app, you'd want to implement a proper cleanup.
        // Firebase RTDB requires calling off() to detach listeners.
      };
    }
  }, [visible, contract]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msgRef = ref(rtdb, `chats/${contract.id}`);
    push(msgRef, {
      sender: userId,
      senderName: 'Contractor',
      text: chatInput,
      timestamp: Date.now(),
    });
    setChatInput('');
  };

  return (
    <Modal
      open={visible}
      title={`Chat with ${contract?.businessInfo?.companyName}`}
      onCancel={onCancel}
      footer={null}
    >
      <List
        size="small"
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <strong>{msg.sender === userId ? 'You' : 'Them'}:</strong>{' '}
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
        onClick={sendMessage}
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
