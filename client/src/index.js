import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider, { useTheme } from './context/ThemeContext';
import { TourProvider } from './context/TourContext';

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
      <TourProvider>
        <Root />
      </TourProvider>
    </ThemeProvider>
  </React.StrictMode>
);
