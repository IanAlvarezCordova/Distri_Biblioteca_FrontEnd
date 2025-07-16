import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface Rol {
  id: number;
  nombre: string;
  [key: string]: any;
}

interface User {
  id: number;
  email: string;
  roles: Rol[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  roles: Rol[];
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Inicialización
  const initialAuth = authService.isAuthenticated();
  const initialRoles = authService.getRoles() as Rol[];
  const initialUser = authService.getUser();

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [roles, setRoles] = useState<Rol[]>(initialRoles);
  const [user, setUser] = useState<User | null>(initialUser);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setIsAuthenticated(true);
    setRoles(user.roles || []);
    setUser(user);
    return Promise.resolve();
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRoles([]);
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    // Verificar autenticación inicial
    const checkInitialAuth = () => {
      const isAuth = authService.isAuthenticated();
      const userRoles = authService.getRoles();
      const currentUser = authService.getUser();

      setIsAuthenticated(isAuth);
      setRoles(userRoles);
      setUser(currentUser);
    };

    checkInitialAuth();

    // Escuchar cambios en localStorage para detectar login/logout en otras pestañas
    const handleStorageChange = () => {
      checkInitialAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};