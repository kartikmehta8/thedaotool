import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('payman-user');
    return localUser ? JSON.parse(localUser) : null;
  });

  useEffect(() => {
    const syncUser = () => {
      const localUser = localStorage.getItem('payman-user');
      setUser(localUser ? JSON.parse(localUser) : null);
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
