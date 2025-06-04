import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import { getContributorPayments } from '../../api/contributor/payments';
import formatDate from '../../utils/formatDate';
import toast from '../../utils/toast';

const { Title } = Typography;

const columns = [
  {
    title: 'Company',
    dataIndex: 'organizationName',
    key: 'organizationName',
  },
  {
    title: 'Bounty',
    dataIndex: 'bountyTitle',
    key: 'bountyTitle',
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

const ContributorPaymentHistory = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getContributorPayments(user.uid);
        setData(res);
      } catch (err) {
        toast.error('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user.uid]);

  return (
    <div className="page-container">
      <Card
        title={
          <Title level={4} style={{ color: '#fff' }}>
            Your Payment History
          </Title>
        }
        style={{ backgroundColor: '#1f1f1f' }}
        bodyStyle={{ padding: '1rem' }}
      >
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default ContributorPaymentHistory;
