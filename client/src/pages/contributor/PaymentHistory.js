import React from 'react';
import { Tag } from 'antd';
import { getContributorPayments } from '../../api/contributor/payments';
import formatDate from '../../utils/formatDate';
import { PaymentHistoryTable } from '../../components';

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

const ContributorPaymentHistory = ({ user }) => (
  <PaymentHistoryTable
    fetchPayments={getContributorPayments}
    userId={user.uid}
    columns={columns}
    title="Your Payment History"
  />
);

export default ContributorPaymentHistory;
