import React from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import { createContract } from '../../api/firebaseBusiness';

const CreateContractModal = ({
  visible,
  onCancel,
  onCreateSuccess,
  userId,
}) => {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createContract(values, userId, onCreateSuccess);
      onCancel(); // Close modal after successful creation.
      form.resetFields();
    } catch (err) {
      console.error('Contract creation failed:', err);
    }
  };

  return (
    <Modal
      title="Create New Contract"
      open={visible}
      onCancel={onCancel}
      footer={null}
      closeIcon={<span style={{ color: '#fff', fontSize: '16px' }}>×</span>}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="name"
          label="Task Name"
          rules={[{ required: true, message: 'Please enter Task Name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter Description' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Please enter Deadline' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount ($)"
          rules={[{ required: true, message: 'Please enter Amount ($)' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="tags"
          label="Tags (comma separated)"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" block onClick={handleCreate}>
          Create
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateContractModal;
