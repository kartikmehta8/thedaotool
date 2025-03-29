import React from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../providers/firebase';
import toast from '../../utils/toast';

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

      const newContract = {
        name: values.name || '',
        description: values.description || '',
        deadline: values.deadline?.format('YYYY-MM-DD') || '',
        amount: Number(values.amount || 0),
        businessId: userId,
        contractorId: null,
        status: 'open',
        submittedLink: '',
        createdAt: new Date().toISOString(),
        tags: values.tags ? values.tags.split(',') : [],
      };

      await addDoc(collection(db, 'contracts'), newContract);
      toast.success('Contract created');
      onCancel();
      form.resetFields();
      onCreateSuccess();
    } catch (err) {
      toast.error('Failed to create contract');
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
