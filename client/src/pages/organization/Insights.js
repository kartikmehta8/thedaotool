import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getOrganizationPayments } from '../../api/organization/payments';
import { getOrganizationAnalytics } from '../../api/organization/profile';
import formatDate from '../../utils/formatDate';
import { PaymentHistoryTable } from '../../components';

const { Title } = Typography;
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];

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

const OrganizationInsights = ({ user }) => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await getOrganizationAnalytics(user.uid);
      setAnalytics(data);
    };
    load();
  }, [user.uid]);

  const statusData = Object.entries(analytics.statusCounts || {}).map(
    ([name, value]) => ({ name, value })
  );
  const monthlyData = Object.entries(analytics.monthlyCounts || {})
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="page-container">
      <Card
        style={{ backgroundColor: '#1f1f1f', marginBottom: 20 }}
        bodyStyle={{ padding: '1rem' }}
      >
        <Title level={4} style={{ color: '#fff' }}>
          Bounties Created
        </Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card
        style={{ backgroundColor: '#1f1f1f', marginBottom: 20 }}
        bodyStyle={{ padding: '1rem' }}
      >
        <Title level={4} style={{ color: '#fff' }}>
          Bounty Status Distribution
        </Title>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" label>
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <PaymentHistoryTable
        fetchPayments={getOrganizationPayments}
        userId={user.uid}
        columns={columns}
        title="Payment History"
      />
    </div>
  );
};

export default OrganizationInsights;
