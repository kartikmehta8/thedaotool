import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider, { useTheme } from './context/ThemeContext';

import { PrivyProvider } from '@privy-io/react-auth';
import { APP_ID, APP_CLIENT_ID } from './constants/constants';

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
        appId={APP_ID}
        clientId={APP_CLIENT_ID}
        config={{
          embeddedWallets: {
            ethereum: {
              createOnLogin: 'off',
            },
          },
        }}
      >
        <Root />
      </PrivyProvider>
    </ThemeProvider>
  </React.StrictMode>
);
