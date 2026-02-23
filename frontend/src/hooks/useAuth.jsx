import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@SalaCerta:user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (codigoAcesso) => {
    if (codigoAcesso === 'sala2026') { 
      const loggedUser = { id: 1, name: 'Administrador' };
      
      setUser(loggedUser);
      localStorage.setItem('@SalaCerta:user', JSON.stringify(loggedUser));
      
      return { success: true };
    }

    return { success: false, message: 'Código de acesso incorreto!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@SalaCerta:user');
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}