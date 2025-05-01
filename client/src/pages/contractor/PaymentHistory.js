import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import { getContractorPayments } from '../../api/contractor/payments';
import formatDate from '../../utils/formatDate';

const { Title } = Typography;

const columns = [
  {
    title: 'Company',
    dataIndex: 'businessName',
    key: 'businessName',
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

const ContractorPaymentHistory = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getContractorPayments(user.uid);
        setData(res);
      } catch (err) {
        console.error('Failed to fetch payments.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user.uid]);

  return (
    <Card
      title={<Title level={4}>Your Payment History</Title>}
      style={{ marginTop: 24 }}
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

export default ContractorPaymentHistory;
