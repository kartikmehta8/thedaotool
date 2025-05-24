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

export default OrganizationPaymentHistory;
