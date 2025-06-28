import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme as antdTheme } from 'antd';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('app-theme');
    if (stored === null) return true;
    return stored === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', dark ? 'dark' : 'light');
    document.body.className = dark ? 'dark' : 'light';
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  const algorithm = dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, algorithm }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
