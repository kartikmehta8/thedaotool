import React, { useEffect, useState } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { useAuth } from '../context/AuthContext';
import { getBalance, sendFunds } from '../api/wallet';
import toast from '../utils/toast';
import AppLayout from '../components/AppLayout';

const { Title } = Typography;

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const load = async () => {
    try {
      const b = await getBalance();
      setBalance(b);
    } catch (err) {
      toast.error('Failed to load balance');
    }
  };

  const handleSend = async () => {
    try {
      await sendFunds(toAddress, Number(amount));
      toast.success('Transaction sent');
      setToAddress('');
      setAmount('');
      load();
    } catch (err) {
      toast.error('Failed to send funds');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout
      contentProps={{
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        },
      }}
    >
      <Card className="card-theme" style={{ marginBottom: 20 }}>
        <Title level={4}>Your Wallet</Title>
        <p>
          <strong>Address:</strong> {user.walletAddress}
        </p>
        <p>
          <strong>Balance:</strong> {balance} SOL
        </p>
      </Card>
      <Card className="form-card card-theme" bodyStyle={{ padding: '1rem' }}>
        <Title level={4}>Send Funds</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
          <Input
            placeholder="Amount (SOL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleSend}
            disabled={!toAddress || !amount}
          >
            Send
          </Button>
        </Space>
      </Card>
    </AppLayout>
  );
};

export default Wallet;
