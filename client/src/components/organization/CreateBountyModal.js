import React from 'react';
import { Modal, Form, Input, DatePicker, Button, Tooltip, Grid } from 'antd';
import { createBounty } from '../../api/organization/bounties';
import toast from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';

const CreateBountyModal = ({ visible, onCancel, onCreateSuccess, userId }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const emailVerified = user?.emailVerified || false;

  const handleCreate = async () => {
    if (!emailVerified) {
      toast.warning('Please verify your email before creating a bounty');
      return;
    }
    try {
      const values = await form.validateFields();
      await createBounty(values, userId);
      onCreateSuccess();
      toast.success('Bounty created successfully');
      onCancel();
      form.resetFields();
    } catch (err) {
      toast.error('Error creating bounty');
    }
  };

  const screens = Grid.useBreakpoint();

  return (
    <Modal
      title="Create New Bounty"
      open={visible}
      onCancel={onCancel}
      footer={null}
      closeIcon={
        <span style={{ color: 'var(--text-color)', fontSize: '16px' }}>×</span>
      }
      width={screens.xs ? '100%' : 600}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
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
          label={
            <span>
              Tags (comma separated)
              <Tooltip title="Used for skill matching" placement="right">
                <span style={{ marginLeft: 4, cursor: 'help' }}>?</span>
              </Tooltip>
            </span>
          }
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

export default CreateBountyModal;
