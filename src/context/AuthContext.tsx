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
  roles: Rol[]; // <-- Cambia aquí
}

interface AuthContextType {
  isAuthenticated: boolean;
  roles: Rol[]; // <-- Cambia aquí
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    
    // Inicialización con debug
    const initialAuth = authService.isAuthenticated();
    const initialRoles = authService.getRoles() as Rol[];
    const initialUser = authService.getUser();
    
    console.log('🚀 AuthProvider iniciando con:');
    console.log('  - isAuthenticated:', initialAuth);
    console.log('  - roles:', initialRoles);
    console.log('  - user:', initialUser);
    
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
    const [roles, setRoles] = useState<Rol[]>(initialRoles);
    const [user, setUser] = useState<User | null>(initialUser);

    const login = async (email: string, password: string) => {
        console.log('🔐 Login ejecutado con:', { email, password });
        // Llama al login real del servicio
        const user = await authService.login(email, password);
        setIsAuthenticated(true);
        setRoles(user.roles || []);
        setUser(user);
        
        // Forzar un re-render
        return Promise.resolve();
    };

    const logout = () => {
        console.log('🔴 Logout ejecutado - iniciando proceso');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('🧹 localStorage limpiado');
        
        // Actualizar estado
        setIsAuthenticated(false);
        setRoles([]);
        setUser(null); // Limpiar user al cerrar sesión
        console.log('📱 Estado actualizado - isAuthenticated:', false);
        
        // Redirigir a la página de inicio (no al login directamente)
        console.log('🚀 Navegando a "/"');
        navigate('/');
    };

    useEffect(() => {
        console.log('🔄 AuthContext useEffect ejecutado');
        
        // Solo verificar el estado inicial, no actualizar constantemente
        const checkInitialAuth = () => {
            console.log('🔍 Verificando autenticación inicial...');
            const isAuth = authService.isAuthenticated();
            const userRoles = authService.getRoles();
            const currentUser = authService.getUser();
            
            // Solo actualizar si realmente hay cambios
            if (isAuth !== isAuthenticated) {
                setIsAuthenticated(isAuth);
                setRoles(userRoles);
                setUser(currentUser);
            }
        };

        checkInitialAuth();

        // Escuchar cambios en localStorage para detectar login/logout en otras pestañas
        const handleStorageChange = () => {
            console.log('📦 Cambio en localStorage detectado');
            checkInitialAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Eliminar dependencias para evitar loops

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