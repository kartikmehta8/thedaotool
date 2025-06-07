import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Providers = () => {
  const { darkMode } = useTheme();
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Inter, sans-serif',
        },
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </ConfigProvider>
  );
};

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Providers />
    </ThemeProvider>
  </React.StrictMode>
);
