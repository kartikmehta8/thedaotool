import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

const PaymentHistoryTable = React.memo(
  ({ fetchPayments, userId, columns, title }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
      const load = async () => {
        const res = await fetchPayments(userId);
        setData(res);
        setLoading(false);
      };
      load();
    }, [fetchPayments, userId]);

    return (
      <div className="page-container">
        <Card
          title={<Title level={4}>{title}</Title>}
          className="card-theme"
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
  }
);

PaymentHistoryTable.propTypes = {
  fetchPayments: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default PaymentHistoryTable;
