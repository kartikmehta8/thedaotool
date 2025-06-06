import React from 'react';
import { Tag } from 'antd';
import { getOrganizationPayments } from '../../api/organization/payments';
import formatDate from '../../utils/formatDate';
import { PaymentHistoryTable } from '../../components';

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

const OrganizationPaymentHistory = ({ user }) => (
  <PaymentHistoryTable
    fetchPayments={getOrganizationPayments}
    userId={user.uid}
    columns={columns}
    title="Payment History"
  />
);

export default OrganizationPaymentHistory;
