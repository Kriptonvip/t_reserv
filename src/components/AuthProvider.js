import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setLoadingAuth(true);
    fetch('/api/auth-token')
      .then(res => res.json())
      .then(data => {
        setToken(data.token);
        setLoadingAuth(false);  
      });
  }, []);

  return (
    <AuthContext.Provider value={{loadingAuth, token}}>   
      {children} 
    </AuthContext.Provider>
  )
}