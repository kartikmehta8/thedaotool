import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import { getOrganizationPayments } from '../../api/organization/payments';
import formatDate from '../../utils/formatDate';

const { Title } = Typography;

const columns = [
  {
    title: 'Contributor',
    dataIndex: 'contributor',
    key: 'contributor',
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

const OrganizationPaymentHistory = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await getOrganizationPayments(user.uid);
      setData(res);
      setLoading(false);
    };
    fetchPayments();
  }, [user.uid]);

  return (
    <div className="page-container">
      <Card
        title={
          <Title level={4} style={{ color: '#fff' }}>
            Payment History
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

export default OrganizationPaymentHistory;
