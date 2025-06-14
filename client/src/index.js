import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider, { useTheme } from './context/ThemeContext';

const Root = () => {
  const { algorithm } = useTheme();
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Inter, sans-serif',
        },
        algorithm,
      }}
    >
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </ConfigProvider>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <PrivyProvider
        appId={process.env.REACT_APP_PRIVY_APP_ID}
        config={{
          embeddedWallets: {
            createOnLogin: 'users',
            provider: 'web3auth',
          },
        }}
      >
        <Root />
      </PrivyProvider>
    </ThemeProvider>
  </React.StrictMode>
);
