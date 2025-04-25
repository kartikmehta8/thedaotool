// === COMPONENT: BusinessPaymentHistory.jsx ===
import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import { getBusinessPayments } from '../../api/firebaseBusiness';
import formatDate from '../../utils/formatDate';

const { Title } = Typography;

const columns = [
  {
    title: 'Contractor',
    dataIndex: 'contractor',
    key: 'contractor',
  },
  {
    title: 'Contract',
    dataIndex: 'contractTitle',
    key: 'contractTitle',
  },
  {
    title: 'Amount ($)',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (date) => formatDate(date),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag
        color={
          status === 'Success' ? 'green' : status === 'Pending' ? 'gold' : 'red'
        }
      >
        {status}
      </Tag>
    ),
  },
];

const BusinessPaymentHistory = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await getBusinessPayments(user.uid);
      setData(res);
      setLoading(false);
    };
    fetchPayments();
  }, [user.uid]);

  return (
    <Card
      title={<Title level={4}>Payment History</Title>}
      style={{ margin: 24 }}
    >
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default BusinessPaymentHistory;
